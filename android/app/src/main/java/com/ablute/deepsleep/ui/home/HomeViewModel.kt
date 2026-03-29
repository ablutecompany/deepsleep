package com.ablute.deepsleep.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repository: NightAnalysisRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadLatestNight()
    }

    fun loadLatestNight() {
        viewModelScope.launch {
            _uiState.value = HomeUiState.Loading
            
            val result = repository.fetchLatestNightReview()

            when (result) {
                is NightReviewResult.NoData -> {
                    _uiState.value = HomeUiState.SessionInterrupted("Sem memória empírica guardada. Inicia uma sessão hoje para processarmos o estado basal do teu sono.")
                }
                is NightReviewResult.Interrupted -> {
                    _uiState.value = HomeUiState.SessionInterrupted(result.disclosure)
                }
                is NightReviewResult.InvalidTooShort -> {
                    _uiState.value = HomeUiState.SessionInterrupted("Sessão demasiado curta para análise consistente.")
                }
                is NightReviewResult.Success -> {
                    _uiState.value = mapPayloadToUiState(result.payload)
                }
            }
        }
    }

    private fun mapPayloadToUiState(payload: NightReviewPayload): HomeUiState.NightReviewReady {
        // Translation Layer is now constrained. We read heavily from Payload.
        
        val headline = "Resumo da noite"

        val confidenceText = when(payload.confidenceBand) {
            ConfidenceBand.HIGH -> "CONFIANÇA: ALTA"
            ConfidenceBand.MODERATE -> "CONFIANÇA: MODERADA"
            ConfidenceBand.LOW -> "CONFIANÇA: BAIXA"
            ConfidenceBand.UNKNOWN -> "CONFIANÇA: DESCONHECIDA"
        }

        return HomeUiState.NightReviewReady(
            headline = headline,
            systemConfidenceScore = if(payload.confidenceBand == ConfidenceBand.HIGH) 90 else 50,
            confidenceLabel = confidenceText,
            primaryImpactTitle = "Diagnóstico Pendente",
            primaryImpactDesc = payload.disclosureCopy, // Inject the literal formatted string
            priorityActionTitle = "Sessões Degradadas",
            priorityActionDesc = "Métricas amostradas baseadas nos inputs parciais da noite.",
            learningStateText = if (payload.missingInputs.isNotEmpty()) "O painel inferior foi ajustado." else "Recolha regular.",
            hasDegradedAudio = payload.missingInputs.contains("AUDIO_INPUT"),
            hasDegradedUsage = payload.missingInputs.contains("DEVICE_USAGE")
        )
    }
}
