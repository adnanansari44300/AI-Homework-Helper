package com.homework.ai.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.homework.ai.data.local.FlashcardEntity
import com.homework.ai.data.local.HistoryEntity
import com.homework.ai.data.local.StudyPlanEntity
import com.homework.ai.ui.viewmodel.*

// ==========================================
// 1. LOGIN / AUTH SCREEN
// ==========================================
@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var classLevel by remember { mutableStateOf("Grade 10") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.MenuBook,
            contentDescription = "App Logo",
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(80.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "AI Homework Helper",
            style = MaterialTheme.typography.displayMedium,
            color = MaterialTheme.colorScheme.primary,
            textAlign = TextAlign.Center
        )
        Text(
            text = "Understand your homework, don't just copy it!",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f),
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Student Name") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = "Name") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email Address") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = "Email") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (name.isNotBlank() && email.isNotBlank()) {
                    onLoginSuccess()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Login & Start Learning", fontSize = 16.sp)
        }
        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onLoginSuccess) {
            Text("Enter as Guest Mode", color = MaterialTheme.colorScheme.secondary)
        }
    }
}

// ==========================================
// 2. DASHBOARD / HOME SCREEN
// ==========================================
@Composable
fun HomeScreen(
    onNavigateToSolver: (String) -> Unit,
    onNavigateToQuiz: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Header Card
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Hello, Student! 👋",
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Text(
                        text = "Ready to build deep understanding of math, science, and languages today?",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f),
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }
        }

        item {
            // Gamification Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Default.Bolt, contentDescription = "Streak", tint = Color(0xFFFBBF24))
                        Text("5 Days Streak", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                    }
                }
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Default.Star, contentDescription = "XP", tint = Color(0xFF10B981))
                        Text("340 XP Points", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }

        item {
            Text("Core AI Helpers", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }

        item {
            // AI Action Grid Row 1
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeActionCard(
                    title = "AI Chat Tutor",
                    desc = "Ask any questions and get step-by-step explanations.",
                    icon = Icons.Default.Chat,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateToSolver("chat") }
                )
                HomeActionCard(
                    title = "Math Solver",
                    desc = "Formulas, steps, common errors and tips.",
                    icon = Icons.Default.Functions,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateToSolver("math") }
                )
            }
        }

        item {
            // AI Action Grid Row 2
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeActionCard(
                    title = "Homework Scanner",
                    desc = "Upload photo of questions to do OCR and explain.",
                    icon = Icons.Default.CameraAlt,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateToSolver("scanner") }
                )
                HomeActionCard(
                    title = "Quiz Generator",
                    desc = "Interactive practice MCQs and flashcards.",
                    icon = Icons.Default.Quiz,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateToQuiz("Mathematics") }
                )
            }
        }

        item {
            // Study tips
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Lightbulb, contentDescription = "Tip", tint = Color(0xFFEAB308), modifier = Modifier.size(32.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Daily Learning Tip", fontWeight = FontWeight.Bold)
                        Text("Breaking down complex algebra formulas into separate logical steps boosts long-term comprehension by 40%!", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}

@Composable
fun HomeActionCard(
    title: String,
    desc: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(150.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxHeight(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Icon(icon, contentDescription = title, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(32.dp))
            Column {
                Text(title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyLarge)
                Text(desc, style = MaterialTheme.typography.bodySmall, maxLines = 2, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
            }
        }
    }
}

// ==========================================
// 3. TUTOR SOLVER SCREEN
// ==========================================
@Composable
fun HomeworkScreen(initialMode: String) {
    var questionText by remember { mutableStateOf("") }
    var selectedSubject by remember { mutableStateOf("Mathematics") }
    var selectedGrade by remember { mutableStateOf("Grade 10") }
    var activeMode by remember { mutableStateOf(initialMode) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("AI Homework Solver", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("Enter questions manually or upload photo scans.", style = MaterialTheme.typography.bodySmall)
        Spacer(modifier = Modifier.height(12.dp))

        // Tabs
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(
                onClick = { activeMode = "chat" },
                colors = ButtonDefaults.buttonColors(containerColor = if (activeMode == "chat") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.weight(1f)
            ) {
                Text("Tutor Chat", color = if (activeMode == "chat") Color.White else MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Button(
                onClick = { activeMode = "math" },
                colors = ButtonDefaults.buttonColors(containerColor = if (activeMode == "math") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.weight(1f)
            ) {
                Text("Math Solver", color = if (activeMode == "math") Color.White else MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Button(
                onClick = { activeMode = "scanner" },
                colors = ButtonDefaults.buttonColors(containerColor = if (activeMode == "scanner") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.weight(1f)
            ) {
                Text("Camera Scan", color = if (activeMode == "scanner") Color.White else MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = questionText,
            onValueChange = { questionText = it },
            label = { Text("Ask your homework question...") },
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { /* trigger AI */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Icon(Icons.Default.Send, contentDescription = "Send")
            Spacer(modifier = Modifier.width(8.dp))
            Text("Explain Step-by-Step")
        }
    }
}

// ==========================================
// 4. STUDY QUIZ SCREEN
// ==========================================
@Composable
fun QuizScreen(topic: String, onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("AI Practice Quiz", style = MaterialTheme.typography.titleLarge)
        Text("Topic: $topic", style = MaterialTheme.typography.bodyMedium)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onBack) {
            Text("Back to Dashboard")
        }
    }
}

// ==========================================
// 5. CACHED STUDY PLANNER & HISTORY SCREEN
// ==========================================
@Composable
fun HistoryScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Study History", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("Review your offline cached explanations and chats", style = MaterialTheme.typography.bodySmall)
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(listOf(
                HistoryEntity(1, "What is the Pythagorean Theorem?", "The theorem states that a² + b² = c² for a right-angled triangle, where c is the hypotenuse.", "Mathematics", System.currentTimeMillis()),
                HistoryEntity(2, "Explain Photosynthesis steps", "Photosynthesis is the process used by plants to convert light energy into chemical energy.", "Biology", System.currentTimeMillis() - 86400000)
            )) { item ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(item.question, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(item.response, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}

// ==========================================
// 6. FLASHCARDS SCREEN
// ==========================================
@Composable
fun SavedScreen() {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("My Saved Flashcards", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("FRONT SIDE", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Text("H₂O", style = MaterialTheme.typography.displayMedium)
                Spacer(modifier = Modifier.height(16.dp))
                Divider()
                Spacer(modifier = Modifier.height(16.dp))
                Text("TAP TO REVEAL CONCEPT", color = Color.Gray, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

// ==========================================
// 7. PROFILE & ACCOMPLISHMENTS SCREEN
// ==========================================
@Composable
fun ProfileScreen(onLogout: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(RoundedCornerShape(50.dp))
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Person, contentDescription = "Profile", modifier = Modifier.size(48.dp), tint = MaterialTheme.colorScheme.onPrimaryContainer)
        }
        Spacer(modifier = Modifier.height(16.dp))
        Text("Adnan Ansari", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("Grade 10 • Lincoln High School", style = MaterialTheme.typography.bodyMedium, color = Color.Gray)

        Spacer(modifier = Modifier.height(32.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Learning Goals", fontWeight = FontWeight.Bold)
                Text("• Master quadratic equations by Friday\n• Study chemistry periodic table\n• Get 500 XP streak", style = MaterialTheme.typography.bodyMedium)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onLogout,
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Logout Session")
        }
    }
}
