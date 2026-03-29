package com.ablute.deepsleep.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.ablute.deepsleep.ui.components.BottomNavBar
import com.ablute.deepsleep.ui.home.HomeScreen
import com.ablute.deepsleep.ui.home.HomeViewModel
import com.ablute.deepsleep.ui.insight.InsightDetailScreen
import com.ablute.deepsleep.ui.insight.InsightDetailViewModel
import com.ablute.deepsleep.ui.theme.DeepSleepTheme
import com.ablute.deepsleep.ui.patterns.PatternsScreen
import com.ablute.deepsleep.ui.patterns.PatternsViewModel
import com.ablute.deepsleep.ui.profile.ProfileScreen
import com.ablute.deepsleep.ui.profile.ProfileViewModel
import com.ablute.deepsleep.ui.control.ControlViewModel
import com.ablute.deepsleep.ui.onboarding.OnboardingScreen
import com.ablute.deepsleep.ui.onboarding.OnboardingViewModel

import com.ablute.deepsleep.ui.auth.AuthScreen
import com.ablute.deepsleep.ui.auth.AuthViewModel
import com.ablute.deepsleep.ui.process.ProcessHomeScreen
import com.ablute.deepsleep.ui.process.ProcessViewModel
import com.ablute.deepsleep.ui.process.Phase1EntryScreen
import com.ablute.deepsleep.ui.process.Phase2ViewModel
import com.ablute.deepsleep.ui.process.Phase2EntryScreen
import com.ablute.deepsleep.ui.process.Phase2QuestionsScreen
import com.ablute.deepsleep.ui.process.Phase2ProposalsScreen
import com.ablute.deepsleep.ui.process.Phase3ViewModel
import com.ablute.deepsleep.ui.process.Phase3Screen
import com.ablute.deepsleep.ui.settings.SettingsScreen
import com.ablute.deepsleep.ui.tonight.TonightScreen
import com.ablute.deepsleep.ui.tonight.TonightViewModel

@Composable
fun DeepSleepApp(
    homeViewModel: HomeViewModel,
    insightViewModel: InsightDetailViewModel,
    tonightViewModel: TonightViewModel,
    patternsViewModel: PatternsViewModel,
    profileViewModel: ProfileViewModel,
    controlViewModel: ControlViewModel,
    onboardingViewModel: OnboardingViewModel,
    authViewModel: AuthViewModel,
    processViewModel: ProcessViewModel,
    phase2ViewModel: Phase2ViewModel,
    phase3ViewModel: Phase3ViewModel,
    isOnboarded: Boolean,
    isAuthenticated: Boolean
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Auth gating
    if (!isAuthenticated) {
        AuthScreen(viewModel = authViewModel)
        return
    }

    // Phase 1 Workspace bottom navigation visibility
    val showBottomNav = currentRoute in listOf("phase1_home", "patterns", "profile")

    Scaffold(
        containerColor = DeepSleepTheme.colors.background,
        bottomBar = {
            if (showBottomNav) {
                BottomNavBar(
                    currentRoute = currentRoute ?: "phase1_home",
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo("phase1_home") { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(navController = navController, startDestination = "process_home") {
                // PHASE 0: TOP-LEVEL
                composable("process_home") {
                    ProcessHomeScreen(
                        viewModel = processViewModel,
                        onNavigateSettings = { navController.navigate("settings") },
                        onNavigateProfile = { navController.navigate("profile") },
                        onNavigatePhase1 = { navController.navigate("phase1_entry") },
                        onNavigatePhase2 = { navController.navigate("phase2_entry") },
                        onNavigatePhase3 = { navController.navigate("phase3_home") }
                    )
                }

                composable("settings") {
                     SettingsScreen(
                         viewModel = controlViewModel,
                         onNavigateBack = { navController.popBackStack() }
                     )
                }

                // PHASE 1: ENTRY & WORKSPACE
                composable("phase1_entry") {
                     val hasData = true // TODO: Pass real hasData derived from DB
                     Phase1EntryScreen(
                         onNavigateBack = { navController.popBackStack() },
                         onNavigateTonight = { navController.navigate("tonight") },
                         onNavigateWorkspace = { navController.navigate("phase1_home") },
                         hasData = hasData
                     )
                }

                composable("phase1_home") {
                    HomeScreen(
                        viewModel = homeViewModel,
                        onNavigateTonight = { navController.navigate("tonight") },
                        onNavigateInsight = { navController.navigate("insight") }
                    )
                }

                composable("tonight") {
                    TonightScreen(
                        viewModel = tonightViewModel,
                        onNavigateBack = { navController.popBackStack() },
                        onMorningReviewReady = {
                            navController.navigate("process_home") {
                                popUpTo("process_home") { inclusive = true }
                            }
                        }
                    )
                }
                
                composable("insight") {
                    InsightDetailScreen(
                        viewModel = insightViewModel,
                        onNavigateBack = { navController.popBackStack() }
                    )
                }
                
                composable("patterns") {
                     PatternsScreen(viewModel = patternsViewModel)
                }
                
                composable("profile") {
                     ProfileScreen(viewModel = profileViewModel)
                }

                // PHASE 2 & 3
                composable("phase2_entry") {
                     Phase2EntryScreen(
                         onNavigateBack = { navController.popBackStack() },
                         onModeSelected = { mode -> 
                             phase2ViewModel.startQuestions(mode)
                             navController.navigate("phase2_questions") 
                         }
                     )
                }
                
                composable("phase2_questions") {
                     Phase2QuestionsScreen(viewModel = phase2ViewModel)
                     
                     val state by phase2ViewModel.uiState.collectAsState()
                     if (state.isFinished && !state.generatingProposals) {
                         // Navigation side-effect
                         LaunchedEffect(Unit) {
                             navController.navigate("phase2_proposals") {
                                 popUpTo("phase2_questions") { inclusive = true }
                             }
                         }
                     }
                }
                
                composable("phase2_proposals") {
                     Phase2ProposalsScreen(
                         viewModel = phase2ViewModel,
                         onNavigateBack = { navController.popBackStack() },
                         onAcceptProposals = { 
                             navController.navigate("phase3_home") {
                                 popUpTo("process_home") { inclusive = false }
                             }
                         }
                     )
                }
                
                composable("phase3_home") {
                     Phase3Screen(
                         viewModel = phase3ViewModel,
                         onNavigateBack = { navController.popBackStack() }
                     )
                }
            }
        }
    }
}
