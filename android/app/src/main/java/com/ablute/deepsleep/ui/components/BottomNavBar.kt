package com.ablute.deepsleep.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun BottomNavBar(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(DeepSleepTheme.colors.background)
            .padding(vertical = 16.dp, horizontal = 24.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        NavItem("Início", "phase1_home", currentRoute, onNavigate)
        NavItem("Noite", "tonight", currentRoute, onNavigate)
        NavItem("Padrões", "patterns", currentRoute, onNavigate)
        NavItem("Perfil", "profile", currentRoute, onNavigate)
    }
}

@Composable
private fun NavItem(
    label: String,
    route: String,
    currentRoute: String,
    onClick: (String) -> Unit
) {
    val isSelected = currentRoute == route
    val color = if (isSelected) DeepSleepTheme.colors.textPrimary else DeepSleepTheme.colors.textMuted
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null, // Disable generic Android ripple to match premium frozen UX
            onClick = { onClick(route) }
        )
    ) {
        Text(
            text = label.uppercase(),
            color = color,
            fontSize = 10.sp,
            letterSpacing = 1.sp,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        // Night Dot Indicator
        if (isSelected) {
            Box(
                modifier = Modifier
                    .size(3.dp)
                    .background(DeepSleepTheme.colors.textPrimary)
            )
        } else {
            Spacer(modifier = Modifier.size(3.dp))
        }
    }
}
