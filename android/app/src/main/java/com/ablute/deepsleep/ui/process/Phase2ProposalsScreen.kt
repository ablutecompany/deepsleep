package com.ablute.deepsleep.ui.process

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.data.local.ProposalEntity
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun Phase2ProposalsScreen(
    viewModel: Phase2ViewModel,
    onNavigateBack: () -> Unit,
    onAcceptProposals: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

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

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "As tuas propostas",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.Medium
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = "Delineadas a partir da leitura direta das tuas noites e do teu contexto psíquico.",
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 14.sp,
            lineHeight = 22.sp
        )

        Spacer(modifier = Modifier.height(32.dp))

        uiState.proposals.forEachIndexed { index, prop ->
            ProposalCard(index + 1, prop)
            Spacer(modifier = Modifier.height(16.dp))
        }

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = onAcceptProposals,
            modifier = Modifier.fillMaxWidth().height(56.dp).padding(bottom = 16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.textPrimary),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("INICIAR OBSERVÂNCIA (FASE 3)", color = DeepSleepTheme.colors.background, letterSpacing = 1.sp)
        }
    }
}

@Composable
fun ProposalCard(number: Int, prop: ProposalEntity) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(DeepSleepTheme.colors.surfaceLight, RoundedCornerShape(12.dp))
            .padding(20.dp)
    ) {
        Text(
            text = "PROPOSTA $number",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 1.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = prop.title,
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 18.sp,
            fontWeight = FontWeight.Medium
        )
        Spacer(modifier = Modifier.height(12.dp))
        
        Text(
            text = "Hipótese: ${prop.hypothesis}",
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 12.sp,
            lineHeight = 18.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Ação: ${prop.actionStr}",
            color = DeepSleepTheme.colors.accent,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 18.sp
        )
    }
}
