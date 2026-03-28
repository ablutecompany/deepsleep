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
import com.ablute.deepsleep.ui.control.ControlScreen
import com.ablute.deepsleep.ui.control.ControlViewModel
import com.ablute.deepsleep.ui.onboarding.OnboardingScreen
import com.ablute.deepsleep.ui.onboarding.OnboardingViewModel

@Composable
fun DeepSleepApp(
    homeViewModel: HomeViewModel,
    insightViewModel: InsightDetailViewModel,
    tonightViewModel: TonightViewModel,
    patternsViewModel: PatternsViewModel,
    profileViewModel: ProfileViewModel,
    controlViewModel: ControlViewModel,
    onboardingViewModel: OnboardingViewModel,
    isOnboarded: Boolean
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    if (!isOnboarded) {
        OnboardingScreen(viewModel = onboardingViewModel, onComplete = {
            // DataStore state refresh automatically toggles isOnboarded
        })
        return
    }

    // The BottomNav is explicitly hidden in states where user is locked (Tonight/Insight/Setup)
    val showBottomNav = currentRoute in listOf("home", "patterns", "profile", "control")

    Scaffold(
        containerColor = DeepSleepTheme.colors.background,
        bottomBar = {
            if (showBottomNav) {
                BottomNavBar(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo("home") { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(navController = navController, startDestination = "home") {
                composable("home") {
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
                            navController.navigate("home") {
                                popUpTo("home") { inclusive = true }
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
                composable("control") {
                     ControlScreen(viewModel = controlViewModel)
                }
            }
        }
    }
}
