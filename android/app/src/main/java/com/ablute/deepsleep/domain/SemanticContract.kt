package com.ablute.deepsleep.domain

// ==========================================
// CONTRAINT REQUIREMENTS (Fase H)
// ==========================================

data class NightReviewPayload(
    val missingInputs: List<String>,
    val degradedInsights: List<String>,
    val inconclusiveInsights: List<String>,
    val confidenceBand: ConfidenceBand,
    val disclosureCopy: String,
    
    // Core empirical metrics (Mocked or passed through from phase 1 legacy)
    val nightStatusKey: String,
    val primaryImpactKey: String?,
    val priorityActionKey: String
)

sealed class NightReviewResult {
    data class Success(val payload: NightReviewPayload) : NightReviewResult()
    object NoData : NightReviewResult()
    data class Interrupted(val reason: String, val disclosure: String) : NightReviewResult()
    data class InvalidTooShort(val disclosure: String) : NightReviewResult()
}

interface NightAnalysisRepository {
    suspend fun fetchLatestNightReview(): NightReviewResult
}

