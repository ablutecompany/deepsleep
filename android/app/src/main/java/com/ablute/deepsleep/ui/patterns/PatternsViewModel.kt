package com.ablute.deepsleep.ui.patterns

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.domain.HistoricalAnalysisEngine
import com.ablute.deepsleep.domain.TrendState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface PatternsUiState {
    object Loading : PatternsUiState
    object InsufficientHistory : PatternsUiState
    data class Content(
        val stateLabel: String,         
        val stateStrength: TrendState,  
        val validNightsCount: Int,
        val primaryRecurringPatternTitle: String?,
        val primaryRecurringPatternDesc: String?
    ) : PatternsUiState
}

class PatternsViewModel(
    private val engine: HistoricalAnalysisEngine
) : ViewModel() {

    private val _uiState = MutableStateFlow<PatternsUiState>(PatternsUiState.Loading)
    val uiState: StateFlow<PatternsUiState> = _uiState.asStateFlow()

    init { loadPatterns() }

    private fun loadPatterns() {
        viewModelScope.launch {
            val count = engine.getValidSessionCount()
            val state = engine.evaluateRecentPatternsState()

            if (state == TrendState.INSUFFICIENT) {
                _uiState.value = PatternsUiState.InsufficientHistory
                return@launch
            }

            val hasFriction = engine.hasRecurringDigitalFriction()
            
            // Native Semantic Translation into PT-PT Language Domain
            val stateLabel = if (state == TrendState.CONSOLIDATED) "PADRÕES CONSOLIDADOS" else "SINAIS EMERGENTES"
            val patternTitle = if (hasFriction) "Fricção Digital Sistemática" else "Estabilidade Causal"
            val patternDesc = if (hasFriction) 
                 "O uso de ecrãs durante as janelas de suspensão é o denominador comum em mais de 50% das interrupções orgânicas registadas nos últimos dias."
            else 
                 "Não existem anomalias mecânicas dominantes a reportar na tua amostra atual."

            _uiState.value = PatternsUiState.Content(
                stateLabel = stateLabel,
                stateStrength = state,
                validNightsCount = count,
                primaryRecurringPatternTitle = patternTitle,
                primaryRecurringPatternDesc = patternDesc
            )
        }
    }
}
