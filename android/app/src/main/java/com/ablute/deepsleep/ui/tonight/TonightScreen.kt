package com.ablute.deepsleep.ui.tonight

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun TonightScreen(
    viewModel: TonightViewModel,
    onNavigateBack: () -> Unit,
    onMorningReviewReady: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background),
        contentAlignment = Alignment.Center
    ) {
        when (val state = uiState) {
            is TonightUiState.ArmedNotStarted -> {
                ArmedContent(
                    onStart = { viewModel.startSession() },
                    onNavigateBack = onNavigateBack
                )
            }
            is TonightUiState.Active -> {
                ActiveSessionContent(
                    onStop = { viewModel.stopSession() },
                    onAbort = { viewModel.abortSessionEarly() }
                )
            }
            is TonightUiState.Finalizing -> {
                Text(
                    text = "A compilar sessão...",
                    color = DeepSleepTheme.colors.textMuted,
                    fontSize = 14.sp,
                    letterSpacing = 1.sp
                )
            }
            is TonightUiState.ProcessingPendingMorning -> {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "A processar padrões...",
                        color = DeepSleepTheme.colors.textMuted,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(
                        text = "VER RESUMO",
                        color = DeepSleepTheme.colors.accent,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        modifier = Modifier.clickable { onMorningReviewReady() }
                    )
                }
            }
            is TonightUiState.Interrupted -> {
                FallbackContent(state.errorReason, "Voltar ao Início", onNavigateBack)
            }
            is TonightUiState.InvalidTooShort -> {
                FallbackContent(state.errorReason, "Voltar ao Início", onNavigateBack)
            }
        }
    }
}

@Composable
private fun ArmedContent(onStart: () -> Unit, onNavigateBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "PREPARAÇÃO NOCTURNA",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 1.5.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Inicia a sessão quando tudo estiver pronto para a transição do sono.",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Light,
            lineHeight = 36.sp
        )
        Spacer(modifier = Modifier.height(48.dp))
        
        Text(
            text = "INICIAR MONITORIZAÇÃO",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 14.sp,
            letterSpacing = 1.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier
                .border(1.dp, DeepSleepTheme.colors.separator)
                .padding(horizontal = 24.dp, vertical = 16.dp)
                .clickable { onStart() }
        )

        Spacer(modifier = Modifier.height(32.dp))
        Text(
            text = "← Voltar",
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 14.sp,
            modifier = Modifier
                .clickable { onNavigateBack() }
                .alpha(0.8f)
        )
    }
}

@Composable
private fun ActiveSessionContent(onStop: () -> Unit, onAbort: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(24.dp)
    ) {
        Text(
            text = "SESSÃO ATIVA",
            color = DeepSleepTheme.colors.accent,
            fontSize = 10.sp,
            letterSpacing = 2.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = "Sistema armado.\nSensores em escuta contínua.",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp
        )
        Spacer(modifier = Modifier.height(80.dp))
        Row {
            Text(
                text = "Despertar / Encerrar",
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 14.sp,
                modifier = Modifier
                    .border(1.dp, DeepSleepTheme.colors.separator)
                    .padding(horizontal = 24.dp, vertical = 12.dp)
                    .clickable { onStop() }
            )
        }
        Spacer(modifier = Modifier.height(32.dp))
        Text(
            text = "CANCELAR SESSÃO",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 1.sp,
            modifier = Modifier
                .clickable { onAbort() }
                .alpha(0.5f)
        )
    }
}

@Composable
private fun FallbackContent(message: String, actionText: String, onAction: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(24.dp)
    ) {
        Text(
            text = message,
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 14.sp,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(32.dp))
        Text(
            text = actionText,
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 14.sp,
            modifier = Modifier
                .border(1.dp, DeepSleepTheme.colors.separator)
                .padding(horizontal = 24.dp, vertical = 12.dp)
                .clickable { onAction() }
        )
    }
}
