package com.ablute.deepsleep.ui.control

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.data.local.SessionDao
import com.ablute.deepsleep.domain.SensorCapabilityManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface ControlUiState {
    object Loading : ControlUiState
    data class Content(
        val hasAudioPermission: Boolean,
        val hasUsagePermission: Boolean,
        val sessionCount: Int
    ) : ControlUiState
}

class ControlViewModel(
    private val capabilityManager: SensorCapabilityManager,
    private val sessionDao: SessionDao
) : ViewModel() {

    private val _uiState = MutableStateFlow<ControlUiState>(ControlUiState.Loading)
    val uiState: StateFlow<ControlUiState> = _uiState.asStateFlow()

    fun loadSettings() {
        viewModelScope.launch {
            val sessions = sessionDao.getValidSessionsSync().size
            _uiState.value = ControlUiState.Content(
                hasAudioPermission = capabilityManager.hasAudioAccess(),
                hasUsagePermission = capabilityManager.hasUsageAccess(),
                sessionCount = sessions
            )
        }
    }

    fun deleteProfileData() {
         viewModelScope.launch {
             sessionDao.deleteAllSessions()
             loadSettings()
         }
    }
}
