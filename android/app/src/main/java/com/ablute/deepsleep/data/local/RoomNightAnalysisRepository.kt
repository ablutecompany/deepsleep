package com.ablute.deepsleep.data.local

import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RoomNightAnalysisRepository(
    private val sessionDao: SessionDao
) : NightAnalysisRepository {

    override suspend fun fetchLatestNightReview(): NightReviewResult = withContext(Dispatchers.IO) {
        val allCount = sessionDao.getAllSessionsCount()
        val validSessions = sessionDao.getValidSessionsSync()

        if (allCount == 0) return@withContext NightReviewResult.NoData
        if (validSessions.isEmpty()) return@withContext NightReviewResult.Interrupted

        val latest = validSessions.first()
        val missing = latest.getMissingInputs()

        val parsedEvidence = if (latest.primaryImpactEvidenceStr.isNotEmpty()) {
            latest.primaryImpactEvidenceStr.split(";").mapNotNull { token ->
                val parts = token.split(":")
                if (parts.size == 2) EvidenceItem(parts[0], parts[1]) else null
            }
        } else emptyList()

        NightReviewResult.Success(
            NightReviewPayload(
                statusCategory = NightStatusCategory.FRAGMENTED,
                nightStatusKey = latest.nightStatusKey ?: "STATUS_UNBROKEN",
                systemConfidenceScore = latest.confidenceScore,
                confidenceLevel = when {
                    latest.confidenceScore > 80 -> ConfidenceLevel.HIGH
                    latest.confidenceScore > 50 -> ConfidenceLevel.MEDIUM
                    else -> ConfidenceLevel.LOW
                },
                primaryImpactKey = latest.primaryImpactKey,
                primaryImpactEvidence = parsedEvidence,
                priorityActionKey = if (latest.primaryImpactKey == "IMPACT_DIGITAL_FRICTION") "ACTION_DEVICE_DISTANCING" else "ACTION_KEEP_ROUTINE",
                learningState = LearningState.EMERGING,
                requiredInputsPresent = missing.isEmpty(),
                missingInputs = missing
            )
        )
    }

    override suspend fun simulateAggressiveBatteryInterrupt() {
        // Obsoleto na Track D. Fallbacks são lidadores pela UI Native da Track 2.
    }
}
