package com.ablute.deepsleep.data.local

import android.content.Context
import androidx.room.*
import com.ablute.deepsleep.domain.InputType
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "historical_sessions")
data class HistoricalSession(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val startTimeMs: Long,
    val endTimeMs: Long,
    val isValid: Boolean, // ex: rejeitada se faltar tempo de gravação (< 2 hrs)
    val missingInputsStr: String, // Capacidade restrita registada e armazenada permanentemente
    val primaryImpactKey: String?, // Nullable se degradado
    val nightStatusKey: String,
    val confidenceScore: Int,
    val primaryImpactEvidenceStr: String = "" // Package D - Extracted evidence Strings
)

fun HistoricalSession.getMissingInputs(): List<InputType> {
    if (missingInputsStr.isEmpty()) return emptyList()
    return missingInputsStr.split(",").mapNotNull { 
        try { InputType.valueOf(it) } catch (e: Exception) { null }
    }
}

@Dao
interface SessionDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: HistoricalSession)

    @Query("SELECT * FROM historical_sessions ORDER BY endTimeMs DESC")
    fun getAllSessions(): Flow<List<HistoricalSession>>

    @Query("SELECT * FROM historical_sessions WHERE isValid = 1 ORDER BY endTimeMs DESC")
    fun getValidSessionsSync(): List<HistoricalSession>
    
    @Query("SELECT COUNT(*) FROM historical_sessions WHERE isValid = 1")
    fun getValidSessionsCount(): Int

    @Query("SELECT COUNT(*) FROM historical_sessions")
    fun getAllSessionsCount(): Int

    @Query("DELETE FROM historical_sessions")
    suspend fun deleteAllSessions()
}

@Database(
    entities = [
        HistoricalSession::class,
        ProcessEntity::class,
        Phase2Responses::class,
        ProposalEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class DeepSleepDatabase : RoomDatabase() {
    abstract fun sessionDao(): SessionDao
    abstract fun processDao(): ProcessDao

    companion object {
        @Volatile
        private var INSTANCE: DeepSleepDatabase? = null

        fun getDatabase(context: Context): DeepSleepDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DeepSleepDatabase::class.java,
                    "deepsleep_historical_db"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
