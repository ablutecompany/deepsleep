package com.ablute.deepsleep.ui.process

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.data.ProcessRepository
import com.ablute.deepsleep.data.local.ProcessEntity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ProcessViewModel(
    private val processRepository: ProcessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ProcessUiState>(ProcessUiState.Loading)
    val uiState = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            // Re-evaluate unlock conditions whenever the process changes
            processRepository.checkPhaseUnlocks()
            
            processRepository.activeProcessFlow.collect { process ->
                if (process == null) {
                    val newProcess = processRepository.getOrCreateActiveProcess()
                    updateUiState(newProcess)
                } else {
                    updateUiState(process)
                }
            }
        }
    }

    private fun updateUiState(process: ProcessEntity) {
        val phase1State = if (process.phase2Unlocked) "Concluída" else "Em curso"
        val phase2State = if (process.phase3Unlocked) "Concluída" 
                         else if (process.phase2Unlocked) "Disponível" 
                         else "Bloqueada"
                         
        val phase3State = if (process.phase3Unlocked) "Em curso"
                         else if (process.phase2Unlocked) "A seguir"
                         else "Bloqueada"

        _uiState.value = ProcessUiState.Active(
            phase1Status = phase1State,
            phase2Status = phase2State,
            phase3Status = phase3State,
            isPhase1Clickable = true, // Always accessible
            isPhase2Clickable = process.phase2Unlocked,
            isPhase3Clickable = process.phase3Unlocked
        )
    }
}

sealed class ProcessUiState {
    object Loading : ProcessUiState()
    data class Active(
        val phase1Status: String,
        val phase2Status: String,
        val phase3Status: String,
        val isPhase1Clickable: Boolean,
        val isPhase2Clickable: Boolean,
        val isPhase3Clickable: Boolean
    ) : ProcessUiState()
}
