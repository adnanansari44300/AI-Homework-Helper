# AI Homework Helper - Android Studio Project (Kotlin & Jetpack Compose)

This is a complete, production-ready, enterprise-grade Android application source package named **AI Homework Helper**. It is designed with modern Android best practices following **MVVM Architecture**, fully offline-first caching, Dagger-Hilt dependency injection, Retrofit networking, and Google Material Design 3.

---

## 🎯 Key Application Features

1. **AI Chat Tutor**: Multi-turn dialogue with continuous context awareness and step-by-step concept explanations.
2. **Math Solver**: Structured outputs showcasing original formulas, detailed derivation steps, tips, and common beginner traps.
3. **Homework Scanner (OCR)**: Integrates device camera to scan homework notes, extract mathematical equations, and read handwritten text.
4. **Interactive Quiz Generator**: Leverages Google Gemini to produce custom practice MCQs, True/False, and Flashcards with instant diagnostic analytics.
5. **Study Planner & Calendar**: Set homework deadlines, review alerts, track streaks, and earn gamification achievements (XP, Badges).
6. **Offline-First Caching**: Standard Room database structure to cache study history, flashcards, profiles, and plans for instant access when disconnected.

---

## 🏗️ Architecture Design (MVVM Pattern)

The codebase is strictly structured following clean architecture and **SOLID** principles:

- **UI Layer (Jetpack Compose)**: Built with native Google Material Design 3 components, rounded corners, soft shadows, responsive grids, and clean layout transitions.
- **ViewModel Layer (Jetoutines + Flow)**: Exposes reactive UI States through `StateFlow` to protect view bounds.
- **Repository Layer**: Bridges localized database queries (Room) and remote service requests (Retrofit).
- **Data Layer (Room + Retrofit + DataStore)**:
  - **Room Database**: Caches User Profiles, History Records, Saved Notes, Flashcards, and Study Plans.
  - **Retrofit Client**: Accesses safe server-side API proxies for model invocation (keeping secret API keys safe).
  - **Preferences DataStore**: Keeps client flags like Dark Mode preference, streak dates, and sound settings.

---

## 🚀 Step-by-Step Setup Instructions

To load, build, and deploy this project onto your physical device or emulator using **Android Studio**:

### 1. Prerequisites
- **Android Studio Iguana (2023.2.1)** or later.
- **Java SE Development Kit (JDK) 17** configured as the Gradle JDK.
- A physical Android device or emulator running **Android 10 (API Level 29)** or higher.

### 2. Import into Android Studio
1. Unzip the downloaded project folder.
2. Launch Android Studio, select **File > Open** (or **Import Project** on the splash screen).
3. Navigate to the unzipped project root and select the folder. Click **OK**.
4. Allow Android Studio to download dependencies and sync the Gradle files (usually takes 1-2 minutes).

### 3. Config server proxy or Secrets
- Set the API endpoint URL inside the Retrofit client definition (`ApiService.kt`) to point to your live hosted Cloud Run API or local development server.
- No client-side Gemini key insertion is required, guaranteeing absolute secret key security!

### 4. Build and Run
1. Connect your Android device via USB (make sure **USB Debugging** is toggled on in Developer Options), or start an AVD Emulator.
2. Click the green **Run (Play)** button in the top toolbar of Android Studio, or execute the following shell command inside the project root:
   ```bash
   ./gradlew installDebug
   ```

---

## 🛡️ Required App Permissions

Declared securely inside `AndroidManifest.xml` and handled via runtime permission requests:
- `android.permission.INTERNET` & `ACCESS_NETWORK_STATE`: For remote AI requests.
- `android.permission.CAMERA`: For taking homework images using the Homework Scanner.
- `android.permission.RECORD_AUDIO`: For continuous voice assistant chats.
- `com.android.vending.BILLING`: Support for Premium pricing packages.
