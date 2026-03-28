package com.ablute.deepsleep.ui.tonight

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface TonightUiState {
    object ArmedNotStarted : TonightUiState 
    object Active : TonightUiState // Represents strict ForegroundService running
    object Finalizing : TonightUiState // Morning transition: flush sensors to Room
    data class Interrupted(val errorReason: String) : TonightUiState // OS Aggressive battery kill
    data class InvalidTooShort(val errorReason: String) : TonightUiState // duration < 2h threshold
    object ProcessingPendingMorning : TonightUiState // Engine extracting semantic keys
}

class TonightViewModel : ViewModel() {

    private val _uiState = MutableStateFlow<TonightUiState>(TonightUiState.ArmedNotStarted)
    val uiState: StateFlow<TonightUiState> = _uiState.asStateFlow()

    fun startSession() {
        viewModelScope.launch {
            // Em Android Real: startForegroundService(Intent(...)) 
            // Ensures strict OS compliance for background sensor harvesting.
            _uiState.value = TonightUiState.Active
        }
    }

    fun stopSession() {
        viewModelScope.launch {
            // Em Android Real: stopService()
            _uiState.value = TonightUiState.Finalizing
            delay(1500) // Simular sensor buffer flush
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
