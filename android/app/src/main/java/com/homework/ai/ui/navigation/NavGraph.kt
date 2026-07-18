package com.homework.ai.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.homework.ai.ui.screens.HistoryScreen
import com.homework.ai.ui.screens.HomeScreen
import com.homework.ai.ui.screens.HomeworkScreen
import com.homework.ai.ui.screens.LoginScreen
import com.homework.ai.ui.screens.ProfileScreen
import com.homework.ai.ui.screens.QuizScreen
import com.homework.ai.ui.screens.SavedScreen

sealed class Screen(val route: String, val title: String, val icon: ImageVector? = null) {
    object Login : Screen("login", "Login")
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Homework : Screen("homework", "Tutor", Icons.Default.MenuBook)
    object History : Screen("history", "History", Icons.Default.History)
    object Saved : Screen("saved", "Saved", Icons.Default.Star)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
    object Quiz : Screen("quiz", "Quiz")
}

@Composable
fun HomeworkNavGraph() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val bottomNavItems = listOf(
        Screen.Home,
        Screen.Homework,
        Screen.History,
        Screen.Saved,
        Screen.Profile
    )

    val showBottomBar = currentRoute in bottomNavItems.map { it.route }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    bottomNavItems.forEach { screen ->
                        NavigationBarItem(
                            icon = { Icon(screen.icon!!, contentDescription = screen.title) },
                            label = { Text(screen.title) },
                            selected = currentRoute == screen.route,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Login.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Login.route) {
                LoginScreen(
                    onLoginSuccess = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                )
            }
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToSolver = { mode ->
                        navController.navigate("${Screen.Homework.route}?mode=$mode")
                    },
                    onNavigateToQuiz = { topic ->
                        navController.navigate("${Screen.Quiz.route}?topic=$topic")
                    }
                )
            }
            composable("${Screen.Homework.route}?mode={mode}") { backStackEntry ->
                val mode = backStackEntry.arguments?.getString("mode") ?: "chat"
                HomeworkScreen(initialMode = mode)
            }
            composable(Screen.History.route) {
                HistoryScreen()
            }
            composable(Screen.Saved.route) {
                SavedScreen()
            }
            composable(Screen.Profile.route) {
                ProfileScreen(
                    onLogout = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Home.route) { inclusive = true }
                        }
                    }
                )
            }
            composable("${Screen.Quiz.route}?topic={topic}") { backStackEntry ->
                val topic = backStackEntry.arguments?.getString("topic") ?: "Mathematics"
                QuizScreen(
                    topic = topic,
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}
