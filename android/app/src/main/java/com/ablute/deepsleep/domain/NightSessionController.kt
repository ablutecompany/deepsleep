package com.ablute.deepsleep.domain

import android.content.Context
import android.content.Intent
import com.ablute.deepsleep.data.SessionStateStore
import com.ablute.deepsleep.data.sensors.AudioIngestionManager
import com.ablute.deepsleep.data.sensors.UsageIngestionManager
import com.ablute.deepsleep.services.NightSessionService
import com.ablute.deepsleep.data.local.SessionDao
import com.ablute.deepsleep.data.local.HistoricalSession
import com.ablute.deepsleep.domain.SensorCapabilityManager
import kotlinx.coroutines.flow.first

import com.ablute.deepsleep.domain.features.NightFeatureMatrix

class NightSessionController(
    private val context: Context,
    private val store: SessionStateStore,
    private val audioManager: AudioIngestionManager,
    private val usageManager: UsageIngestionManager,
    private val sessionDao: SessionDao,
    private val capabilityManager: SensorCapabilityManager,
    private val signalEngine: com.ablute.deepsleep.domain.SignalInferenceEngine
) {
    // Isolates Android Framework specifics (Intents, Context) from the pure Kotlin ViewModels
    
    suspend fun spawnNightSession() {
        store.markSessionStart(System.currentTimeMillis())
        audioManager.startSessionCapture()
        usageManager.prepareSession()

        val intent = Intent(context, NightSessionService::class.java)
        context.startForegroundService(intent)
    }

    suspend fun terminateNightSession() {
        // Read start time before clearing state
        val startTime = store.sessionStartTimeMsFlow.first()
        val endTime = System.currentTimeMillis()
        val durationMs = endTime - startTime
        
        // Product Logic Layer: Valid session requires 2 hours runtime
        val isValid = durationMs >= 7200000L

        // Record physical sensor capability drops during this specific night
        val missingInputs = capabilityManager.getMissingInputs()
        val missingList = missingInputs.joinToString(",") { it.name }

        val audioFeat = audioManager.stopSessionCapture()
        val usageFeat = usageManager.stopSessionAndExtract(startTime, endTime)
        
        val payload = signalEngine.runInference(NightFeatureMatrix(audioFeat, usageFeat), durationMs, missingInputs)
        // Persist real evidence mathematically serialized
        val evidenceStr = payload.primaryImpactEvidence.joinToString(";") { "${it.evidenceTypeKey}:${it.evidenceValue}" } 

        sessionDao.insertSession(
             HistoricalSession(
                 startTimeMs = startTime,
                 endTimeMs = endTime,
                 isValid = isValid,
                 missingInputsStr = missingList,
                 primaryImpactKey = if (isValid) payload.primaryImpactKey else null,
                 nightStatusKey = if (isValid) payload.nightStatusKey else "STATUS_INVALID",
                 confidenceScore = if (isValid) payload.systemConfidenceScore else 0,
                 primaryImpactEvidenceStr = evidenceStr 
             )
        )

        store.markSessionEnd()
        audioManager.stopSessionCapture()
        usageManager.stopSession()

        val intent = Intent(context, NightSessionService::class.java)
        context.stopService(intent)
    }
}
