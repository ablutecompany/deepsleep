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
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import android.content.Intent
import android.provider.Settings
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
                    state = state,
                    viewModel = viewModel,
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

import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.compose.runtime.DisposableEffect

@Composable
private fun ArmedContent(state: TonightUiState.ArmedNotStarted, viewModel: TonightViewModel, onNavigateBack: () -> Unit) {

    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                viewModel.refreshCapabilityState()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    // Native Permission Launchers that route seamlessly without fragmenting UI
    val usageLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        viewModel.refreshCapabilityState()
        viewModel.startSession()
    }

    val audioLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        viewModel.refreshCapabilityState()
        if (!viewModel.hasUsageAccess()) {
            usageLauncher.launch(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        } else {
            viewModel.startSession()
        }
    }

    val runPermissionGateway = {
        if (!viewModel.hasAudioAccess()) {
             audioLauncher.launch(android.Manifest.permission.RECORD_AUDIO)
        } else if (!viewModel.hasUsageAccess()) {
             usageLauncher.launch(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        } else {
             viewModel.startSession()
        }
    }

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
                .clickable { runPermissionGateway() }
        )

        val missingAudio = !state.hasAudio
        val missingUsage = !state.hasUsage
        if (missingAudio || missingUsage) {
             Spacer(modifier = Modifier.height(24.dp))
             Text(
                 text = "A iniciar como sessão cega (precisão comprometida).",
                 color = DeepSleepTheme.colors.accent,
                 fontSize = 12.sp,
                 fontWeight = FontWeight.Bold
             )
             Spacer(modifier = Modifier.height(4.dp))
             val drops = mutableListOf<String>()
             if (missingAudio) drops.add("Microfone")
             if (missingUsage) drops.add("Uso de Ecrã")
             Text(
                 text = "Sensores com acesso em falta: ${drops.joinToString(" e ")}.\nAcede ao Controlo para limpares os bloqueios.",
                 color = DeepSleepTheme.colors.textSecondary,
                 fontSize = 12.sp,
                 lineHeight = 16.sp,
                 modifier = Modifier.alpha(0.8f)
             )
        }

        Spacer(modifier = Modifier.height(40.dp))
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
