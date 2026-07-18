package com.homework.ai.data.repository

import com.homework.ai.data.local.FlashcardEntity
import com.homework.ai.data.local.HistoryEntity
import com.homework.ai.data.local.HomeworkDao
import com.homework.ai.data.local.HomeworkEntity
import com.homework.ai.data.local.StudyPlanEntity
import com.homework.ai.data.remote.HomeworkApiService
import com.homework.ai.data.remote.QuizQuestion
import com.homework.ai.data.remote.SolveRequest
import com.homework.ai.data.remote.QuizRequest
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HomeworkRepository @Inject constructor(
    private val homeworkDao: HomeworkDao,
    private val apiService: HomeworkApiService
) {
    // Local DB Observables
    val allHomeworkFlow: Flow<List<HomeworkEntity>> = homeworkDao.getAllHomeworkFlow()
    val historyFlow: Flow<List<HistoryEntity>> = homeworkDao.getHistoryFlow()
    val flashcardsFlow: Flow<List<FlashcardEntity>> = homeworkDao.getFlashcardsFlow()
    val studyPlansFlow: Flow<List<StudyPlanEntity>> = homeworkDao.getStudyPlansFlow()

    // Remote AI Solvers
    suspend fun solveAndExplain(
        question: String,
        image: String? = null,
        mimeType: String? = null,
        subject: String? = null,
        gradeLevel: String? = null,
        toolMode: String? = null,
        tone: String? = null,
        language: String? = null
    ): String {
        // Send requests safely to our secure server-side model proxies
        val response = apiService.solveHomework(
            SolveRequest(
                question = question,
                image = image,
                mimeType = mimeType,
                subject = subject,
                classLevel = gradeLevel,
                toolMode = toolMode,
                tone = tone,
                language = language
            )
        )

        // Save search query and detailed answer in history cache for offline access
        val explanationText = response.text
        homeworkDao.insertHistory(
            HistoryEntity(
                question = question.ifBlank { "Scanned Question" },
                response = explanationText,
                subject = subject ?: "General Study",
                timestamp = System.currentTimeMillis()
            )
        )

        return explanationText
    }

    // Remote Interactive Quiz Generator
    suspend fun generateQuiz(
        topic: String,
        subject: String,
        difficulty: String,
        count: Int
    ): List<QuizQuestion> {
        val response = apiService.generateQuiz(
            QuizRequest(
                topic = topic,
                subject = subject,
                difficulty = difficulty,
                questionCount = count
            )
        )
        return response.quiz
    }

    // Local DB Operations
    suspend fun saveHomework(homework: HomeworkEntity): Long {
        return homeworkDao.insertHomework(homework)
    }

    suspend fun toggleFavoriteHistory(historyId: Long, isFavorite: Boolean) {
        homeworkDao.setHistoryFavorite(historyId, isFavorite)
    }

    suspend fun deleteHistory(id: Long) {
        homeworkDao.deleteHistoryItem(id)
    }

    suspend fun addFlashcard(front: String, back: String, subject: String) {
        homeworkDao.insertFlashcard(
            FlashcardEntity(
                frontSide = front,
                backSide = back,
                subject = subject,
                isLearned = false
            )
        )
    }

    suspend fun toggleFlashcardLearned(id: Long, isLearned: Boolean) {
        homeworkDao.setFlashcardLearned(id, isLearned)
    }

    suspend fun toggleFlashcardFavorite(id: Long, isFavorite: Boolean) {
        homeworkDao.setFlashcardFavorite(id, isFavorite)
    }

    suspend fun removeFlashcard(flashcard: FlashcardEntity) {
        homeworkDao.deleteFlashcard(flashcard)
    }

    suspend fun addStudyPlan(title: String, deadline: Long, subject: String, notes: String) {
        homeworkDao.insertStudyPlan(
            StudyPlanEntity(
                title = title,
                deadline = deadline,
                subject = subject,
                notes = notes,
                isCompleted = false
            )
        )
    }

    suspend fun toggleStudyPlanCompleted(id: Long, isCompleted: Boolean) {
        homeworkDao.setStudyPlanCompleted(id, isCompleted)
    }

    suspend fun deleteStudyPlan(id: Long) {
        homeworkDao.deleteStudyPlan(id)
    }
}
