package com.homework.ai.data.local

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
import kotlinx.coroutines.flow.Flow

// ==========================================
// ROOM ENTITIES (Data Models)
// ==========================================

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val gradeLevel: String,
    val school: String,
    val preferredLanguage: String,
    val xpPoints: Int = 0,
    val streakCount: Int = 0,
    val isPremium: Boolean = false
)

@Entity(tableName = "homework")
data class HomeworkEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val questionText: String,
    val solutionExplanation: String,
    val subject: String,
    val gradeLevel: String,
    val timestamp: Long,
    val imageUrl: String? = null
)

@Entity(tableName = "history")
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val question: String,
    val response: String,
    val subject: String,
    val timestamp: Long,
    val isFavorite: Boolean = false
)

@Entity(tableName = "flashcards")
data class FlashcardEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val frontSide: String,
    val backSide: String,
    val subject: String,
    val isLearned: Boolean = false,
    val isFavorite: Boolean = false
)

@Entity(tableName = "study_plans")
data class StudyPlanEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val deadline: Long,
    val subject: String,
    val isCompleted: Boolean = false,
    val notes: String = ""
)

// ==========================================
// DATA ACCESS OBJECTS (DAOs)
// ==========================================

@Dao
interface HomeworkDao {
    @Query("SELECT * FROM homework ORDER BY timestamp DESC")
    fun getAllHomeworkFlow(): Flow<List<HomeworkEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHomework(homework: HomeworkEntity): Long

    @Query("SELECT * FROM history ORDER BY timestamp DESC")
    fun getHistoryFlow(): Flow<List<HistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistory(history: HistoryEntity): Long

    @Query("UPDATE history SET isFavorite = :isFav WHERE id = :id")
    suspend fun setHistoryFavorite(id: Long, isFav: Boolean)

    @Query("DELETE FROM history WHERE id = :id")
    suspend fun deleteHistoryItem(id: Long)

    @Query("SELECT * FROM flashcards ORDER BY id DESC")
    fun getFlashcardsFlow(): Flow<List<FlashcardEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFlashcard(flashcard: FlashcardEntity)

    @Query("UPDATE flashcards SET isLearned = :learned WHERE id = :id")
    suspend fun setFlashcardLearned(id: Long, learned: Boolean)

    @Query("UPDATE flashcards SET isFavorite = :isFav WHERE id = :id")
    suspend fun setFlashcardFavorite(id: Long, isFav: Boolean)

    @Delete
    suspend fun deleteFlashcard(flashcard: FlashcardEntity)

    @Query("SELECT * FROM study_plans ORDER BY deadline ASC")
    fun getStudyPlansFlow(): Flow<List<StudyPlanEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStudyPlan(plan: StudyPlanEntity)

    @Query("UPDATE study_plans SET isCompleted = :completed WHERE id = :id")
    suspend fun setStudyPlanCompleted(id: Long, completed: Boolean)

    @Query("DELETE FROM study_plans WHERE id = :id")
    suspend fun deleteStudyPlan(id: Long)
}

// ==========================================
// DATABASE INSTANCE
// ==========================================

@Database(
    entities = [
        UserEntity::class,
        HomeworkEntity::class,
        HistoryEntity::class,
        FlashcardEntity::class,
        StudyPlanEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class HomeworkDatabase : RoomDatabase() {
    abstract fun homeworkDao(): HomeworkDao
}
