package com.ablute.deepsleep.domain

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.ablute.deepsleep.data.SessionStateStore
import kotlinx.coroutines.*
import java.util.UUID

// ==========================================
// FASE E — NIGHTSESSIONSERVICE
// ==========================================

class NightSessionService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private lateinit var stateStore: SessionStateStore
    private lateinit var capabilityManager: SensorCapabilityManager
    
    private var isSessionActive = false
    private var currentSessionId: String? = null
    
    companion object {
        private const val CHANNEL_ID = "deepsleep_night_session_channel"
        private const val NOTIFICATION_ID = 4040
        const val ACTION_START = "ACTION_START_NIGHT_SESSION" // Explicit user trigger
        const val ACTION_STOP = "ACTION_STOP_NIGHT_SESSION"   // Explicit user stop
    }

    override fun onCreate() {
        super.onCreate()
        stateStore = SessionStateStore(this)
        capabilityManager = SensorCapabilityManager(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startSession()
            ACTION_STOP -> stopSession(SessionTerminationReason.STOPPED_BY_USER)
        }
        return START_STICKY
    }

    private fun startSession() {
        if (isSessionActive) return
        
        isSessionActive = true
        val snapshot = capabilityManager.produceSnapshot()
        
        // 1. Promote to Foreground instantly with conditional Types based on Truth Layer
        val notification = buildPersistentNotification()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            var serviceTypes = ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH
            
            if (snapshot.audioCapability == AudioCapability.GRANTED && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // If we have Audio granted, we must declare it to the OS at runtime
                serviceTypes = serviceTypes or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
            }
            
            try {
                startForeground(NOTIFICATION_ID, notification, serviceTypes)
            } catch (e: SecurityException) {
                // RUNTIME SAFETY HARDENING: OS revoked permission between snapshot and Foreground Start.
                // Fallback cleanly to HEALTH type to keep the structural session alive without crash.
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH)
            }
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        currentSessionId = UUID.randomUUID().toString()
        val startTime = System.currentTimeMillis()

        // 2. Persist initial context rigorously
        serviceScope.launch {
            stateStore.markSessionStart(
                sessionId = currentSessionId!!,
                timeMs = startTime,
                trigger = "USER_CTA_TONIGHT",
                appVersion = "1.0", // Hardcoded or from BuildConfig
                capabilitySnapshotJson = "TODO_SERIALIZED_SNAPSHOT" // Mocking JSON string for now
            )
            
            // 3. Heartbeat Loop
            while (isSessionActive) {
                stateStore.markHeartbeat(System.currentTimeMillis())
                delay(60_000L) // 1 minute heartbeat
            }
        }
    }

    private fun stopSession(reason: SessionTerminationReason) {
        if (!isSessionActive) return
        
        isSessionActive = false
        
        serviceScope.launch {
            // Note: If session was < 45 mins, reason could be INVALID_TOO_SHORT
            // But we'll trust the parameter here and let a higher orchestrator validate the time if needed.
            stateStore.markSessionEnd(reason.name)
            stopForeground(true)
            stopSelf()
        }
    }

    private fun buildPersistentNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("_deepSleep")
            .setContentText("A recolher dados da noite. Confiança operacional ativa.")
            .setSmallIcon(android.R.drawable.ic_media_play) // Placeholder
            .setOngoing(true)
            .setSilent(true) // Silent persistent notification
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Sleep Monitoring",
                NotificationManager.IMPORTANCE_LOW 
            ).apply {
                description = "Mantém a _deepSleep ativa de madrugada."
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        // Here we cannot reliably know if it's a crash, OS kill, or clean exit.
        // The heartbeat mechanism will be read at next app start to classify INTERRUPTED_LIKELY_SYSTEM vs SYSTEM_CRASH
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
