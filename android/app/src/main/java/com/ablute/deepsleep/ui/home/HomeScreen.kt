package com.ablute.deepsleep.ui.home

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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateTonight: () -> Unit,
    onNavigateInsight: () -> Unit
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
            when (val state = uiState) {
                is HomeUiState.Loading -> {
                    Text(
                        text = "A iniciar matriz...",
                        color = DeepSleepTheme.colors.textMuted,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(top = 80.dp)
                    )
                }
                is HomeUiState.SessionInterrupted -> {
                    Text(
                        text = state.reasonText,
                        color = DeepSleepTheme.colors.textSecondary,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(top = 80.dp)
                    )
                }
                is HomeUiState.NoData -> {
                    Text(
                        text = "Sem sessão registada hoje. Inicia a monitorização na aba Noite.",
                        color = DeepSleepTheme.colors.textSecondary,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(top = 80.dp)
                    )
                }
                is HomeUiState.ProcessingPending -> {
                    Text(
                        text = "A processar padrões da madrugada.",
                        color = DeepSleepTheme.colors.textSecondary,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(top = 80.dp)
                    )
                }
                is HomeUiState.NightReviewReady -> {
                    HomeContentReady(
                        state = state,
                        onNavigateTonight = onNavigateTonight,
                        onNavigateInsight = onNavigateInsight
                    )
                }
            }
        }
    }
}

@Composable
private fun HomeContentReady(
    state: HomeUiState.NightReviewReady,
    onNavigateTonight: () -> Unit,
    onNavigateInsight: () -> Unit
) {
    // Hero Section Editorial
    Column(modifier = Modifier.padding(top = 60.dp, bottom = 40.dp)) {
        Text(
            text = "ANÁLISE CONCLUÍDA",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 1.5.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = state.headline,
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 42.sp,
            fontWeight = FontWeight.Light,
            lineHeight = 44.sp
        )
        Spacer(modifier = Modifier.height(24.dp))
        
        // System Confidence Label
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .border(1.dp, DeepSleepTheme.colors.separator)
                .padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .background(DeepSleepTheme.colors.accent)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = state.confidenceLabel,
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 10.sp,
                letterSpacing = 1.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }

    // Impact Module 
    if (state.primaryImpactTitle != null) {
        EditorialModule(
            kicker = "O QUE MAIS PESOU",
            title = state.primaryImpactTitle,
            description = state.primaryImpactDesc ?: "",
            isAccent = true,
            actionText = "Como chegámos aqui →",
            onAction = onNavigateInsight
        )
        Spacer(modifier = Modifier.height(40.dp))
    }

    // Action Module
    EditorialModule(
        kicker = "FOCO PARA HOJE",
        title = state.priorityActionTitle,
        description = state.priorityActionDesc,
        isAccent = false,
        actionText = "Iniciar sessão nocturna",
        onAction = onNavigateTonight
    )

    Spacer(modifier = Modifier.height(48.dp))

    // Learning Matrix Log
    Column {
        Text(
            text = "O QUE ESTAMOS A APRENDER",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 1.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = state.learningStateText,
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 16.sp,
            fontWeight = FontWeight.Light,
            lineHeight = 24.sp
        )
    }
}

@Composable
private fun EditorialModule(
    kicker: String,
    title: String,
    description: String,
    isAccent: Boolean,
    actionText: String,
    onAction: () -> Unit
) {
    Column {
        Text(
            text = kicker,
            color = if (isAccent) DeepSleepTheme.colors.accent else DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 1.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = title,
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Normal
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = description,
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Light,
            lineHeight = 22.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = actionText,
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier
                .clickable { onAction() }
                .alpha(0.8f)
                .padding(vertical = 8.dp)
        )
    }
}
