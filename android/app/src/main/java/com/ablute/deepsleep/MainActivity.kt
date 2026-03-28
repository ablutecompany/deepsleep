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

class MainActivity : ComponentActivity() {
    // For Track 2 Vertical Slice, manual localized instancing for clarity.
    private val repository = FixtureNightAnalysisRepository()
    private val homeViewModel = HomeViewModel(repository)
    private val insightViewModel = InsightDetailViewModel(repository)
    private val tonightViewModel = TonightViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            DeepSleepTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DeepSleepTheme.colors.background
                ) {
                    DeepSleepApp(
                        homeViewModel = homeViewModel,
                        insightViewModel = insightViewModel,
                        tonightViewModel = tonightViewModel
                    )
                }
            }
        }
    }
}
