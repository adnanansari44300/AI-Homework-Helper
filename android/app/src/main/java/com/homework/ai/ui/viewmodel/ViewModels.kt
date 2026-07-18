package com.homework.ai.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.homework.ai.data.local.FlashcardEntity
import com.homework.ai.data.local.HistoryEntity
import com.homework.ai.data.local.HomeworkEntity
import com.homework.ai.data.local.StudyPlanEntity
import com.homework.ai.data.remote.QuizQuestion
import com.homework.ai.data.repository.HomeworkRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

// ==========================================
// AUTH & GAMIFICATION VIEWMODEL
// ==========================================

@HiltViewModel
class AuthViewModel @Inject constructor() : ViewModel() {
    private val _userState = MutableStateFlow<UserState>(UserState.Guest)
    val userState: StateFlow<UserState> = _userState.asStateFlow()

    fun login(email: String, name: String) {
        _userState.value = UserState.LoggedIn(
            name = name,
            email = email,
            grade = "Grade 10",
            school = "Lincoln High School",
            xp = 340,
            streak = 5,
            isPremium = false
        )
    }

    fun logout() {
        _userState.value = UserState.Guest
    }

    fun addXp(points: Int) {
        val current = _userState.value
        if (current is UserState.LoggedIn) {
            _userState.value = current.copy(xp = current.xp + points)
        }
    }

    fun togglePremium() {
        val current = _userState.value
        if (current is UserState.LoggedIn) {
            _userState.value = current.copy(isPremium = !current.isPremium)
        }
    }
}

sealed interface UserState {
    object Guest : UserState
    data class LoggedIn(
        val name: String,
        val email: String,
        val grade: String,
        val school: String,
        val xp: Int,
        val streak: Int,
        val isPremium: Boolean
    ) : UserState
}

// ==========================================
// HOMEWORK & AI SOLVER VIEWMODEL
// ==========================================

@HiltViewModel
class HomeworkViewModel @Inject constructor(
    private val repository: HomeworkRepository
) : ViewModel() {

    private val _solveState = MutableStateFlow<SolveState>(SolveState.Idle)
    val solveState: StateFlow<SolveState> = _solveState.asStateFlow()

    private val _historyList = MutableStateFlow<List<HistoryEntity>>(emptyList())
    val historyList: StateFlow<List<HistoryEntity>> = _historyList.asStateFlow()

    init {
        viewModelScope.launch {
            repository.historyFlow.collectLatest { list ->
                _historyList.value = list
            }
        }
    }

    fun solveProblem(
        question: String,
        image: String? = null,
        mimeType: String? = null,
        subject: String = "Mathematics",
        gradeLevel: String = "Grade 10",
        toolMode: String = "math",
        tone: String = "formal",
        language: String = "English"
    ) {
        viewModelScope.launch {
            _solveState.value = SolveState.Loading
            try {
                val responseText = repository.solveAndExplain(
                    question = question,
                    image = image,
                    mimeType = mimeType,
                    subject = subject,
                    gradeLevel = gradeLevel,
                    toolMode = toolMode,
                    tone = tone,
                    language = language
                )
                _solveState.value = SolveState.Success(responseText)
            } catch (e: Exception) {
                _solveState.value = SolveState.Error(e.message ?: "Network error. Please try again.")
            }
        }
    }

    fun clearSolveState() {
        _solveState.value = SolveState.Idle
    }

    fun toggleFavorite(id: Long, currentFav: Boolean) {
        viewModelScope.launch {
            repository.toggleFavoriteHistory(id, !currentFav)
        }
    }

    fun deleteHistoryItem(id: Long) {
        viewModelScope.launch {
            repository.deleteHistory(id)
        }
    }
}

sealed interface SolveState {
    object Idle : SolveState
    object Loading : SolveState
    data class Success(val response: String) : SolveState
    data class Error(val message: String) : SolveState
}

// ==========================================
// STUDY TOOLS (QUIZ & FLASHCARDS) VIEWMODEL
// ==========================================

@HiltViewModel
class StudyViewModel @Inject constructor(
    private val repository: HomeworkRepository
) : ViewModel() {

    private val _quizState = MutableStateFlow<QuizState>(QuizState.Idle)
    val quizState: StateFlow<QuizState> = _quizState.asStateFlow()

    private val _flashcardList = MutableStateFlow<List<FlashcardEntity>>(emptyList())
    val flashcardList: StateFlow<List<FlashcardEntity>> = _flashcardList.asStateFlow()

    private val _studyPlans = MutableStateFlow<List<StudyPlanEntity>>(emptyList())
    val studyPlans: StateFlow<List<StudyPlanEntity>> = _studyPlans.asStateFlow()

    init {
        viewModelScope.launch {
            repository.flashcardsFlow.collectLatest { list ->
                _flashcardList.value = list
            }
        }
        viewModelScope.launch {
            repository.studyPlansFlow.collectLatest { list ->
                _studyPlans.value = list
            }
        }
    }

    fun generateQuizForTopic(topic: String, subject: String, difficulty: String = "medium", count: Int = 4) {
        viewModelScope.launch {
            _quizState.value = QuizState.Loading
            try {
                val list = repository.generateQuiz(topic, subject, difficulty, count)
                _quizState.value = QuizState.Success(list)
            } catch (e: Exception) {
                _quizState.value = QuizState.Error(e.message ?: "Failed to generate quiz items.")
            }
        }
    }

    fun clearQuizState() {
        _quizState.value = QuizState.Idle
    }

    fun createFlashcard(front: String, back: String, subject: String) {
        viewModelScope.launch {
            repository.addFlashcard(front, back, subject)
        }
    }

    fun toggleFlashcardLearned(id: Long, learned: Boolean) {
        viewModelScope.launch {
            repository.toggleFlashcardLearned(id, learned)
        }
    }

    fun toggleFlashcardFavorite(id: Long, isFav: Boolean) {
        viewModelScope.launch {
            repository.toggleFlashcardFavorite(id, isFav)
        }
    }

    fun removeFlashcard(flashcard: FlashcardEntity) {
        viewModelScope.launch {
            repository.removeFlashcard(flashcard)
        }
    }

    fun addStudyGoal(title: String, daysOffset: Int, subject: String, notes: String) {
        viewModelScope.launch {
            val deadline = System.currentTimeMillis() + (daysOffset * 24 * 60 * 60 * 1000L)
            repository.addStudyPlan(title, deadline, subject, notes)
        }
    }

    fun toggleStudyGoalCompleted(id: Long, completed: Boolean) {
        viewModelScope.launch {
            repository.toggleStudyPlanCompleted(id, completed)
        }
    }

    fun deleteStudyGoal(id: Long) {
        viewModelScope.launch {
            repository.deleteStudyPlan(id)
        }
    }
}

sealed interface QuizState {
    object Idle : QuizState
    object Loading : QuizState
    data class Success(val questions: List<QuizQuestion>) : QuizState
    data class Error(val message: String) : QuizState
}
