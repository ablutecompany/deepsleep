package com.ablute.deepsleep.ui.process

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun Phase2QuestionsScreen(
    viewModel: Phase2ViewModel
) {
    val state by viewModel.uiState.collectAsState()

    val totalQuestions = state.selectedMode ?: MOCK_QUESTIONS.size
    val currentQ = MOCK_QUESTIONS.getOrNull(state.currentQuestionIndex)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black) // Force full absolute black
            .padding(24.dp)
    ) {
        if (state.generatingProposals) {
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                CircularProgressIndicator(color = DeepSleepTheme.colors.textPrimary, strokeWidth = 2.dp)
                Spacer(modifier = Modifier.height(24.dp))
                Text("A analisar contexto e a isolar propostas...", color = DeepSleepTheme.colors.textSecondary, fontSize = 14.sp)
            }
        } else if (currentQ != null) {
            Text(
                text = "${state.currentQuestionIndex + 1} / $totalQuestions",
                color = DeepSleepTheme.colors.textMuted,
                fontSize = 12.sp,
                letterSpacing = 2.sp,
                modifier = Modifier.align(Alignment.TopCenter).padding(top = 32.dp)
            )

            AnimatedContent(
                targetState = currentQ,
                transitionSpec = {
                    fadeIn(animationSpec = tween(500)) with fadeOut(animationSpec = tween(500))
                },
                modifier = Modifier.align(Alignment.Center)
            ) { targetQ ->
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = targetQ.text,
                        color = DeepSleepTheme.colors.textPrimary,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Medium,
                        lineHeight = 32.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (targetQ.maxChoices > 1) "Escolhe até ${targetQ.maxChoices}" else "Escolhe 1",
                        color = DeepSleepTheme.colors.textMuted,
                        fontSize = 12.sp,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(48.dp))
                    
                    val selectedOptions = state.answers[targetQ.id] ?: emptyList()

                    targetQ.options.forEach { option ->
                        val isSelected = selectedOptions.contains(option)
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp)
                                .clickable { viewModel.toggleAnswer(targetQ, option) }
                                .background(
                                    color = if (isSelected) DeepSleepTheme.colors.surfaceLight else Color.Transparent,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) Color.Transparent else DeepSleepTheme.colors.surfaceLight,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .padding(vertical = 16.dp, horizontal = 20.dp)
                        ) {
                            Text(
                                text = option,
                                color = DeepSleepTheme.colors.textPrimary,
                                fontSize = 16.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
