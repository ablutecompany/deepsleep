package com.ablute.deepsleep.data

import com.ablute.deepsleep.data.local.ProcessDao
import com.ablute.deepsleep.data.local.ProcessEntity
import com.ablute.deepsleep.data.local.Phase2Responses
import com.ablute.deepsleep.data.local.ProposalEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProcessRepository(
    private val processDao: ProcessDao,
    private val sessionDao: com.ablute.deepsleep.data.local.SessionDao
) {
    // Current Active Process
    val activeProcessFlow: Flow<ProcessEntity?> = processDao.getActiveProcess()

    suspend fun getOrCreateActiveProcess(): ProcessEntity = withContext(Dispatchers.IO) {
        var process = processDao.getActiveProcessSync()
        if (process == null) {
            val sessionCount = sessionDao.getValidSessionsCount()
            process = ProcessEntity(
                startDateMs = System.currentTimeMillis(),
                phase1LogsCountAtStart = sessionCount,
                phase2Unlocked = false, // We'll compute this dynamically or lock it temporarily
                phase3Unlocked = false
            )
            val id = processDao.insertProcess(process)
            process = process.copy(id = id)
        }
        process
    }

    suspend fun checkPhaseUnlocks() = withContext(Dispatchers.IO) {
        val process = processDao.getActiveProcessSync() ?: return@withContext
        val sessionCount = sessionDao.getValidSessionsCount()

        // Phase 2 unlocks if the user has recorded at least 3 valid sessions overall
        var updated = false
        var updatedProcess = process

        if (!process.phase2Unlocked && sessionCount >= 3) {
            updatedProcess = updatedProcess.copy(phase2Unlocked = true)
            updated = true
        }

        // Phase 3 unlocks if we have proposals generated for this process
        if (!process.phase3Unlocked) {
            val proposals = processDao.getProposals(process.id).firstOrNull()
            if (!proposals.isNullOrEmpty()) {
                updatedProcess = updatedProcess.copy(phase3Unlocked = true)
                updated = true
            }
        }

        if (updated) {
            processDao.updateProcess(updatedProcess)
        }
    }

    suspend fun savePhase2Responses(responses: List<Phase2Responses>) = withContext(Dispatchers.IO) {
        processDao.insertResponses(responses)
    }

    suspend fun saveProposals(proposals: List<ProposalEntity>) = withContext(Dispatchers.IO) {
        processDao.insertProposals(proposals)
        checkPhaseUnlocks()
    }

    fun getProposals(processId: Long): Flow<List<ProposalEntity>> {
        return processDao.getProposals(processId)
    }

    suspend fun restartProcess() = withContext(Dispatchers.IO) {
        val active = processDao.getActiveProcessSync()
        if (active != null) {
            // Mark as abandoned
            processDao.updateProcess(active.copy(
                status = "ABANDONED",
                endDateMs = System.currentTimeMillis()
            ))
        }
        getOrCreateActiveProcess()
    }
}
