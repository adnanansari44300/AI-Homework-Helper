import { KotlinFile } from './types';

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.homework.ai">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="com.android.vending.BILLING" />

    <application
        android:name=".HomeworkApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.AIHomeworkHelper">

        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713"/>

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    name: "app/build.gradle.kts",
    path: "app/build.gradle.kts",
    language: "kotlin",
    content: `plugins {
    id("com.android.application")
    id("kotlin-android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
}

android {
    namespace = "com.homework.ai"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.homework.ai"
        minSdk = 29
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.8" }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3:1.2.0")

    // Dagger Hilt (DI)
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-compiler:2.50")

    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    // Retrofit & OkHttp
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    // Coil Image Loading
    implementation("io.coil-kt:coil-compose:2.5.0")
}`
  },
  {
    name: "DatabaseAndEntities.kt",
    path: "app/src/main/java/com/homework/ai/data/local/DatabaseAndEntities.kt",
    language: "kotlin",
    content: `package com.homework.ai.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

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

@Dao
interface HomeworkDao {
    @Query("SELECT * FROM history ORDER BY timestamp DESC")
    fun getHistoryFlow(): Flow<List<HistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistory(history: HistoryEntity): Long

    @Query("SELECT * FROM flashcards ORDER BY id DESC")
    fun getFlashcardsFlow(): Flow<List<FlashcardEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFlashcard(flashcard: FlashcardEntity)
}

@Database(entities = [HistoryEntity::class, FlashcardEntity::class], version = 1)
abstract class HomeworkDatabase : RoomDatabase() {
    abstract fun homeworkDao(): HomeworkDao
}`
  },
  {
    name: "ApiService.kt",
    path: "app/src/main/java/com/homework/ai/data/remote/ApiService.kt",
    language: "kotlin",
    content: `package com.homework.ai.data.remote

import retrofit2.http.Body
import retrofit2.http.POST

data class SolveRequest(
    val question: String,
    val image: String? = null,
    val mimeType: String? = null,
    val subject: String? = null,
    val classLevel: String? = null,
    val toolMode: String? = null
)

data class SolveResponse(val text: String)

interface HomeworkApiService {
    @POST("api/ai/solve")
    suspend fun solveHomework(@Body request: SolveRequest): SolveResponse
}`
  },
  {
    name: "HomeworkRepository.kt",
    path: "app/src/main/java/com/homework/ai/data/repository/HomeworkRepository.kt",
    language: "kotlin",
    content: `package com.homework.ai.data.repository

import com.homework.ai.data.local.*
import com.homework.ai.data.remote.*
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HomeworkRepository @Inject constructor(
    private val homeworkDao: HomeworkDao,
    private val apiService: HomeworkApiService
) {
    val historyFlow: Flow<List<HistoryEntity>> = homeworkDao.getHistoryFlow()

    suspend fun solveAndExplain(question: String, subject: String, mode: String): String {
        val response = apiService.solveHomework(
            SolveRequest(question = question, subject = subject, toolMode = mode)
        )
        homeworkDao.insertHistory(
            HistoryEntity(
                question = question,
                response = response.text,
                subject = subject,
                timestamp = System.currentTimeMillis()
            )
        )
        return response.text
    }
}`
  },
  {
    name: "ViewModels.kt",
    path: "app/src/main/java/com/homework/ai/ui/viewmodel/ViewModels.kt",
    language: "kotlin",
    content: `package com.homework.ai.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.homework.ai.data.repository.HomeworkRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeworkViewModel @Inject constructor(
    private val repository: HomeworkRepository
) : ViewModel() {
    private val _solveState = MutableStateFlow<SolveState>(SolveState.Idle)
    val solveState: StateFlow<SolveState> = _solveState.asStateFlow()

    fun solveProblem(question: String, subject: String, mode: String) {
        viewModelScope.launch {
            _solveState.value = SolveState.Loading
            try {
                val ans = repository.solveAndExplain(question, subject, mode)
                _solveState.value = SolveState.Success(ans)
            } catch (e: Exception) {
                _solveState.value = SolveState.Error(e.message ?: "Network Error")
            }
        }
    }
}

sealed interface SolveState {
    object Idle : SolveState
    object Loading : SolveState
    data class Success(val response: String) : SolveState
    data class Error(val message: String) : SolveState
}`
  },
  {
    name: "Screens.kt",
    path: "app/src/main/java/com/homework/ai/ui/screens/Screens.kt",
    language: "kotlin",
    content: `package com.homework.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun HomeworkScreen() {
    var question by remember { mutableStateOf("") }
    
    Column(modifier = Modifier.padding(16.dp)) {
        Text("AI Homework Solver", style = MaterialTheme.typography.titleLarge)
        
        OutlinedTextField(
            value = question,
            onValueChange = { question = it },
            label = { Text("Ask your homework question...") },
            modifier = Modifier.fillMaxWidth().weight(1f)
        )
        
        Button(
            onClick = { /* call ViewModel solve */ },
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp)
        ) {
            Text("Explain Step-by-Step")
        }
    }
}`
  }
];
