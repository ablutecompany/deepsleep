package com.ablute.deepsleep.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class NightSessionService : Service() {
    companion object {
        const val CHANNEL_ID = "deepsleep_session_channel"
        const val NOTIFICATION_ID = 1432
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Existed explicitly for monitoring, deliberately shielding the OS memory killer
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("_deepSleep: Monitorização Armada")
            .setContentText("Sessão noturna ativa. Sensores locais em escuta restrita.")
            .setSmallIcon(android.R.drawable.ic_menu_compass) 
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()
        
        startForeground(NOTIFICATION_ID, notification)
        
        // Not sticky: If crashed, it crashes gracefully and UI degrades to Interrupted morning
        return START_NOT_STICKY 
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
         val channel = NotificationChannel(
                CHANNEL_ID,
                "Sessão Nocturna",
                NotificationManager.IMPORTANCE_LOW
          ).apply {
              description = "Silicone para persistência de processamento heurístico local"
          }
          val manager = getSystemService(NotificationManager::class.java)
          manager.createNotificationChannel(channel)
    }
}
