package com.ablute.deepsleep.data.local

import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RoomNightAnalysisRepository(
    private val inferenceEngine: SignalInferenceEngine,
    private val capabilityManager: SensorCapabilityManager,
    private val orchestrator: ConsentOrchestrator
) : NightAnalysisRepository {

    override suspend fun fetchLatestNightReview(): NightReviewResult = withContext(Dispatchers.IO) {
        
        // Simulating the fetch of the last session state from StateStore.
        // In a real flow, we would read the LAST_STOP_REASON from DataStore.
        // For the sake of this wiring, we will assume a Completed session, 
        // but evaluating actual hardware snapshot dynamically.
        
        val snapshot = capabilityManager.produceSnapshot()
        val (availability, degradation) = inferenceEngine.evaluateCapabilities(snapshot)
        val insightMap = inferenceEngine.produceInsightMap(snapshot)
        val confidence = inferenceEngine.calculateConfidenceBand(snapshot)
        
        // 1. Check fatal conditions first (Invalid / Interrupted)
        if (!availability.isSessionValid) {
             val fallback = orchestrator.getFallbackDisclosure("SENSOR_MOTION")
             return@withContext NightReviewResult.Interrupted(
                 reason = "Missing vital movement capability",
                 disclosure = "Sessão interrompida. " + fallback.whatWillBeUnavailable
             )
        }
        
        // 2. Build polite disclosure based on missing/degraded inputs
        val disclosure = StringBuilder()
        if (snapshot.missingInputs.isNotEmpty()) {
            if (snapshot.missingInputs.contains("AUDIO_INPUT")) {
                disclosure.append("Esta leitura foi feita sem entrada acústica. ")
            }
            if (snapshot.missingInputs.contains("DEVICE_USAGE")) {
                disclosure.append("Alguns sinais contextuais (fricção) não estavam disponíveis esta noite. ")
            }
        }
        
        if (confidence == ConfidenceBand.MODERATE || confidence == ConfidenceBand.LOW) {
            disclosure.append("A confiança desta leitura é ${if(confidence == ConfidenceBand.MODERATE) "moderada" else "baixa"} devido a dados em falta.")
        } else {
            if (disclosure.isEmpty()) {
                disclosure.append("Sinais estruturais limpos e estáveis.")
            }
        }

        NightReviewResult.Success(
            NightReviewPayload(
                missingInputs = snapshot.missingInputs,
                degradedInsights = degradation.reasonList,
                inconclusiveInsights = insightMap.inconclusiveInsights,
                confidenceBand = confidence,
                disclosureCopy = disclosure.toString().trim(),
                nightStatusKey = "STATUS_FRAGMENTED", // Legacy stub
                primaryImpactKey = "IMPACT_UNKNOWN", // Legacy stub
                priorityActionKey = "ACTION_KEEP_ROUTINE" // Legacy stub
            )
        )
    }
}
