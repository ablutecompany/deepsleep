package com.ablute.deepsleep.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun OnboardingScreen(viewModel: OnboardingViewModel, onComplete: () -> Unit) {
    val step = remember { mutableStateOf(1) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
            .padding(32.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            if (step.value == 1) {
                Text(
                    text = "A INTELIGÊNCIA\nDO TEU SONO",
                    color = DeepSleepTheme.colors.textPrimary,
                    fontSize = 32.sp,
                    lineHeight = 36.sp,
                    fontWeight = FontWeight.Light
                )
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "O _deepSleep avalia a mecânica do teu sono através de sinais físicos e acústicos. Sem necessitar de hardware externo.",
                    color = DeepSleepTheme.colors.textSecondary,
                    fontSize = 16.sp,
                    lineHeight = 24.sp
                )
            } else {
                Text(
                    text = "O CONTRATO\nDE PRIVACIDADE",
                    color = DeepSleepTheme.colors.textPrimary,
                    fontSize = 32.sp,
                    lineHeight = 36.sp,
                    fontWeight = FontWeight.Light
                )
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "A arquitetura de processamento opera de forma estritamente isolada e local. Para auditar os distúrbios da noite, necessitará de aceder ao teu microfone e sistema.",
                    color = DeepSleepTheme.colors.textSecondary,
                    fontSize = 16.sp,
                    lineHeight = 24.sp
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Qualquer recusa de sensores causará apenas perda de precisão, não perda de funcionamento do produto.",
                    color = DeepSleepTheme.colors.accent,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
            }
        }

        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(bottom = 32.dp)
                .clickable {
                    if (step.value == 1) step.value = 2 else viewModel.completeOnboarding(onComplete)
                }
        ) {
            Text(
                text = if (step.value == 1) "AVANÇAR" else "COMPREENDI E ACEITO",
                color = DeepSleepTheme.colors.textPrimary,
                fontSize = 12.sp,
                letterSpacing = 2.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}
