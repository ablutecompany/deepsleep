package com.ablute.deepsleep.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

data class DeepSleepColors(
    val background: Color = PitchBlack,
    val surface: Color = DarkSurface,
    val textPrimary: Color = TextPrimary,
    val textSecondary: Color = TextSecondary,
    val textMuted: Color = TextMuted,
    val accent: Color = AccentNocturnal,
    val separator: Color = SeparatorSubdued
)

val LocalDeepSleepColors = staticCompositionLocalOf { DeepSleepColors() }

// O MaterialPrimitives é injetado como fallback, mas operamos no nosso contrato Visual 
private val DarkColorPalette = darkColorScheme(
    primary = AccentNocturnal,
    background = PitchBlack,
    surface = DarkSurface,
    onPrimary = PitchBlack,
    onBackground = TextPrimary,
    onSurface = TextSecondary
)

@Composable
fun DeepSleepTheme(
    content: @Composable () -> Unit
) {
    val colors = DeepSleepColors()

    CompositionLocalProvider(
        LocalDeepSleepColors provides colors
    ) {
        MaterialTheme(
            colorScheme = DarkColorPalette,
            // Typography a associar posteriormente
            content = content
        )
    }
}

// Extension object for easy access
object DeepSleepTheme {
    val colors: DeepSleepColors
        @Composable
        @ReadOnlyComposable
        get() = LocalDeepSleepColors.current
}
