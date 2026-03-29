package com.ablute.deepsleep.ui.process

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
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
fun ProcessHomeScreen(
    viewModel: ProcessViewModel,
    onNavigateSettings: () -> Unit,
    onNavigateProfile: () -> Unit,
    onNavigatePhase1: () -> Unit,
    onNavigatePhase2: () -> Unit,
    onNavigatePhase3: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
    ) {
        // App Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp, start = 24.dp, end = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "_deepSleep",
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Light,
                letterSpacing = 1.dp
            )
            Row {
                IconButton(onClick = onNavigateProfile) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Profile",
                        tint = DeepSleepTheme.colors.textPrimary
                    )
                }
                IconButton(onClick = onNavigateSettings) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = DeepSleepTheme.colors.textPrimary
                    )
                }
            }
        }

        // Main Body Title
        Column(modifier = Modifier.padding(start = 24.dp, end = 24.dp, top = 40.dp)) {
            Text(
                text = "O teu sono melhora por fases.",
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 28.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 36.sp
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Primeiro observamos. Depois interpretamos.\nPor fim ajustamos.",
                color = DeepSleepTheme.colors.textSecondary,
                fontSize = 14.sp,
                lineHeight = 22.sp
            )
        }

        Spacer(modifier = Modifier.height(64.dp))

        // Process Blocks
        when (val state = uiState) {
            is ProcessUiState.Loading -> {
                // Loading simulation could go here
            }
            is ProcessUiState.Active -> {
                Column(
                    modifier = Modifier.padding(horizontal = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    ProcessBlock(
                        title = "1. Monitorização e perfil de sono",
                        status = state.phase1Status,
                        onClick = onNavigatePhase1,
                        isClickable = state.isPhase1Clickable
                    )
                    ProcessBlock(
                        title = "2. Contexto e propostas",
                        status = state.phase2Status,
                        onClick = if (state.isPhase2Clickable) onNavigatePhase2 else null,
                        isClickable = state.isPhase2Clickable
                    )
                    ProcessBlock(
                        title = "3. Observância e ajustes",
                        status = state.phase3Status,
                        onClick = if (state.isPhase3Clickable) onNavigatePhase3 else null,
                        isClickable = state.isPhase3Clickable
                    )
                }
            }
        }
    }
}

@Composable
fun ProcessBlock(
    title: String,
    status: String,
    onClick: (() -> Unit)?,
    isClickable: Boolean
) {
    val alphaModifier = if (isClickable) 1f else 0.4f
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .alpha(alphaModifier)
            .background(
                color = DeepSleepTheme.colors.surfaceLight,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(enabled = isClickable && onClick != null) { onClick?.invoke() }
            .padding(20.dp)
    ) {
        Column {
            Text(
                text = title,
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = status.uppercase(),
                color = if (status == "Bloqueada") DeepSleepTheme.colors.accent else DeepSleepTheme.colors.textPrimary,
                fontSize = 10.sp,
                letterSpacing = 1.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
