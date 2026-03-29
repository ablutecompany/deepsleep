package com.ablute.deepsleep

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.ablute.deepsleep.ui.theme.DeepSleepTheme
import com.ablute.deepsleep.ui.navigation.DeepSleepApp
import com.ablute.deepsleep.data.FixtureNightAnalysisRepository
import com.ablute.deepsleep.ui.home.HomeViewModel
import com.ablute.deepsleep.ui.insight.InsightDetailViewModel
import com.ablute.deepsleep.ui.tonight.TonightViewModel
import com.ablute.deepsleep.domain.SensorCapabilityManager
import com.ablute.deepsleep.data.SessionStateStore
import com.ablute.deepsleep.domain.NightSessionController

import com.ablute.deepsleep.data.sensors.AudioIngestionManager
import com.ablute.deepsleep.data.sensors.UsageIngestionManager

import com.ablute.deepsleep.data.local.RoomNightAnalysisRepository
import com.ablute.deepsleep.domain.SignalInferenceEngine

class MainActivity : ComponentActivity() {
    // For Track 2 Vertical Slice, manual localized instancing for clarity.
    // Core Engine bound to Reality (CapabilityManager)
    private val capabilityManager by lazy { SensorCapabilityManager(applicationContext) }
    private val sessionStore by lazy { SessionStateStore(applicationContext) }
    private val repository by lazy { RoomNightAnalysisRepository(sessionDao) }

    private val homeViewModel by lazy { HomeViewModel(repository, analysisEngine) }
    private val insightViewModel by lazy { InsightDetailViewModel(repository) }
    private val tonightViewModel by lazy { TonightViewModel(sessionController, capabilityManager) }

    // Package C: Historical Persistence and Pattern Analysis
    private val database by lazy { com.ablute.deepsleep.data.local.DeepSleepDatabase.getDatabase(applicationContext) }
    private val sessionDao by lazy { database.sessionDao() }
    private val processDao by lazy { database.processDao() }
    private val processRepository by lazy { com.ablute.deepsleep.data.ProcessRepository(processDao, sessionDao) }
    
    private val analysisEngine by lazy { com.ablute.deepsleep.domain.HistoricalAnalysisEngine(sessionDao) }
    private val signalEngine by lazy { SignalInferenceEngine() }
    
    // Core Skeletons injected with SessionDao
    private val audioSkeleton by lazy { AudioIngestionManager(capabilityManager, applicationContext) }
    private val usageSkeleton by lazy { UsageIngestionManager(applicationContext, capabilityManager) }

    private val sessionController by lazy { 
        NightSessionController(applicationContext, sessionStore, audioSkeleton, usageSkeleton, sessionDao, capabilityManager, signalEngine) 
    }

    private val patternsViewModel by lazy { com.ablute.deepsleep.ui.patterns.PatternsViewModel(analysisEngine) }
    private val profileViewModel by lazy { com.ablute.deepsleep.ui.profile.ProfileViewModel(analysisEngine) }
    private val controlViewModel by lazy { com.ablute.deepsleep.ui.control.ControlViewModel(capabilityManager, sessionDao) }
    private val onboardingViewModel by lazy { com.ablute.deepsleep.ui.onboarding.OnboardingViewModel(sessionStore) }
    
    private val authViewModel by lazy { com.ablute.deepsleep.ui.auth.AuthViewModel(sessionStore) }
    private val processViewModel by lazy { com.ablute.deepsleep.ui.process.ProcessViewModel(processRepository) }
    private val phase2ViewModel by lazy { com.ablute.deepsleep.ui.process.Phase2ViewModel(processRepository) }
    private val phase3ViewModel by lazy { com.ablute.deepsleep.ui.process.Phase3ViewModel(processRepository) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            val isOnboarded by sessionStore.hasCompletedOnboardingFlow.collectAsState(initial = true)
            val isAuthenticated by sessionStore.isAuthenticatedFlow.collectAsState(initial = false)
            
            DeepSleepTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DeepSleepTheme.colors.background
                ) {
                    DeepSleepApp(
                        homeViewModel = homeViewModel,
                        insightViewModel = insightViewModel,
                        tonightViewModel = tonightViewModel,
                        patternsViewModel = patternsViewModel,
                        profileViewModel = profileViewModel,
                        controlViewModel = controlViewModel,
                        onboardingViewModel = onboardingViewModel,
                        authViewModel = authViewModel,
                        processViewModel = processViewModel,
                        phase2ViewModel = phase2ViewModel,
                        phase3ViewModel = phase3ViewModel,
                        isOnboarded = isOnboarded,
                        isAuthenticated = isAuthenticated
                    )
                }
            }
        }
    }
}
