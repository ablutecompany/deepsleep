package com.ablute.deepsleep.domain

// The immutable semantic contract between Engine and UI
enum class ConfidenceLevel { HIGH, MEDIUM, LOW }
enum class InputType {
    AUDIO_INPUT,
    USAGE_STATS,
    SENSOR_MOTION,
    HEALTH_CONNECT 
}
enum class LearningState { EMERGING, CONSOLIDATED, INSUFFICIENT_HISTORY }
enum class NightStatusCategory { GOOD, FRAGMENTED, POOR, INVALID }

data class EvidenceItem(
    val evidenceTypeKey: String, // e.g. EVIDENCE_UNLOCK_COUNT
    val evidenceValue: String    // e.g. "2"
)

data class NightReviewPayload(
    val statusCategory: NightStatusCategory,
    val nightStatusKey: String, // ex: "STATUS_FRAGMENTED_MIDNIGHT"
    val systemConfidenceScore: Int, // 0-100
    val confidenceLevel: ConfidenceLevel,
    val primaryImpactKey: String?, // ex: "IMPACT_DIGITAL_FRICTION"
    val primaryImpactEvidence: List<EvidenceItem>, // Refactored to Structured Values
    val priorityActionKey: String, // ex: "ACTION_DEVICE_DISTANCING"
    val learningState: LearningState,
    val requiredInputsPresent: Boolean,
    val missingInputs: List<InputType>
)

// Feature-driven Repository Contract bound to Room
sealed class NightReviewResult {
    data class Success(val payload: NightReviewPayload) : NightReviewResult()
    object NoData : NightReviewResult()
    object Interrupted : NightReviewResult()
}

interface NightAnalysisRepository {
    suspend fun fetchLatestNightReview(): NightReviewResult
    suspend fun simulateAggressiveBatteryInterrupt() // Mock Contract 2.5
}
