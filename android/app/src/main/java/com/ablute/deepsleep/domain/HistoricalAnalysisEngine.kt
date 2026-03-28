package com.ablute.deepsleep.domain

import com.ablute.deepsleep.data.local.SessionDao
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

enum class TrendState { INSUFFICIENT, EMERGING, CONSOLIDATED }

// Estrutura Estrita Semântica sem PT-PT cravado nas regras da Root API
data class TraitConfidence(
    val traitKey: String, 
    val strength: TrendState, 
    val descriptionKey: String // Para ser mapeado em PT-PT no ProfileViewModel
)

class HistoricalAnalysisEngine(private val sessionDao: SessionDao) {
    
    // Tiers restritos definidos no produto Core
    private val EMERGING_THRESHOLD = 3
    private val CONSOLIDATED_THRESHOLD = 7
    
    suspend fun evaluateProfileTraits(): List<TraitConfidence> = withContext(Dispatchers.IO) {
        val validSessions = sessionDao.getValidSessionsSync()
        val count = validSessions.size
        
        if (count < EMERGING_THRESHOLD) {
             return@withContext emptyList() // INSUFFICIENT
        }
        
        val strength = if (count >= CONSOLIDATED_THRESHOLD) TrendState.CONSOLIDATED else TrendState.EMERGING
        val traits = mutableListOf<TraitConfidence>()
        
        // Digital Friction Trait Logic
        val frictionCount = validSessions.count { it.primaryImpactKey == "IMPACT_DIGITAL_FRICTION" }
        if (frictionCount > validSessions.size / 2) {
             traits.add(TraitConfidence("SENSITIVITY_TO_DIGITAL", strength, "PROFILE_DESC_DIGITAL_FRICTION"))
        }

        // Accustic Interference Trait Logic
        val noiseCount = validSessions.count { it.primaryImpactKey == "IMPACT_NOISE_DISRUPTION" }
        if (noiseCount > validSessions.size / 3) {
             traits.add(TraitConfidence("SENSITIVITY_TO_NOISE", strength, "PROFILE_DESC_NOISE_SENSITIVE"))
        }
        
        return@withContext traits
    }

    suspend fun getValidSessionCount(): Int = withContext(Dispatchers.IO) {
        sessionDao.getValidSessionsCount()
    }
    
    suspend fun hasRecurringDigitalFriction(): Boolean = withContext(Dispatchers.IO) {
        val sessions = sessionDao.getValidSessionsSync().take(3)
        if (sessions.size < 2) return@withContext false
        return@withContext sessions.count { it.primaryImpactKey == "IMPACT_DIGITAL_FRICTION" } >= 2
    }
    
    suspend fun evaluateRecentPatternsState(): TrendState = withContext(Dispatchers.IO) {
        val count = sessionDao.getValidSessionsCount()
        return@withContext when {
            count < EMERGING_THRESHOLD -> TrendState.INSUFFICIENT
            count < CONSOLIDATED_THRESHOLD -> TrendState.EMERGING
            else -> TrendState.CONSOLIDATED
        }
    }
}
