package com.ablute.deepsleep.ui.patterns

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.domain.TrendState
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun PatternsScreen(viewModel: PatternsViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
            .padding(24.dp)
    ) {
        Column(modifier = Modifier.padding(top = 40.dp)) {
            when (val state = uiState) {
                is PatternsUiState.Loading -> {
                     Text("A sincronizar histórico...", color = DeepSleepTheme.colors.textMuted)
                }
                is PatternsUiState.InsufficientHistory -> {
                     Text(
                         text = "HISTÓRICO INSUFICIENTE",
                         color = DeepSleepTheme.colors.textMuted,
                         fontSize = 10.sp,
                         letterSpacing = 1.sp,
                         fontWeight = FontWeight.Bold
                     )
                     Spacer(modifier = Modifier.height(16.dp))
                     Text(
                         text = "A amostra atual não permite isolar padrões sem comprometer a integridade matemática da análise.\n\nMantém a monitorização ativa para gerar a premissa base.",
                         color = DeepSleepTheme.colors.textSecondary,
                         fontSize = 16.sp,
                         lineHeight = 24.sp
                     )
                }
                is PatternsUiState.Content -> {
                     Text(
                         text = state.stateLabel,
                         color = if (state.stateStrength == TrendState.CONSOLIDATED) DeepSleepTheme.colors.textPrimary else DeepSleepTheme.colors.accent,
                         fontSize = 10.sp,
                         letterSpacing = 1.sp,
                         fontWeight = FontWeight.Bold
                     )
                     Spacer(modifier = Modifier.height(48.dp))
                     
                     Text(
                         text = "${state.validNightsCount} NOITES",
                         color = DeepSleepTheme.colors.textMuted,
                         fontSize = 10.sp
                     )
                     Spacer(modifier = Modifier.height(8.dp))
                     Text(
                         text = state.primaryRecurringPatternTitle ?: "",
                         color = DeepSleepTheme.colors.textPrimary,
                         fontSize = 32.sp,
                         lineHeight = 36.sp,
                         fontWeight = FontWeight.Light
                     )
                     Spacer(modifier = Modifier.height(24.dp))
                     Text(
                         text = state.primaryRecurringPatternDesc ?: "",
                         color = DeepSleepTheme.colors.textSecondary,
                         fontSize = 16.sp,
                         lineHeight = 24.sp
                     )
                }
            }
        }
    }
}
