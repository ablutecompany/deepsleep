package com.ablute.deepsleep.ui.home

sealed interface HomeUiState {
    object Loading : HomeUiState
    object NoData : HomeUiState
    object ProcessingPending : HomeUiState
    data class SessionInterrupted(val reasonText: String) : HomeUiState
    
    data class NightReviewReady(
        val headline: String,
        val systemConfidenceScore: Int,
        val confidenceLabel: String,
        val primaryImpactTitle: String?,
        val primaryImpactDesc: String?,
        val priorityActionTitle: String,
        val priorityActionDesc: String,
        val learningStateText: String,
        val hasDegradedAudio: Boolean,
        val hasDegradedUsage: Boolean
    ) : HomeUiState
}
