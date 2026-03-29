package com.ablute.deepsleep.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.material3.IconButton
import androidx.compose.material3.Icon
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import com.ablute.deepsleep.ui.control.ControlScreen
import com.ablute.deepsleep.ui.control.ControlViewModel
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun SettingsScreen(
    viewModel: ControlViewModel,
    onNavigateBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
    ) {
        // App Header Simulation for Settings
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp, start = 8.dp, end = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Voltar",
                    tint = DeepSleepTheme.colors.textPrimary
                )
            }
        }
        
        // We reuse the body of the control screen since the capabilities are identical
        Box(modifier = Modifier.weight(1f)) {
            ControlScreen(viewModel = viewModel)
        }
    }
}
