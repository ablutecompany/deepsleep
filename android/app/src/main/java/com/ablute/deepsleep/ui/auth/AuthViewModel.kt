package com.ablute.deepsleep.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.data.SessionStateStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel(
    private val sessionStore: SessionStateStore
) : ViewModel() {

    private val _viewState = MutableStateFlow(AuthState())
    val viewState = _viewState.asStateFlow()

    fun onIntent(intent: AuthIntent) {
        when (intent) {
            is AuthIntent.ToggleMode -> {
                _viewState.value = _viewState.value.copy(
                    isSignUp = !_viewState.value.isSignUp,
                    error = null
                )
            }
            is AuthIntent.UpdateEmail -> {
                _viewState.value = _viewState.value.copy(email = intent.email, error = null)
            }
            is AuthIntent.UpdatePassword -> {
                _viewState.value = _viewState.value.copy(password = intent.password, error = null)
            }
            is AuthIntent.Submit -> {
                authenticate()
            }
        }
    }

    private fun authenticate() {
        val state = _viewState.value
        if (state.email.isBlank() || state.password.isBlank()) {
            _viewState.value = state.copy(error = "Preenche todos os campos.")
            return
        }
        
        // Mocked Auth for Alpha
        viewModelScope.launch {
            sessionStore.setAuthenticated(true)
        }
    }
}

data class AuthState(
    val isSignUp: Boolean = false,
    val email: String = "",
    val password: String = "",
    val error: String? = null
)

sealed class AuthIntent {
    object ToggleMode : AuthIntent()
    data class UpdateEmail(val email: String) : AuthIntent()
    data class UpdatePassword(val password: String) : AuthIntent()
    object Submit : AuthIntent()
}
