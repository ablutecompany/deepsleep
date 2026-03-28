package com.ablute.deepsleep.ui.tonight

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface TonightUiState {
    data class ArmedNotStarted(
        val hasAudio: Boolean,
        val hasUsage: Boolean
    ) : TonightUiState 
    object Active : TonightUiState // Represents strict ForegroundService running
    object Finalizing : TonightUiState // Morning transition: flush sensors to Room
    data class Interrupted(val errorReason: String) : TonightUiState // OS Aggressive battery kill
    data class InvalidTooShort(val errorReason: String) : TonightUiState // duration < 2h threshold
    object ProcessingPendingMorning : TonightUiState // Engine extracting semantic keys
}

class TonightViewModel(
    private val controller: com.ablute.deepsleep.domain.NightSessionController,
    private val capabilityManager: com.ablute.deepsleep.domain.SensorCapabilityManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<TonightUiState>(
        TonightUiState.ArmedNotStarted(
            hasAudio = capabilityManager.hasAudioAccess(),
            hasUsage = capabilityManager.hasUsageAccess()
        )
    )
    val uiState: StateFlow<TonightUiState> = _uiState.asStateFlow()

    fun refreshCapabilityState() {
        if (_uiState.value is TonightUiState.ArmedNotStarted) {
            _uiState.value = TonightUiState.ArmedNotStarted(
                hasAudio = capabilityManager.hasAudioAccess(),
                hasUsage = capabilityManager.hasUsageAccess()
            )
        }
    }

    fun hasAudioAccess(): Boolean = capabilityManager.hasAudioAccess()
    fun hasUsageAccess(): Boolean = capabilityManager.hasUsageAccess()

    fun startSession() {
        viewModelScope.launch {
            controller.spawnNightSession()
            _uiState.value = TonightUiState.Active
        }
    }

    fun stopSession() {
        viewModelScope.launch {
            controller.terminateNightSession()
            _uiState.value = TonightUiState.Finalizing
            delay(1500) // Simular Sensor Hardware Flush
            _uiState.value = TonightUiState.ProcessingPendingMorning
        }
    }

    fun abortSessionEarly() {
        viewModelScope.launch {
            _uiState.value = TonightUiState.InvalidTooShort("Sessão muito curta para processamento empírico (< 2 horas).")
        }
    }

    fun interruptSession(reason: String) {
        // Exposed to gracefully handle ForegroundService OS destruction 
        viewModelScope.launch {
             _uiState.value = TonightUiState.Interrupted(reason)
        }
    }
}
