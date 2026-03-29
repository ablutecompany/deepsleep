package com.ablute.deepsleep.ui.process

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun Phase1EntryScreen(
    onNavigateBack: () -> Unit,
    onNavigateTonight: () -> Unit,
    onNavigateWorkspace: () -> Unit,
    hasData: Boolean
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
            text = "Monitorização e perfil de sono",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 40.sp
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Text(
            text = "Começamos por observar as tuas noites e construir o teu perfil de sono. Quanto mais consistente for a monitorização, mais precisa será a leitura do que te ajuda ou prejudica.",
            color = DeepSleepTheme.colors.textSecondary,
            fontSize = 16.sp,
            lineHeight = 24.sp
        )

        Spacer(modifier = Modifier.weight(1f))

        if (hasData) {
            Button(
                onClick = onNavigateWorkspace,
                modifier = Modifier.fillMaxWidth().height(56.dp).padding(bottom = 16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.surfaceLight),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("ACEDER AO WORKSPACE", color = DeepSleepTheme.colors.textPrimary, letterSpacing = 1.sp)
            }
        }

        Button(
            onClick = onNavigateTonight,
            modifier = Modifier.fillMaxWidth().height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (hasData) Color.Transparent else DeepSleepTheme.colors.surfaceLight
            ),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text(
                text = "INICIAR SESSÃO NOCTURNA", 
                color = DeepSleepTheme.colors.textPrimary, 
                letterSpacing = 1.sp
            )
        }
        
        Spacer(modifier = Modifier.height(64.dp))
    }
}
