package com.ablute.deepsleep.domain

import android.app.AppOpsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Process
import androidx.core.content.ContextCompat

class SensorCapabilityManager(private val context: Context) {

    fun hasAudioAccess(): Boolean {
        return ContextCompat.checkSelfPermission(
            context, 
            android.Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
    }

    fun hasUsageAccess(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.packageName)
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }
    
    // Delivers the real truth about runtime environment to the engine
    fun getMissingInputs(): List<InputType> {
        val missing = mutableListOf<InputType>()
        
        if (!hasAudioAccess()) {
            missing.add(InputType.AUDIO_INPUT)
        }
        
        if (!hasUsageAccess()) {
            missing.add(InputType.USAGE_STATS)
        }
        
        missing.add(InputType.HEALTH_CONNECT)
        
        return missing
    }
}
