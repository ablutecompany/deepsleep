package com.ablute.deepsleep.data

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

// ==========================================
// FASE D — PERSISTÊNCIA
// ==========================================

val Context.dataStore by preferencesDataStore(name = "runtime_continuity_spine")

class SessionStateStore(private val context: Context) {
    
    // The explicit mandatory baseline keys requested:
    private val SESSION_ID = stringPreferencesKey("session_id")
    private val SESSION_ACTIVE = booleanPreferencesKey("session_active")
    private val LAST_SESSION_START_MS = longPreferencesKey("last_session_start_ms")
    private val LAST_HEARTBEAT_MS = longPreferencesKey("last_heartbeat_ms")
    private val LAST_STOP_REASON = stringPreferencesKey("last_stop_reason")
    private val LAST_CAPABILITY_SNAPSHOT = stringPreferencesKey("last_capability_snapshot")
    private val START_TRIGGER = stringPreferencesKey("start_trigger")
    private val APP_VERSION_AT_START = stringPreferencesKey("app_version_at_start")
    
    // Old flags preserved to ensure app doesn't break compilation immediately
    private val ONBOARDING_KEY = booleanPreferencesKey("onboarding_complete")
    private val AUTH_KEY = booleanPreferencesKey("is_authenticated")

    val isSessionActiveFlow: Flow<Boolean> = context.dataStore.data.map { p -> p[SESSION_ACTIVE] ?: false }
    val sessionStartTimeMsFlow: Flow<Long> = context.dataStore.data.map { p -> p[LAST_SESSION_START_MS] ?: 0L }
    val hasCompletedOnboardingFlow: Flow<Boolean> = context.dataStore.data.map { p -> p[ONBOARDING_KEY] ?: false }
    val isAuthenticatedFlow: Flow<Boolean> = context.dataStore.data.map { p -> p[AUTH_KEY] ?: false }

    suspend fun markSessionStart(sessionId: String, timeMs: Long, trigger: String, appVersion: String, capabilitySnapshotJson: String) {
        context.dataStore.edit { p ->
            p[SESSION_ID] = sessionId
            p[SESSION_ACTIVE] = true
            p[LAST_SESSION_START_MS] = timeMs
            p[START_TRIGGER] = trigger
            p[APP_VERSION_AT_START] = appVersion
            p[LAST_CAPABILITY_SNAPSHOT] = capabilitySnapshotJson
        }
    }

    suspend fun markHeartbeat(timeMs: Long) {
        context.dataStore.edit { p ->
            p[LAST_HEARTBEAT_MS] = timeMs
        }
    }

    suspend fun markSessionEnd(reasonTag: String) {
        context.dataStore.edit { p ->
            p[SESSION_ACTIVE] = false
            p[LAST_STOP_REASON] = reasonTag
        }
    }
    
    suspend fun markOnboardingComplete() {
        context.dataStore.edit { p ->
            p[ONBOARDING_KEY] = true
        }
    }

    suspend fun setAuthenticated(isAuthenticated: Boolean) {
        context.dataStore.edit { p ->
            p[AUTH_KEY] = isAuthenticated
        }
    }
}
