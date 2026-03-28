package com.ablute.deepsleep.ui.insight

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun InsightDetailScreen(
    viewModel: InsightDetailViewModel,
    onNavigateBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            // Context Header
            Text(
                text = "← Voltar ao resumo",
                color = DeepSleepTheme.colors.textSecondary,
                fontSize = 14.sp,
                modifier = Modifier
                    .padding(top = 40.dp, bottom = 40.dp)
                    .clickable { onNavigateBack() }
                    .alpha(0.8f)
            )

            when (val state = uiState) {
                is InsightDetailUiState.Loading -> {
                     Text(
                         text = "A processar evidência...", 
                         color = DeepSleepTheme.colors.textMuted,
                         fontSize = 12.sp
                     )
                }
                is InsightDetailUiState.Error -> {
                     Text(
                         text = "Evidência impossível de extrair.", 
                         color = DeepSleepTheme.colors.textSecondary,
                         fontSize = 14.sp
                     )
                }
                is InsightDetailUiState.Content -> {
                     InsightContent(state)
                }
            }
        }
    }
}

@Composable
private fun InsightContent(state: InsightDetailUiState.Content) {
    Text(
        text = "EVIDÊNCIA CAUSAL",
        color = DeepSleepTheme.colors.accent,
        fontSize = 10.sp,
        letterSpacing = 1.sp,
        fontWeight = FontWeight.Bold
    )
    Spacer(modifier = Modifier.height(12.dp))
    Text(
        text = state.impactTitle,
        color = DeepSleepTheme.colors.textPrimary,
        fontSize = 32.sp,
        fontWeight = FontWeight.Light,
        lineHeight = 36.sp
    )
    Spacer(modifier = Modifier.height(32.dp))

    // Plausible List
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, DeepSleepTheme.colors.separator)
            .padding(16.dp)
    ) {
        state.evidenceList.forEachIndexed { index, evidence ->
            Text(
                text = evidence,
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Normal,
                modifier = Modifier.padding(vertical = 8.dp)
            )
            if (index < state.evidenceList.size - 1) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(DeepSleepTheme.colors.separator)
                )
            }
        }
    }

    Spacer(modifier = Modifier.height(40.dp))

    Text(
        text = "A LIGAÇÃO PLAUSÍVEL",
        color = DeepSleepTheme.colors.textMuted,
        fontSize = 10.sp,
        letterSpacing = 1.sp,
        fontWeight = FontWeight.Bold
    )
    Spacer(modifier = Modifier.height(8.dp))
    Text(
        text = state.plausibleLink,
        color = DeepSleepTheme.colors.textSecondary,
        fontSize = 14.sp,
        lineHeight = 22.sp,
        fontWeight = FontWeight.Light
    )

    Spacer(modifier = Modifier.height(40.dp))

    Text(
        text = "RECOMENDAÇÃO PRÁTICA",
        color = DeepSleepTheme.colors.textMuted,
        fontSize = 10.sp,
        letterSpacing = 1.sp,
        fontWeight = FontWeight.Bold
    )
    Spacer(modifier = Modifier.height(8.dp))
    Text(
        text = state.practicalRecommendation,
        color = DeepSleepTheme.colors.textPrimary, 
        fontSize = 16.sp,
        lineHeight = 24.sp,
        fontWeight = FontWeight.Normal
    )
}
