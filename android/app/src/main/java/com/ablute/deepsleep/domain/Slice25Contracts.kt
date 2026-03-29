package com.ablute.deepsleep.domain

// ==========================================
// FASE A — CONTRATOS E TIPOS BASE
// ==========================================

// --- Capability Models (Truth Layer) ---
data class CapabilitySnapshot(
    val audioCapability: AudioCapability,
    val deviceUsageCapability: DeviceUsageCapability,
    val rawMovementCapability: RawMovementCapability,
    val activityDerivedMovementCapability: ActivityDerivedMovementCapability,
    val healthConnectCapability: HealthConnectCapability,
    val wearableMovementEnrichment: WearableMovementEnrichment,
    val missingInputs: List<String>,
    val degradedReasons: List<String>,
    val capturedAtMs: Long
)

enum class AudioCapability {
    GRANTED, DENIED, NOT_REQUESTED, REVOKED, TEMPORARILY_UNAVAILABLE
}

enum class DeviceUsageCapability {
    GRANTED, NOT_GRANTED, NOT_SUPPORTED, REVOKED
}

enum class RawMovementCapability {
    AVAILABLE, MISSING, UNSTABLE, RATE_LIMITED
}

enum class ActivityDerivedMovementCapability {
    AVAILABLE, NOT_GRANTED, NOT_SUPPORTED, DEGRADED
}

enum class WearableMovementEnrichment {
    AVAILABLE, NOT_CONNECTED, NOT_SUPPORTED, DEGRADED
}

data class HealthConnectCapability(
    val sdkStatus: String,
    val featureAvailability: String,
    val providerStatus: String,
    val permissionStateByDataType: Map<String, Boolean>,
    val overallState: HealthConnectState
)

enum class HealthConnectState {
    AVAILABLE, PROVIDER_UPDATE_REQUIRED, NOT_INSTALLED_OR_DISABLED, FEATURE_UNAVAILABLE, PERMISSION_MISSING, DEGRADED
}

// --- Inference Models (Weighting Layer) ---
data class InferenceAvailability(
    val isSessionValid: Boolean,
    val isDegraded: Boolean
)

data class InsightAvailabilityMap(
    val availableInsights: List<String>,
    val inconclusiveInsights: List<String>,
    val amputatedInsights: List<String>
)

enum class ConfidenceBand {
    HIGH, MODERATE, LOW, UNKNOWN
}

data class InferenceDegradationSummary(
    val severityLevel: Int,
    val reasonList: List<String>
)

// --- Consent & UI Models (Transparency Layer) ---
enum class AccessType {
    RUNTIME_PERMISSION, SPECIAL_APP_ACCESS, PLATFORM_OR_FEATURE_AVAILABILITY
}

data class ConsentPromptModel(
    val capabilityRequested: String,
    val whyWeAsk: String,
    val accessType: AccessType
)

data class AccessStatusModel(
    val capability: String,
    val isGranted: Boolean,
    val canAskAgain: Boolean,
    val howToRestoreLater: String
)

data class FallbackDisclosureModel(
    val whatImprovesIfGranted: String,
    val whatStillWorksIfDenied: String,
    val whatWillBeUnavailable: String
)

data class RevocationHandlingModel(
    val capabilityRevoked: String,
    val impactOnSession: String
)

// --- Session Lifecycle Taxonomy ---
enum class SessionTerminationReason {
    COMPLETED,
    STOPPED_BY_USER,
    INTERRUPTED_LIKELY_SYSTEM,
    INTERRUPTED_LIKELY_CRASH,
    INVALID_TOO_SHORT,
    ABANDONED,
    UNKNOWN_TERMINATION
}
