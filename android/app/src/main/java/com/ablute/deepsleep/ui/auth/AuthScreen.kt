package com.ablute.deepsleep.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun AuthScreen(
    viewModel: AuthViewModel
) {
    val state by viewModel.viewState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSleepTheme.colors.background)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "_deepSleep",
            color = DeepSleepTheme.colors.textPrimary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Light,
            letterSpacing = 2.sp,
            modifier = Modifier.padding(bottom = 64.dp)
        )

        OutlinedTextField(
            value = state.email,
            onValueChange = { viewModel.onIntent(AuthIntent.UpdateEmail(it)) },
            label = { Text("Email", color = DeepSleepTheme.colors.textMuted) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = DeepSleepTheme.colors.textPrimary,
                unfocusedTextColor = DeepSleepTheme.colors.textPrimary,
                focusedBorderColor = DeepSleepTheme.colors.surfaceLight,
                unfocusedBorderColor = DeepSleepTheme.colors.surfaceLight.copy(alpha=0.5f),
            ),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            singleLine = true
        )

        OutlinedTextField(
            value = state.password,
            onValueChange = { viewModel.onIntent(AuthIntent.UpdatePassword(it)) },
            label = { Text("Password", color = DeepSleepTheme.colors.textMuted) },
            visualTransformation = PasswordVisualTransformation(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = DeepSleepTheme.colors.textPrimary,
                unfocusedTextColor = DeepSleepTheme.colors.textPrimary,
                focusedBorderColor = DeepSleepTheme.colors.surfaceLight,
                unfocusedBorderColor = DeepSleepTheme.colors.surfaceLight.copy(alpha=0.5f),
            ),
            modifier = Modifier.fillMaxWidth().padding(bottom = 32.dp),
            singleLine = true
        )

        if (state.error != null) {
            Text(
                text = state.error!!,
                color = DeepSleepTheme.colors.error,
                fontSize = 12.sp,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }

        Button(
            onClick = { viewModel.onIntent(AuthIntent.Submit) },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = DeepSleepTheme.colors.surfaceLight),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(8.dp)
        ) {
            Text(
                text = if (state.isSignUp) "CRIAR CONTA" else "INICIAR SESSÃO",
                color = DeepSleepTheme.colors.textPrimary,
                letterSpacing = 1.sp,
                fontWeight = FontWeight.Medium
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = if (state.isSignUp) "Já tens conta? Iniciar sessão" else "Não tens conta? Criar",
            color = DeepSleepTheme.colors.textMuted,
            fontSize = 14.sp,
            modifier = Modifier.clickable { viewModel.onIntent(AuthIntent.ToggleMode) }
        )
    }
}
