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
import com.ablute.deepsleep.ui.tonight.TonightScreen
import com.ablute.deepsleep.ui.tonight.TonightViewModel
import com.ablute.deepsleep.ui.theme.DeepSleepTheme

@Composable
fun DeepSleepApp(
    homeViewModel: HomeViewModel,
    insightViewModel: InsightDetailViewModel,
    tonightViewModel: TonightViewModel
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "home"

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
                     // Compose empty native sub-routing
                }
                composable("profile") {
                     // Compose empty native sub-routing
                }
                composable("control") {
                     // Compose empty native sub-routing
                }
            }
        }
    }
}
