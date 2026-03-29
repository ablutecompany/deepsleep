package com.ablute.deepsleep.ui.tonight

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.domain.AudioCapability
import com.ablute.deepsleep.domain.DeviceUsageCapability
import com.ablute.deepsleep.domain.NightSessionService
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
    private val context: Context,
    private val capabilityManager: com.ablute.deepsleep.domain.SensorCapabilityManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<TonightUiState>(
        TonightUiState.ArmedNotStarted(
            hasAudio = capabilityManager.produceSnapshot().audioCapability == AudioCapability.GRANTED,
            hasUsage = capabilityManager.produceSnapshot().deviceUsageCapability == DeviceUsageCapability.GRANTED
        )
    )
    val uiState: StateFlow<TonightUiState> = _uiState.asStateFlow()

    fun refreshCapabilityState() {
        if (_uiState.value is TonightUiState.ArmedNotStarted) {
            _uiState.value = TonightUiState.ArmedNotStarted(
                hasAudio = capabilityManager.produceSnapshot().audioCapability == AudioCapability.GRANTED,
                hasUsage = capabilityManager.produceSnapshot().deviceUsageCapability == DeviceUsageCapability.GRANTED
            )
        }
    }

    fun startSession() {
        viewModelScope.launch {
            val serviceIntent = Intent(context, NightSessionService::class.java).apply {
                action = NightSessionService.ACTION_START
            }
            ContextCompat.startForegroundService(context, serviceIntent)
            _uiState.value = TonightUiState.Active
        }
    }

    fun stopSession() {
        viewModelScope.launch {
            val serviceIntent = Intent(context, NightSessionService::class.java).apply {
                action = NightSessionService.ACTION_STOP
            }
            context.startService(serviceIntent)
            
            _uiState.value = TonightUiState.Finalizing
            delay(1500) // Simular Sensor Hardware Flush
            _uiState.value = TonightUiState.ProcessingPendingMorning
        }
    }

    fun abortSessionEarly() {
        viewModelScope.launch {
            _uiState.value = TonightUiState.InvalidTooShort("Sessão demasiado curta para análise consistente.")
        }
    }

    fun interruptSession(reason: String) {
        viewModelScope.launch {
             _uiState.value = TonightUiState.Interrupted(reason)
        }
    }
}
