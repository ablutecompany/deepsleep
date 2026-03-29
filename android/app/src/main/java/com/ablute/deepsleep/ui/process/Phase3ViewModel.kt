package com.ablute.deepsleep.ui.process

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.data.ProcessRepository
import com.ablute.deepsleep.data.local.ProposalEntity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class Phase3State(
    val proposals: List<ProposalEntity> = emptyList(),
    val dayCount: Int = 1,
    val baselineComparison: String = "Noites estabilizadas",
    val todayReported: Boolean = false
)

class Phase3ViewModel(
    private val repository: ProcessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(Phase3State())
    val uiState = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.activeProcessFlow.collect { p ->
                if (p != null) {
                    repository.getProposals(p.id).collect { props ->
                        _uiState.value = _uiState.value.copy(proposals = props)
                    }
                }
            }
        }
    }

    fun submitDailyReport(adherent: Boolean) {
        // Mocking the daily submission logic
        _uiState.value = _uiState.value.copy(todayReported = true, dayCount = _uiState.value.dayCount + 1)
    }
}
