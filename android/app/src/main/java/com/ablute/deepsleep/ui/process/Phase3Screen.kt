package com.ablute.deepsleep.ui.process

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun Phase3Screen(
    viewModel: Phase3ViewModel,
    onNavigateBack: () -> Unit
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

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = "Observância e Ajustes",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 40.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Dia ${uiState.dayCount} do ciclo de adoção.",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 14.sp,
            letterSpacing = 1.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(32.dp))

        if (!uiState.todayReported) {
             ReportCard(
                 onReport = { viewModel.submitDailyReport(it) }
             )
        } else {
             Text(
                 text = "Relatório de hoje recebido.",
                 color = DeepSleepTheme.colors.accent,
                 fontSize = 12.sp,
                 letterSpacing = 1.sp
             )
        }

        Spacer(modifier = Modifier.height(48.dp))
        
        Text(
            text = "PROPOSTAS ATIVAS",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 10.sp,
            letterSpacing = 2.sp,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
             items(uiState.proposals) { prop ->
                  ActiveProposalCard(prop)
             }
        }
    }
}

@Composable
fun ReportCard(onReport: (Boolean) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(DeepSleepTheme.colors.surfaceLight, RoundedCornerShape(12.dp))
            .padding(24.dp)
    ) {
        Text(
            text = "Ontem conseguiste seguir as propostas combinadas?",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 18.sp,
            lineHeight = 24.sp,
            fontWeight = FontWeight.Medium
        )
        Spacer(modifier = Modifier.height(24.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
             Button(
                 onClick = { onReport(true) },
                 modifier = Modifier.weight(1f).height(48.dp),
                 colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.textPrimary),
                 shape = RoundedCornerShape(8.dp)
             ) {
                 Text("SIM", color = DeepSleepTheme.colors.background)
             }
             Button(
                 onClick = { onReport(false) },
                 modifier = Modifier.weight(1f).height(48.dp),
                 colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.textSecondary),
                 shape = RoundedCornerShape(8.dp)
             ) {
                 Text("NÃO", color = DeepSleepTheme.colors.background)
             }
        }
    }
}

@Composable
fun ActiveProposalCard(prop: ProposalEntity) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(DeepSleepTheme.colors.surfaceLight.copy(alpha=0.5f), RoundedCornerShape(8.dp))
            .padding(16.dp)
    ) {
        Text(
            text = prop.title.uppercase(),
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = prop.actionStr,
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 14.sp,
            lineHeight = 20.sp
        )
    }
}
