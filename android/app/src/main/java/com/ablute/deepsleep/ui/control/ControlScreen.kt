package com.ablute.deepsleep.ui.control

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun ControlScreen(viewModel: ControlViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadSettings()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
            .padding(24.dp)
    ) {
        Column(modifier = Modifier.padding(top = 40.dp)) {
            Text(
                text = "CONTROLO E PRIVACIDADE",
                color = DeepSleepTheme.colors.textMuted,
                fontSize = 10.sp,
                letterSpacing = 1.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(48.dp))

            when (val state = uiState) {
                 is ControlUiState.Loading -> { }
                 is ControlUiState.Content -> {
                      // Permissões Reais Dinâmicas
                      Text(
                          text = "Superfície de Captura",
                          color = DeepSleepTheme.colors.textSecondary,
                          fontSize = 12.sp,
                          letterSpacing = 1.sp
                      )
                      Spacer(modifier = Modifier.height(16.dp))
                      PermissionRow("Microfone (Ruído de Fundo)", state.hasAudioPermission)
                      PermissionRow("Estatísticas de Ecrã (Fricção)", state.hasUsagePermission)
                      
                      Spacer(modifier = Modifier.height(48.dp))
                      // Retenção Orgânica
                      Text(
                          text = "Identidade Persistente",
                          color = DeepSleepTheme.colors.textSecondary,
                          fontSize = 12.sp,
                          letterSpacing = 1.sp
                      )
                      Spacer(modifier = Modifier.height(16.dp))
                      DataRow("Noites Integrais Registadas", "${state.sessionCount}")
                      DataRow("Jurisdição de Retenção", "Local Apenas")
                      
                      Spacer(modifier = Modifier.height(48.dp))
                      // Expurgar Real DB Teardown
                      Column(modifier = Modifier.clickable { viewModel.deleteProfileData() }) {
                           Text(
                               text = "APAGAR HISTÓRICO LOCAL",
                               color = DeepSleepTheme.colors.accent,
                               fontSize = 12.sp,
                               letterSpacing = 1.sp,
                               fontWeight = FontWeight.Bold
                           )
                           Spacer(modifier = Modifier.height(4.dp))
                           Text(
                               text = "Ativa a destruição criptográfica imediata de todos os padrões. A aplicação retornará ao estado de memória zero.",
                               color = DeepSleepTheme.colors.textMuted,
                               fontSize = 12.sp,
                               lineHeight = 16.sp
                           )
                      }
                 }
            }
        }
    }
}

@Composable
fun PermissionRow(title: String, granted: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(title, color = DeepSleepTheme.colors.textPrimary, fontSize = 16.sp, fontWeight = FontWeight.Light)
        Text(
            if (granted) "AUTORIZADO" else "BLOQUEADO", 
            color = if (granted) DeepSleepTheme.colors.textSecondary else DeepSleepTheme.colors.accent, 
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp
        )
    }
}

@Composable
fun DataRow(title: String, value: String) {
     Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(title, color = DeepSleepTheme.colors.textPrimary, fontSize = 16.sp, fontWeight = FontWeight.Light)
        Text(
            value, 
            color = DeepSleepTheme.colors.textPrimary, 
            fontSize = 14.sp
        )
    }
}
