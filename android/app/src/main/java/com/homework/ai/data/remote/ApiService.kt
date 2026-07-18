package com.homework.ai.data.remote

import retrofit2.http.Body
import retrofit2.http.POST

// ==========================================
// NETWORK DATA MODELS
// ==========================================

data class SolveRequest(
    val question: String,
    val image: String? = null,        // Base64 image string for scanner
    val mimeType: String? = null,     // image/png or image/jpeg
    val subject: String? = null,
    val classLevel: String? = null,
    val toolMode: String? = null,     // math, chat, scanner, essay, summary, translator, quiz
    val tone: String? = null,         // formal, casual, etc.
    val language: String? = null
)

data class SolveResponse(
    val text: String
)

data class QuizRequest(
    val topic: String,
    val subject: String? = null,
    val difficulty: String? = null,   // easy, medium, hard
    val questionCount: Int? = null
)

data class QuizQuestion(
    val id: Int,
    val type: String,                 // mcq, boolean, blank
    val questionText: String,
    val options: List<String>,
    val correctAnswer: String,
    val explanation: String
)

data class QuizResponse(
    val quiz: List<QuizQuestion>
)

// ==========================================
// RETROFIT API SERVICE
// ==========================================

interface HomeworkApiService {

    @POST("api/ai/solve")
    suspend fun solveHomework(
        @Body request: SolveRequest
    ): SolveResponse

    @POST("api/ai/quiz")
    suspend fun generateQuiz(
        @Body request: QuizRequest
    ): QuizResponse
}
