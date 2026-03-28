package com.ablute.deepsleep.ui.insight

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface InsightDetailUiState {
    object Loading : InsightDetailUiState
    object Error : InsightDetailUiState
    
    data class Content(
        val impactTitle: String,
        val evidenceList: List<String>, // Translated PT-PT strings from EvKeys
        val plausibleLink: String,
        val practicalRecommendation: String,
        val maskedInputs: List<InputType> // Info on degraded modalities
    ) : InsightDetailUiState
}

class InsightDetailViewModel(
    private val repository: NightAnalysisRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<InsightDetailUiState>(InsightDetailUiState.Loading)
    val uiState: StateFlow<InsightDetailUiState> = _uiState.asStateFlow()

    init {
        loadInsight()
    }

    private fun loadInsight() {
        viewModelScope.launch {
            val payload = repository.fetchLatestNightReview()
            if (payload == null || payload.primaryImpactKey == null) {
                _uiState.value = InsightDetailUiState.Error
                return@launch
            }

            // Semantic to PT-PT Translation (Product constraints isolate sentence authorship)
            val impactTitle = when (payload.primaryImpactKey) {
                "IMPACT_DIGITAL_FRICTION" -> "Ecrã ligado na madrugada"
                "IMPACT_TEMPERATURE_AWAKE" -> "Agitação térmica"
                "IMPACT_NOISE_DISRUPTION" -> "Interferência acústica"
                else -> "Causa indeterminada"
            }

            val evidenceList = payload.primaryImpactEvidence.map { key ->
                when (key) {
                    "EV_AWAKE_COUNT_2" -> "2 despertares motores profundos"
                    "EV_UNLOCK_TIME_0341" -> "Dispositivo desbloqueado às 03:41"
                    "EV_CONTINUOUS_SCREEN_11M" -> "11 minutos contínuos de ecrã ativo"
                    "EV_BASELINE_DROP_15" -> "Queda de 15% na eficiência contínua pós-evento"
                    else -> "Evidência genérica registada"
                }
            }

            val linkStr = when (payload.primaryImpactKey) {
                "IMPACT_DIGITAL_FRICTION" -> "A exposição à luz e interatividade do ecrã durante a janela da madrugada bloqueou de imediato o retorno contínuo aos ciclos de sono profundo."
                else -> "Correlação baseada nas variações físicas registadas durante o período de interrupção."
            }

            val recStr = when (payload.priorityActionKey) {
                "ACTION_DEVICE_DISTANCING" -> "Garante que o telemóvel está fora do alcance do braço durante esta noite. Remove a fricção e o impulso rápido na cama se acordares repentinamente."
                else -> "Tenta manter a quietude do ambiente durante as próximas madrugadas."
            }

            _uiState.value = InsightDetailUiState.Content(
                impactTitle = impactTitle,
                evidenceList = evidenceList,
                plausibleLink = linkStr,
                practicalRecommendation = recStr,
                maskedInputs = payload.missingInputs
            )
        }
    }
}
