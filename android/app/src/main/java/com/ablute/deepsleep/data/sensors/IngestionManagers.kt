package com.ablute.deepsleep.data.sensors

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.media.MediaRecorder
import com.ablute.deepsleep.domain.SensorCapabilityManager
import com.ablute.deepsleep.domain.features.AudioFeatureSet
import com.ablute.deepsleep.domain.features.UsageFeatureSet
import kotlinx.coroutines.*
import java.io.File
import kotlin.math.log10

class AudioIngestionManager(
    private val capabilityManager: SensorCapabilityManager,
    private val context: Context
) {
    var isCapturing = false
        private set

    private var recorder: MediaRecorder? = null
    private var job: Job? = null
    private var peakDb = 0
    private var noiseEventCount = 0

    fun startSessionCapture() {
        if (!capabilityManager.hasAudioAccess()) return
        isCapturing = true
        peakDb = 0
        noiseEventCount = 0

        try {
            val file = File(context.cacheDir, "temp_deepsleep_audio.3gp")
            val newRecorder = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                MediaRecorder(context)
            } else {
                @Suppress("DEPRECATION")
                MediaRecorder()
            }
            
            newRecorder.setAudioSource(MediaRecorder.AudioSource.MIC)
            newRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            newRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
            newRecorder.setOutputFile(file.absolutePath)
            newRecorder.prepare()
            newRecorder.start()
            
            recorder = newRecorder

            job = CoroutineScope(Dispatchers.IO).launch {
                while(isActive && isCapturing) {
                    delay(5000) // Poll amplitude every 5 seconds limits battery drain
                    val maxAmp = recorder?.maxAmplitude ?: 0
                    
                    if (maxAmp > 0) {
                        val db = (20 * log10(maxAmp.toDouble())).toInt()
                        if (db > peakDb) peakDb = db
                        if (db > 65) noiseEventCount++ 
                    }
                }
            }
        } catch (e: Exception) {
            isCapturing = false
            recorder?.release()
            recorder = null
        }
    }

    fun stopSessionCapture(): AudioFeatureSet {
        if (!isCapturing || !capabilityManager.hasAudioAccess()) {
            isCapturing = false
            return AudioFeatureSet(false, null, 0, 0)
        }
        
        isCapturing = false
        job?.cancel()
        
        return try {
            recorder?.stop()
            recorder?.release()
            recorder = null
            
            AudioFeatureSet(
                isAvailable = true,
                peakNoiseLevelDb = if (peakDb > 0) peakDb else 30, // baseline limit room db
                noiseInterruptionCount = noiseEventCount,
                signalConfidence = 90
            )
        } catch(e: Exception) {
            recorder?.release()
            recorder = null
            AudioFeatureSet(isAvailable = false, peakNoiseLevelDb = null, noiseInterruptionCount = 0, signalConfidence = 0)
        }
    }
}

class UsageIngestionManager(
    private val context: Context,
    private val capabilityManager: SensorCapabilityManager
) {
    var isActive = false
        private set

    fun prepareSession() {
        if (!capabilityManager.hasUsageAccess()) return
        isActive = true
    }

    fun stopSessionAndExtract(startTimeMs: Long, endTimeMs: Long): UsageFeatureSet {
         if (!capabilityManager.hasUsageAccess() || !isActive) {
            isActive = false
            return UsageFeatureSet(isAvailable = false, 0, 0L)
        }
        isActive = false
        
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val events = usm.queryEvents(startTimeMs, endTimeMs)
        
        var unlocks = 0
        var maxScreenOnTimeMs = 0L
        var currentScreenOnStart = 0L
        
        val event = UsageEvents.Event()
        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.KEYGUARD_HIDDEN) {
                unlocks++
            }
            if (event.eventType == UsageEvents.Event.SCREEN_INTERACTIVE) {
                 currentScreenOnStart = event.timeStamp
            }
            if (event.eventType == UsageEvents.Event.SCREEN_NON_INTERACTIVE) {
                 if (currentScreenOnStart > 0) {
                     val diff = event.timeStamp - currentScreenOnStart
                     if (diff > maxScreenOnTimeMs) maxScreenOnTimeMs = diff
                     currentScreenOnStart = 0L
                 }
            }
        }
        
        // Retorna a verdade absoluta captada pela AppOps do Android, mesmo sendo zero.
        return UsageFeatureSet(
            isAvailable = true,
            totalUnlocks = unlocks,
            longestScreenOnDurationMs = maxScreenOnTimeMs
        )
    }
}
