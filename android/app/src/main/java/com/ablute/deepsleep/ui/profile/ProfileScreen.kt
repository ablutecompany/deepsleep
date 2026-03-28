package com.ablute.deepsleep.ui.profile

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
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun ProfileScreen(viewModel: ProfileViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
            .padding(24.dp)
    ) {
        Column(modifier = Modifier.padding(top = 40.dp)) {
            when (val state = uiState) {
                is ProfileUiState.Loading -> {
                     Text("A processar matriz de identidade...", color = DeepSleepTheme.colors.textMuted)
                }
                is ProfileUiState.InsufficientHistory -> {
                     Text(
                         text = "PERFIL INDISPONÍVEL",
                         color = DeepSleepTheme.colors.textMuted,
                         fontSize = 10.sp,
                         letterSpacing = 1.sp,
                         fontWeight = FontWeight.Bold
                     )
                     Spacer(modifier = Modifier.height(16.dp))
                     Text(
                         text = "O histórico em posse não suporta premissas de identidade fortes. A arquitetura recusa adivinhar o modelo sem massa empírica sólida.\n\nRegressa após consolidação de noites válidas.",
                         color = DeepSleepTheme.colors.textSecondary,
                         fontSize = 16.sp,
                         lineHeight = 24.sp
                     )
                }
                is ProfileUiState.Content -> {
                     val mainLabel = if (state.isConsolidated) "PERFIL CONSOLIDADO" else "PERFIL PROVISÓRIO"
                     Text(
                         text = mainLabel,
                         color = if (state.isConsolidated) DeepSleepTheme.colors.textPrimary else DeepSleepTheme.colors.accent,
                         fontSize = 10.sp,
                         letterSpacing = 1.sp,
                         fontWeight = FontWeight.Bold
                     )
                     Spacer(modifier = Modifier.height(48.dp))

                     state.traits.forEach { trait ->
                         Column(modifier = Modifier.padding(bottom = 32.dp)) {
                             Text(
                                 text = trait.title,
                                 color = DeepSleepTheme.colors.textPrimary,
                                 fontSize = 20.sp,
                                 fontWeight = FontWeight.Normal,
                                 lineHeight = 24.sp
                             )
                             if (trait.isEmerging) {
                                 Text(
                                     text = "SINAL EMERGENTE",
                                     color = DeepSleepTheme.colors.accent,
                                     fontSize = 10.sp,
                                     letterSpacing = 1.sp,
                                     modifier = Modifier.padding(top = 8.dp)
                                 )
                             }
                             Spacer(modifier = Modifier.height(16.dp))
                             Text(
                                 text = trait.description,
                                 color = DeepSleepTheme.colors.textSecondary,
                                 fontSize = 14.sp,
                                 lineHeight = 22.sp
                             )
                             Spacer(modifier = Modifier.height(24.dp))
                             Box(
                                 modifier = Modifier
                                     .fillMaxWidth()
                                     .height(1.dp)
                                     .background(DeepSleepTheme.colors.separator)
                             )
                         }
                     }
                }
            }
        }
    }
}
