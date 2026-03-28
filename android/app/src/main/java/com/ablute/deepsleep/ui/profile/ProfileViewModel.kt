package com.ablute.deepsleep.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.domain.HistoricalAnalysisEngine
import com.ablute.deepsleep.domain.TrendState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface ProfileUiState {
    object Loading : ProfileUiState
    object InsufficientHistory : ProfileUiState
    data class Content(
        val isConsolidated: Boolean,
        val traits: List<DisplayTrait> 
    ) : ProfileUiState
}

data class DisplayTrait(
    val title: String,
    val description: String,
    val isEmerging: Boolean
)

class ProfileViewModel(
    private val engine: HistoricalAnalysisEngine
) : ViewModel() {

    private val _uiState = MutableStateFlow<ProfileUiState>(ProfileUiState.Loading)
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init { loadProfile() }

    private fun loadProfile() {
        viewModelScope.launch {
            val traitConfidences = engine.evaluateProfileTraits()

            if (traitConfidences.isEmpty()) {
                _uiState.value = ProfileUiState.InsufficientHistory
                return@launch
            }

            val isFullyConsolidated = traitConfidences.all { it.strength == TrendState.CONSOLIDATED }

            val displayTraits = traitConfidences.map { trait ->
                val title = when (trait.traitKey) {
                    "SENSITIVITY_TO_DIGITAL" -> "Sensibilidade Friccional"
                    "SENSITIVITY_TO_NOISE" -> "Sensibilidade Acústica"
                    else -> "Vetor de Interrupção Misto"
                }

                val desc = when (trait.descriptionKey) {
                    "PROFILE_DESC_DIGITAL_FRICTION" -> "A presença física de dispositivos emissivos antes ou durante as interrupções ataca e destrói invariavelmente o teu retorno imediato ao tecido do sono profundo."
                    "PROFILE_DESC_NOISE_SENSITIVE" -> "Variações e picos imprevisíveis no envelope de ruído externo provocam despertares motores duradouros na tua rotina."
                    else -> "O perfil revela exposição intermitente a falhas contínuas sem foco específico."
                }

                DisplayTrait(title, desc, trait.strength == TrendState.EMERGING)
            }

            _uiState.value = ProfileUiState.Content(isFullyConsolidated, displayTraits)
        }
    }
}
