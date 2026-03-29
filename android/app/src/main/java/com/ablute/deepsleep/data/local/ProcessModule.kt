package com.ablute.deepsleep.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

// Tracks the overarching 3-phase process
@Entity(tableName = "processes")
data class ProcessEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val startDateMs: Long,
    val endDateMs: Long? = null,
    val status: String = "ACTIVE", // ACTIVE, COMPLETED, ABANDONED
    val phase1LogsCountAtStart: Int = 0, // snapshot of how many nights were tracked when process started
    val phase2Unlocked: Boolean = false,
    val phase3Unlocked: Boolean = false
)

// Stores answers to the Phase 2 Context Questions
@Entity(tableName = "phase2_responses")
data class Phase2Responses(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val processId: Long,
    val questionId: String,
    val answersJson: String // serialized list of answers
)

// Stores the 3 proposals generated at the end of Phase 2
@Entity(tableName = "proposals")
data class ProposalEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val processId: Long,
    val title: String,
    val hypothesis: String,
    val actionStr: String,
    val status: String = "ACTIVE" // ACTIVE, SUSPENDED, COMPLETED
)

@Dao
interface ProcessDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProcess(process: ProcessEntity): Long

    @Query("SELECT * FROM processes WHERE status = 'ACTIVE' LIMIT 1")
    fun getActiveProcess(): Flow<ProcessEntity?>

    @Query("SELECT * FROM processes WHERE status = 'ACTIVE' LIMIT 1")
    suspend fun getActiveProcessSync(): ProcessEntity?

    @Update
    suspend fun updateProcess(process: ProcessEntity)

    @Insert
    suspend fun insertResponses(responses: List<Phase2Responses>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProposals(proposals: List<ProposalEntity>)

    @Query("SELECT * FROM phase2_responses WHERE processId = :processId")
    suspend fun getResponses(processId: Long): List<Phase2Responses>

    @Query("SELECT * FROM proposals WHERE processId = :processId")
    fun getProposals(processId: Long): Flow<List<ProposalEntity>>
    
    @Update
    suspend fun updateProposal(proposal: ProposalEntity)
}
