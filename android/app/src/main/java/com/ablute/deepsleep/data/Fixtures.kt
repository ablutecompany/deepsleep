package com.ablute.deepsleep.data

import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.delay

class FixtureNightAnalysisRepository(
    private val capabilityManager: SensorCapabilityManager
) : NightAnalysisRepository {

    private var currentFixtureState = FixtureScenario.IDEAL_NIGHT
    enum class FixtureScenario { IDEAL_NIGHT, BATTERY_KILLED }

    override suspend fun fetchLatestNightReview(): NightReviewPayload? {
        delay(600)

        // Native Runtime Truth Injection
        val realMissingInputs = capabilityManager.getMissingInputs()
        val isAudioDegraded = realMissingInputs.contains(InputType.AUDIO_INPUT)
        val isUsageDegraded = realMissingInputs.contains(InputType.USAGE_STATS)

        if (currentFixtureState == FixtureScenario.BATTERY_KILLED) return null

        // Se o OS nos cortou o acesso à framework de som, o Motor nunca pode apontar 
        // Interrupções Acústicas. O Backend Local não mente se estiver cego.
        return if (isAudioDegraded) {
             NightReviewPayload(
                statusCategory = NightStatusCategory.FRAGMENTED,
                nightStatusKey = "STATUS_LOW_EFFICIENCY",
                systemConfidenceScore = 45, // Penalty brutal na ausência de sensor
                confidenceLevel = ConfidenceLevel.LOW,
                primaryImpactKey = null, // Causa mascarada / desconhecida
                primaryImpactEvidence = emptyList(),
                priorityActionKey = "ACTION_KEEP_ROUTINE",
                learningState = LearningState.EMERGING,
                requiredInputsPresent = true,
                missingInputs = realMissingInputs
            )
        } else {
            // Default "Ideal"
            NightReviewPayload(
                statusCategory = NightStatusCategory.FRAGMENTED,
                nightStatusKey = "STATUS_FRAGMENTED",
                systemConfidenceScore = 85,
                confidenceLevel = ConfidenceLevel.HIGH,
                primaryImpactKey = "IMPACT_NOISE_DISRUPTION", // Ex: Ideal detetou cães a ladrar
                primaryImpactEvidence = listOf("EV_NOISE_PEAK_0400", "EV_AWAKE_COUNT_2", "EV_BASELINE_DROP_15"),
                priorityActionKey = "ACTION_DEVICE_DISTANCING",
                learningState = LearningState.CONSOLIDATED,
                requiredInputsPresent = true,
                missingInputs = realMissingInputs
            )
        }
    }

    override suspend fun simulateAggressiveBatteryInterrupt() {
        currentFixtureState = FixtureScenario.BATTERY_KILLED
    }
    
    fun setScenario(scenario: FixtureScenario) {
        currentFixtureState = scenario
    }
}
