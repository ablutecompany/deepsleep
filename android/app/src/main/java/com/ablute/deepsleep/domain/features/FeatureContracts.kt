package com.ablute.deepsleep.domain.features

data class AudioFeatureSet(
    val isAvailable: Boolean,
    val peakNoiseLevelDb: Int?,
    val noiseInterruptionCount: Int,
    val signalConfidence: Int 
)

data class UsageFeatureSet(
    val isAvailable: Boolean,
    val totalUnlocks: Int,
    val longestScreenOnDurationMs: Long
)

data class NightFeatureMatrix(
    val audio: AudioFeatureSet,
    val usage: UsageFeatureSet
)
