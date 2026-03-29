package com.ablute.deepsleep.ui.process

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.data.ProcessRepository
import com.ablute.deepsleep.data.local.Phase2Responses
import com.ablute.deepsleep.data.local.ProposalEntity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay

data class Question(
    val id: String,
    val text: String,
    val options: List<String>,
    val maxChoices: Int = 1
)

val MOCK_QUESTIONS = listOf(
    Question("q1", "Como sentes o teu nível de stress atual?", listOf("Muito Alto", "Gerível", "Baixo", "Inexistente")),
    Question("q2", "Como foi o teu ritmo de trabalho recente?", listOf("Exaustivo", "Normal", "Leve"), maxChoices = 1),
    Question("q3", "Tens dores físicas ou desconforto crónico?", listOf("Sim, frequentemente", "Ocasionalmente", "Quase nunca")),
    Question("q4", "Quais destes fatores costumam acordar-te? (Escolhe até 2)", listOf("Telemóvel/Ecrãs", "Barulho", "Temperatura", "Ansiedade"), maxChoices = 2)
) // In reality this would contain the 25 distinct psychological hooks.

data class Phase2State(
    val selectedMode: Int? = null, // 10 or 25
    val currentQuestionIndex: Int = 0,
    val answers: Map<String, List<String>> = emptyMap(),
    val isFinished: Boolean = false,
    val generatingProposals: Boolean = false,
    val proposals: List<ProposalEntity> = emptyList()
)

class Phase2ViewModel(
    private val repository: ProcessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(Phase2State())
    val uiState = _uiState.asStateFlow()
    
    // Loaded process ID
    private var activeProcessId: Long = -1L

    init {
        viewModelScope.launch {
            repository.activeProcessFlow.collect { p ->
                if (p != null) {
                    activeProcessId = p.id
                    loadExistingProposals(p.id)
                }
            }
        }
    }

    private suspend fun loadExistingProposals(processId: Long) {
        repository.getProposals(processId).collect { props ->
            if (props.isNotEmpty()) {
                _uiState.value = _uiState.value.copy(proposals = props, isFinished = true)
            }
        }
    }

    fun startQuestions(mode: Int) {
        _uiState.value = _uiState.value.copy(selectedMode = mode, currentQuestionIndex = 0)
    }

    fun toggleAnswer(question: Question, answer: String) {
        val state = _uiState.value
        val currentAnswers = state.answers[question.id]?.toMutableList() ?: mutableListOf()

        if (currentAnswers.contains(answer)) {
            currentAnswers.remove(answer)
        } else {
            if (currentAnswers.size < question.maxChoices) {
                currentAnswers.add(answer)
            } else if (question.maxChoices == 1) {
                currentAnswers.clear()
                currentAnswers.add(answer)
            }
        }

        val newAnswersMap = state.answers.toMutableMap().apply { put(question.id, currentAnswers) }
        _uiState.value = state.copy(answers = newAnswersMap)
        
        // Auto-advance logic if max choices reached
        if (currentAnswers.size == question.maxChoices) {
            viewModelScope.launch {
                delay(300) // cinematic pause
                advanceQuestion()
            }
        }
    }

    fun advanceQuestion() {
        val state = _uiState.value
        val totalQuestions = state.selectedMode ?: MOCK_QUESTIONS.size
        val questionsToAsk = minOf(totalQuestions, MOCK_QUESTIONS.size)

        if (state.currentQuestionIndex + 1 < questionsToAsk) {
            _uiState.value = state.copy(currentQuestionIndex = state.currentQuestionIndex + 1)
        } else {
            finishAndGenerate()
        }
    }

    private fun finishAndGenerate() {
        _uiState.value = _uiState.value.copy(isFinished = true, generatingProposals = true)
        
        viewModelScope.launch {
            // 1. Save responses
            val responsesToSave = _uiState.value.answers.map { (qId, ansList) ->
                Phase2Responses(processId = activeProcessId, questionId = qId, answersJson = ansList.joinToString(","))
            }
            repository.savePhase2Responses(responsesToSave)
            
            delay(1500) // mock cinematic generation time
            
            // 2. Generate 3 proposals based on Phase 1 & Phase 2 context. This is mocked.
            val newProposals = listOf(
                ProposalEntity(processId = activeProcessId, title = "Regularidade Dinâmica", hypothesis = "A fragmentação tem origem no jitter matinal", actionStr = "Manter alarme fixo em 7h30, independente da hora de deitar."),
                ProposalEntity(processId = activeProcessId, title = "Descompressão Passiva", hypothesis = "Carga visual excessiva pré-sono", actionStr = "Base fixa do telemóvel fora do alcance imediato, sem manipulação após luzes desligadas."),
                ProposalEntity(processId = activeProcessId, title = "Temperatura e Continuidade", hypothesis = "Picos de micro-despertares às 4h da manhã", actionStr = "Reduzir temperatura base do quarto para 18ºC.")
            )
            repository.saveProposals(newProposals)
            
            _uiState.value = _uiState.value.copy(generatingProposals = false)
        }
    }
}
