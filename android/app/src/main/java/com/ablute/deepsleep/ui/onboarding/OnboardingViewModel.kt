package com.ablute.deepsleep.ui.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ablute.deepsleep.data.SessionStateStore
import kotlinx.coroutines.launch

class OnboardingViewModel(
    private val store: SessionStateStore
) : ViewModel() {
    
    fun completeOnboarding(onSuccess: () -> Unit) {
        viewModelScope.launch {
            store.markOnboardingComplete()
            onSuccess()
        }
    }
}
