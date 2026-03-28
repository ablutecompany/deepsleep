package com.ablute.deepsleep.domain

// The immutable semantic contract between Engine and UI
enum class ConfidenceLevel { HIGH, MEDIUM, LOW }
enum class InputType { AUDIO_INPUT, USAGE_STATS, SENSOR_MOTION, HEALTH_CONNECT }
enum class LearningState { EMERGING, CONSOLIDATED, INSUFFICIENT_HISTORY }
enum class NightStatusCategory { GOOD, FRAGMENTED, POOR, INVALID }

data class NightReviewPayload(
    val statusCategory: NightStatusCategory,
    val nightStatusKey: String, // ex: "STATUS_FRAGMENTED_MIDNIGHT"
    val systemConfidenceScore: Int, // 0-100
    val confidenceLevel: ConfidenceLevel,
    val primaryImpactKey: String?, // ex: "IMPACT_DIGITAL_FRICTION"
    val primaryImpactEvidence: List<String>, // list of Evidence Keys e.g., ["EV_SCREEN_TIME_11M"]
    val priorityActionKey: String, // ex: "ACTION_DEVICE_DISTANCING"
    val learningState: LearningState,
    val requiredInputsPresent: Boolean,
    val missingInputs: List<InputType>
)

// Repository interface reflecting real Room/DataStore interactions for when Track 3 happens
interface NightAnalysisRepository {
    suspend fun fetchLatestNightReview(): NightReviewPayload?
    suspend fun simulateAggressiveBatteryInterrupt() // Exclusively for TDD / Graceful Degradation Testing
}
