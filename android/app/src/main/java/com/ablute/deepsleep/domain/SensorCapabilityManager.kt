package com.ablute.deepsleep.domain

import android.app.AppOpsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Process
import androidx.core.content.ContextCompat

// ==========================================
// FASE B — SENSORCAPABILITYMANAGER
// ==========================================

class SensorCapabilityManager(private val context: Context) {

    // Truth Operational Layer only.
    // Does not mutate Confidence Score. Does not amputate insights.

    fun produceSnapshot(): CapabilitySnapshot {
        val audioStatus = if (hasAudioAccess()) AudioCapability.GRANTED else AudioCapability.DENIED
        val usageStatus = if (hasUsageAccess()) DeviceUsageCapability.GRANTED else DeviceUsageCapability.NOT_GRANTED
        
        val missing = mutableListOf<String>()
        val degraded = mutableListOf<String>()

        if (audioStatus == AudioCapability.DENIED) {
            missing.add("AUDIO_INPUT")
            degraded.add("Lacking acoustic validation")
        }
        if (usageStatus == DeviceUsageCapability.NOT_GRANTED) {
            missing.add("DEVICE_USAGE")
            degraded.add("Missing digital friction correlation")
        }

        return CapabilitySnapshot(
            audioCapability = audioStatus,
            deviceUsageCapability = usageStatus,
            rawMovementCapability = RawMovementCapability.AVAILABLE, // Assuming baseline hardware exists
            activityDerivedMovementCapability = ActivityDerivedMovementCapability.NOT_SUPPORTED,
            healthConnectCapability = HealthConnectCapability("UNAVAILABLE", "UNAVAILABLE", "NONE", emptyMap(), HealthConnectState.NOT_INSTALLED_OR_DISABLED),
            wearableMovementEnrichment = WearableMovementEnrichment.NOT_CONNECTED,
            missingInputs = missing,
            degradedReasons = degraded,
            capturedAtMs = System.currentTimeMillis()
        )
    }

    private fun hasAudioAccess(): Boolean {
        return ContextCompat.checkSelfPermission(
            context, 
            android.Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun hasUsageAccess(): Boolean {
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
}
