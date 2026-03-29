package com.ablute.deepsleep.ui.process

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun Phase2EntryScreen(
    onNavigateBack: () -> Unit,
    onModeSelected: (Int) -> Unit // 10 or 25
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
            .padding(24.dp)
    ) {
        IconButton(onClick = onNavigateBack, modifier = Modifier.padding(top = 16.dp)) {
            Icon(
                imageVector = Icons.Default.ArrowBack,
                contentDescription = "Voltar",
                tint = DeepSleepTheme.colors.textPrimary
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = "Contexto e propostas",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 40.sp
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Text(
            text = "Para perceber melhor o que está a afectar o teu sono, preciso de saber mais sobre ti. Que disponibilidade tens para responder a algumas questões?",
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 16.sp,
            lineHeight = 24.sp
        )

        Spacer(modifier = Modifier.weight(1f))

        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 64.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Button(
                onClick = { onModeSelected(10) },
                modifier = Modifier.weight(1f).height(64.dp),
                colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.surfaceLight),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("10\nPERGUNTAS", color = DeepSleepTheme.colors.textPrimary, fontSize = 12.sp, letterSpacing = 1.sp)
            }

            Button(
                onClick = { onModeSelected(25) },
                modifier = Modifier.weight(1f).height(64.dp),
                colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.surfaceLight),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("25\nPERGUNTAS", color = DeepSleepTheme.colors.textPrimary, fontSize = 12.sp, letterSpacing = 1.sp)
            }
        }
    }
}
