package com.ablute.deepsleep.domain

import com.ablute.deepsleep.domain.features.NightFeatureMatrix

class SignalInferenceEngine {

    fun runInference(matrix: NightFeatureMatrix, durationMs: Long, missingInputs: List<InputType>): NightReviewPayload {
        
        // Inference Base Confidence begins based on presence of vectors
        var confidence = 95
        val evidenceList = mutableListOf<EvidenceItem>()
        var primaryImpact: String? = null
        var priorityAction = "ACTION_DEVICE_DISTANCING"
        var nightStatus = "STATUS_UNBROKEN"

        // Degradation 
        if (missingInputs.isNotEmpty()) {
            confidence -= 20 * missingInputs.size
        }

        // 1. Digital Friction Extraction 
        if (matrix.usage.isAvailable && matrix.usage.totalUnlocks > 0) {
            primaryImpact = "IMPACT_DIGITAL_FRICTION"
            nightStatus = "STATUS_FRAGMENTED"
            priorityAction = "ACTION_DEVICE_DISTANCING"
            
            evidenceList.add(EvidenceItem("EVIDENCE_UNLOCK_COUNT", matrix.usage.totalUnlocks.toString()))
            
            if (matrix.usage.longestScreenOnDurationMs > 60000L) {
                 val minutes = matrix.usage.longestScreenOnDurationMs / 60000L
                 evidenceList.add(EvidenceItem("EVIDENCE_SCREEN_DURATION_MIN", minutes.toString()))
            }
        } 
        // 2. Acústico Extraction
        else if (matrix.audio.isAvailable && matrix.audio.noiseInterruptionCount > 0) {
            primaryImpact = "IMPACT_NOISE_DISRUPTION"
            nightStatus = "STATUS_LOW_EFFICIENCY"
            priorityAction = "ACTION_KEEP_ROUTINE"
            
            evidenceList.add(EvidenceItem("EVIDENCE_NOISE_PULSES", matrix.audio.noiseInterruptionCount.toString()))
            if (matrix.audio.peakNoiseLevelDb != null) {
                evidenceList.add(EvidenceItem("EVIDENCE_NOISE_PEAK_DB", matrix.audio.peakNoiseLevelDb.toString()))
            }
        } 
        // 3. Fallback / Unbroken
        else {
            if (missingInputs.isEmpty()) {
                evidenceList.add(EvidenceItem("EVIDENCE_CLEAN_SIGNALS", "true"))
                priorityAction = "ACTION_KEEP_ROUTINE"
            } else {
                nightStatus = "STATUS_LOW_EFFICIENCY"
                evidenceList.add(EvidenceItem("EVIDENCE_INSUFFICIENT_PROOFS", "true"))
                priorityAction = "ACTION_KEEP_ROUTINE"
            }
        }

        val level = when {
             confidence > 80 -> ConfidenceLevel.HIGH
             confidence > 50 -> ConfidenceLevel.MEDIUM
             else -> ConfidenceLevel.LOW
        }

        return NightReviewPayload(
            statusCategory = NightStatusCategory.FRAGMENTED,
            nightStatusKey = nightStatus,
            systemConfidenceScore = confidence.coerceAtLeast(10),
            confidenceLevel = level,
            primaryImpactKey = primaryImpact,
            primaryImpactEvidence = evidenceList,
            priorityActionKey = priorityAction,
            learningState = LearningState.EMERGING,
            requiredInputsPresent = missingInputs.isEmpty(),
            missingInputs = missingInputs
        )
    }
}
