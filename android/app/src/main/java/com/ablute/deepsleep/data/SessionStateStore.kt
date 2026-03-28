package com.ablute.deepsleep.data

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore by preferencesDataStore(name = "runtime_continuity_spine")

class SessionStateStore(private val context: Context) {
    
    // Narrow scope bounds: Short-lived operational state markers only.
    // Room will handle Historical derived features in Track 3.
    
    private val ACTIVE_KEY = booleanPreferencesKey("session_is_active")
    private val START_TIME_KEY = longPreferencesKey("session_start_time_ms")
    private val ONBOARDING_KEY = booleanPreferencesKey("onboarding_complete")

    val isSessionActiveFlow: Flow<Boolean> = context.dataStore.data.map { p -> p[ACTIVE_KEY] ?: false }
    val sessionStartTimeMsFlow: Flow<Long> = context.dataStore.data.map { p -> p[START_TIME_KEY] ?: 0L }
    val hasCompletedOnboardingFlow: Flow<Boolean> = context.dataStore.data.map { p -> p[ONBOARDING_KEY] ?: false }

    suspend fun markSessionStart(timeMs: Long) {
        context.dataStore.edit { p ->
            p[ACTIVE_KEY] = true
            p[START_TIME_KEY] = timeMs
        }
    }

    suspend fun markSessionEnd() {
        context.dataStore.edit { p ->
            p[ACTIVE_KEY] = false
        }
    }
    
    suspend fun markOnboardingComplete() {
        context.dataStore.edit { p ->
            p[ONBOARDING_KEY] = true
        }
    }
}
