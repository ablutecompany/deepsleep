package com.ablute.deepsleep.data

import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.delay

class FixtureNightAnalysisRepository : NightAnalysisRepository {
    
    // We hold a state to allow simulated mutation (e.g., degraded or battery kill scenario)
    private var currentFixtureState = FixtureScenario.IDEAL_NIGHT

    enum class FixtureScenario { IDEAL_NIGHT, DEGRADED_AUDIO, BATTERY_KILLED }

    override suspend fun fetchLatestNightReview(): NightReviewPayload? {
        // Simular latência de IO/Room Database query
        delay(600)

        return when (currentFixtureState) {
            FixtureScenario.IDEAL_NIGHT -> NightReviewPayload(
                statusCategory = NightStatusCategory.FRAGMENTED,
                nightStatusKey = "STATUS_FRAGMENTED", // Maps to "Noite fragmentada"
                systemConfidenceScore = 85,
                confidenceLevel = ConfidenceLevel.HIGH,
                primaryImpactKey = "IMPACT_DIGITAL_FRICTION", // Maps to "Ecrã ligado na madrugada"
                primaryImpactEvidence = listOf("EV_AWAKE_COUNT_2", "EV_UNLOCK_TIME_0341", "EV_CONTINUOUS_SCREEN_11M", "EV_BASELINE_DROP_15"),
                priorityActionKey = "ACTION_DEVICE_DISTANCING", // Maps to "Telemóvel longe da cama"
                learningState = LearningState.CONSOLIDATED,
                requiredInputsPresent = true,
                missingInputs = emptyList()
            )
            FixtureScenario.DEGRADED_AUDIO -> NightReviewPayload(
                statusCategory = NightStatusCategory.GOOD,
                nightStatusKey = "STATUS_UNBROKEN",
                systemConfidenceScore = 60,
                confidenceLevel = ConfidenceLevel.MEDIUM,
                primaryImpactKey = null,
                primaryImpactEvidence = emptyList(),
                priorityActionKey = "ACTION_KEEP_ROUTINE",
                learningState = LearningState.EMERGING,
                requiredInputsPresent = true,
                missingInputs = listOf(InputType.AUDIO_INPUT) // UI will mask acoustic inference
            )
            FixtureScenario.BATTERY_KILLED -> null // Represents session_interrupted / too_short
        }
    }

    override suspend fun simulateAggressiveBatteryInterrupt() {
        currentFixtureState = FixtureScenario.BATTERY_KILLED
    }
    
    fun setScenario(scenario: FixtureScenario) {
        currentFixtureState = scenario
    }
}
