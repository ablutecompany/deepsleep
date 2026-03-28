package com.ablute.deepsleep.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repository: NightAnalysisRepository,
    private val historicalEngine: HistoricalAnalysisEngine
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
            val hasRecurringFriction = historicalEngine.hasRecurringDigitalFriction()

            when (result) {
                is com.ablute.deepsleep.domain.NightReviewResult.NoData -> {
                    _uiState.value = HomeUiState.SessionInterrupted("Sem memória empírica guardada. Inicia uma sessão hoje para processarmos o estado basal do teu sono.")
                }
                is com.ablute.deepsleep.domain.NightReviewResult.Interrupted -> {
                    _uiState.value = HomeUiState.SessionInterrupted("Sessão noturna descontinuada precocemente. Volume capturado sem validade estrita para deduções seguras.")
                }
                is com.ablute.deepsleep.domain.NightReviewResult.Success -> {
                    _uiState.value = mapPayloadToUiState(result.payload, hasRecurringFriction)
                }
            }
        }
    }

    private fun mapPayloadToUiState(payload: NightReviewPayload, hasRecurringFriction: Boolean): HomeUiState.NightReviewReady {
        // Translation Layer: Engine Semantic Keys -> PT-PT Editorial Voice
        
        val headline = when (payload.nightStatusKey) {
            "STATUS_FRAGMENTED" -> "Noite\nfragmentada"
            "STATUS_UNBROKEN" -> "Noite\nreparadora"
            "STATUS_LOW_EFFICIENCY" -> "Eficiência\nreduzida"
            else -> "Resumo da noite"
        }

        val primaryTitle = when (payload.primaryImpactKey) {
            "IMPACT_DIGITAL_FRICTION" -> "Ecrã ligado na madrugada"
            "IMPACT_TEMPERATURE_AWAKE" -> "Agitação térmica"
            "IMPACT_NOISE_DISRUPTION" -> "Interferência acústica"
            else -> "Causa indeterminada"
        }
        
        val isRecurringFriction = payload.primaryImpactKey == "IMPACT_DIGITAL_FRICTION" && hasRecurringFriction

        val primaryDesc = when {
            isRecurringFriction -> "SINAL RECORRENTE. Foram detetados limiares de luz emissiva por repetidas noites recentes. A tua biologia não descansa estruturalmente enquanto manteres fricção nesta janela móvel."
            payload.primaryImpactKey == "IMPACT_DIGITAL_FRICTION" -> "Foi detetada atividade no ecrã durante a madrugada. Esta luz interrompeu o ciclo e tornou mais difícil voltar a adormecer profundamente."
            else -> "O sistema detetou interrupções sem um vetor causal forte ou contínuo."
        }

        val actionTitle = when (payload.priorityActionKey) {
             "ACTION_DEVICE_DISTANCING" -> "Telemóvel longe da cama"
             "ACTION_KEEP_ROUTINE" -> "Manter proteção ativa"
             else -> "Proteger contexto de sono"
        }
        
        val actionDesc = when (payload.priorityActionKey) {
             "ACTION_DEVICE_DISTANCING" -> "Esta noite, deixa o telemóvel fora do alcance físico. Criar esta distância ajuda a não ceder ao impulso automático de olhar para o ecrã caso acordes."
             "ACTION_KEEP_ROUTINE" -> "As tuas mecânicas revelaram estabilidade. Mantém a quietude térmica e acústica."
             else -> "O sistema estuda as vulnerabilidades para gerar recomendações direcionadas na próxima noite."
        }

        val confidenceText = when {
            payload.missingInputs.isNotEmpty() -> "CONFIANÇA: LIMITADA (DADOS PARCIAIS)"
            payload.confidenceLevel == ConfidenceLevel.HIGH -> "CONFIANÇA: ALTA"
            payload.confidenceLevel == ConfidenceLevel.MEDIUM -> "CONFIANÇA: MÉDIA"
            else -> "CONFIANÇA: BAIXA"
        }

        val learningText = if (payload.missingInputs.isNotEmpty()) {
            "O sistema está a ser forçado a extrapolar as causas mecânicas destas interrupções porque o Android restringe os sensores de Fricção e Som. A extração heurística está amputada."
        } else if (payload.learningState == LearningState.CONSOLIDATED) {
            "O teu adormecimento inicial continua rápido e eficiente. As interrupções estão a acontecer quase em exclusivo nesta janela madrugadora."
        } else {
            "Estamos a recolher os primeiros traços empiricamente viáveis. Mantém o padrão de registo."
        }

        return HomeUiState.NightReviewReady(
            headline = headline,
            systemConfidenceScore = payload.systemConfidenceScore,
            confidenceLabel = confidenceText,
            primaryImpactTitle = payload.primaryImpactKey?.let { primaryTitle },
            primaryImpactDesc = payload.primaryImpactKey?.let { primaryDesc },
            priorityActionTitle = actionTitle,
            priorityActionDesc = actionDesc,
            learningStateText = learningText,
            hasDegradedAudio = payload.missingInputs.contains(InputType.AUDIO_INPUT),
            hasDegradedUsage = payload.missingInputs.contains(InputType.USAGE_STATS)
        )
    }
}
