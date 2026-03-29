package com.ablute.deepsleep.domain

// ==========================================
// FASE F — SIGNALINFERENCEENGINE
// ==========================================

class SignalInferenceEngine {

    fun evaluateCapabilities(snapshot: CapabilitySnapshot): Pair<InferenceAvailability, InferenceDegradationSummary> {
        val reasons = mutableListOf<String>()
        var severity = 0
        
        // Even without audio, we don't collapse.
        if (snapshot.audioCapability == AudioCapability.DENIED) {
            reasons.add("Acoustic mapping suspended (Missing permission)")
            severity += 1
        }
        
        if (snapshot.deviceUsageCapability != DeviceUsageCapability.GRANTED) {
            reasons.add("Digital friction correlation disabled")
            severity += 1
        }
        
        // Critical Movement fallback check
        val isSessionValid = snapshot.rawMovementCapability == RawMovementCapability.AVAILABLE
        if (!isSessionValid) {
            reasons.add("Fatal: Raw mechanical sensing unavailable")
            severity += 5
        } else if (snapshot.activityDerivedMovementCapability != ActivityDerivedMovementCapability.AVAILABLE) {
            reasons.add("Semantic phase classification constrained to mechanical approximations")
            severity += 2
        }

        return Pair(
            InferenceAvailability(
                isSessionValid = isSessionValid,
                isDegraded = severity > 0
            ),
            InferenceDegradationSummary(
                severityLevel = severity,
                reasonList = reasons
            )
        )
    }

    fun produceInsightMap(snapshot: CapabilitySnapshot): InsightAvailabilityMap {
        val available = mutableListOf("SLEEP_DURATION", "MECHANICAL_FRAGMENTATION")
        val inconclusive = mutableListOf<String>()
        val amputated = mutableListOf<String>()

        when (snapshot.audioCapability) {
            AudioCapability.GRANTED -> available.add("ACOUSTIC_INTERRUPTIONS")
            AudioCapability.TEMPORARILY_UNAVAILABLE -> inconclusive.add("ACOUSTIC_INTERRUPTIONS")
            else -> amputated.add("ACOUSTIC_INTERRUPTIONS")
        }

        when (snapshot.deviceUsageCapability) {
            DeviceUsageCapability.GRANTED -> available.add("DIGITAL_FRICTION")
            else -> amputated.add("DIGITAL_FRICTION")
        }

        if (snapshot.healthConnectCapability.overallState == HealthConnectState.AVAILABLE) {
            available.add("HRV_RECOVERY")
            available.add("BLOOD_OXYGEN")
        } else {
            amputated.add("WEARABLE_ENRICHMENT")
        }

        if (snapshot.activityDerivedMovementCapability == ActivityDerivedMovementCapability.AVAILABLE) {
            available.add("SEMANTIC_SLEEP_STAGES")
        } else {
            inconclusive.add("SEMANTIC_SLEEP_STAGES") // Can't be certain with just raw accel
        }

        return InsightAvailabilityMap(available, inconclusive, amputated)
    }

    fun calculateConfidenceBand(snapshot: CapabilitySnapshot): ConfidenceBand {
        // Start high, drop based on hardware truth limits
        var score = 100
        
        if (snapshot.rawMovementCapability != RawMovementCapability.AVAILABLE) return ConfidenceBand.UNKNOWN
        
        if (snapshot.activityDerivedMovementCapability != ActivityDerivedMovementCapability.AVAILABLE) score -= 30
        if (snapshot.audioCapability != AudioCapability.GRANTED) score -= 15
        if (snapshot.wearableMovementEnrichment != WearableMovementEnrichment.AVAILABLE) score -= 10
        if (snapshot.deviceUsageCapability != DeviceUsageCapability.GRANTED) score -= 5

        return when {
            score >= 80 -> ConfidenceBand.HIGH
            score >= 50 -> ConfidenceBand.MODERATE
            score >= 20 -> ConfidenceBand.LOW
            else -> ConfidenceBand.UNKNOWN
        }
    }
}
