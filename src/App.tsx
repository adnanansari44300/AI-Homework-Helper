import React, { useState, useEffect, useRef } from "react";
import { 
  Smartphone, Wifi, Battery, Signal, Send, Camera, Sparkles, 
  Calculator, BookOpen, History as HistoryIcon, Star, User, 
  Folder, FileCode, Terminal, Download, Copy, RotateCcw, 
  Volume2, VolumeX, Plus, Check, Trash2, Flame, Award, 
  Trophy, Menu, ArrowLeft, CheckSquare, ChevronRight, Info, 
  X, Search, Languages, Settings, Sun, Moon, FileText, 
  Lightbulb, CheckCircle2, XCircle, Play, Mic, MicOff, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { KOTLIN_PROJECT_FILES } from "./kotlin_files";
import { SAMPLE_HOMEWORK_LIST, SampleHomework } from "./sample_homework";
import { 
  ScreenType, ActiveTool, UserProfile, HistoryItem, 
  Flashcard, StudyGoal, QuizQuestion, SUBJECT_OPTIONS, GRADE_LEVEL_OPTIONS 
} from "./types";

export default function App() {
  // ==========================================
  // Workspace States (Right Panel)
  // ==========================================
  const [selectedFile, setSelectedFile] = useState(KOTLIN_PROJECT_FILES[2]); // DatabaseAndEntities.kt by default
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<'editor' | 'instructions'>('editor');

  // ==========================================
  // Simulated Android States (Left Panel)
  // ==========================================
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [emulatorDarkMode, setEmulatorDarkMode] = useState(false);
  
  // Simulated Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: "Adnan Ansari",
    email: "adnanansari44300@gmail.com",
    gradeLevel: "Grade 9-10 (High School)",
    school: "Lincoln Science Academy",
    preferredLanguage: "English",
    xpPoints: 340,
    streakCount: 5,
    isPremium: false,
    avatarSeed: "student_1"
  });

  // Database / Local Caches (Loaded from localStorage if available)
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);

  // Tutor / Solver Inputs & Outputs
  const [toolMode, setToolMode] = useState<ActiveTool>('math');
  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solveOutput, setSolveOutput] = useState<string | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  
  // Voice Synthesis State
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Quiz States
  const [quizTopic, setQuizTopic] = useState("Mathematics");
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizState, setQuizState] = useState<'loading' | 'active' | 'completed' | 'error'>('loading');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answersSubmitted, setAnswersSubmitted] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // History & Flashcard Custom Adders
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);
  const [fcFront, setFcFront] = useState("");
  const [fcBack, setFcBack] = useState("");
  const [fcSubject, setFcSubject] = useState("Mathematics");
  const [currentFlashIndex, setCurrentFlashIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Study Planner States
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalSubject, setGoalSubject] = useState("Mathematics");
  const [goalDays, setGoalDays] = useState("3");
  const [goalNotes, setGoalNotes] = useState("");

  // Search Filter States
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilterSubject, setHistoryFilterSubject] = useState("All");

  // Load and Save Caches
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const cachedHistory = localStorage.getItem("ai_hw_history");
    const cachedFlash = localStorage.getItem("ai_hw_flashcards");
    const cachedGoals = localStorage.getItem("ai_hw_goals");
    const cachedProfile = localStorage.getItem("ai_hw_profile");

    if (cachedHistory) setHistoryList(JSON.parse(cachedHistory));
    else {
      // Seed some default history items
      const seedHistory: HistoryItem[] = [
        {
          id: "seed_1",
          question: "Factor the quadratic equation: x^2 - 5x + 6 = 0",
          response: "### 📘 Quadratic Factoring\nTo solve $x^2 - 5x + 6 = 0$, we find two numbers that multiply to $6$ and add up to $-5$.\n- Those numbers are $-2$ and $-3$.\n\n### 🔢 Step-by-Step Factoring\n1. Rewriting the middle term: $x^2 - 2x - 3x + 6 = 0$\n2. Factoring by grouping:\n   $x(x - 2) - 3(x - 2) = 0$\n   $(x - 3)(x - 2) = 0$\n3. Equating each factor to zero:\n   $x - 3 = 0 \\implies x = 3$\n   $x - 2 = 0 \\implies x = 2$\n\n### 🎯 Roots\nThe roots of the equation are **x = 2** and **x = 3**.",
          subject: "Mathematics",
          timestamp: Date.now() - 3600000,
          isFavorite: true,
          toolMode: "math"
        },
        {
          id: "seed_2",
          question: "Why is water called a polar molecule?",
          response: "### 📘 Water Polarity\nWater ($H_2O$) is called polar because of the unequal distribution of charges inside the molecule.\n\n### 🔢 Core Concept\n- **Electronegativity**: Oxygen is highly electronegative compared to Hydrogen. It pulls the shared electrons closer to itself.\n- **Partial Charges**: This causes a partial negative charge ($\\\\delta^-$) near the oxygen atom and partial positive charges ($\\\\delta^+$) near the hydrogen atoms.\n\n### 💡 Key Tip\nThis polarity is why water is the 'universal solvent' and forms strong hydrogen bonds!",
          subject: "Chemistry",
          timestamp: Date.now() - 86400000,
          isFavorite: false,
          toolMode: "chat"
        }
      ];
      setHistoryList(seedHistory);
      localStorage.setItem("ai_hw_history", JSON.stringify(seedHistory));
    }

    if (cachedFlash) setFlashcards(JSON.parse(cachedFlash));
    else {
      const seedFlash: Flashcard[] = [
        { id: "fc_1", front: "Pythagorean Theorem", back: "a² + b² = c² (in a right-angled triangle, where c is the hypotenuse)", subject: "Mathematics", isLearned: false, isFavorite: true, createdAt: Date.now() },
        { id: "fc_2", front: "Newton's Second Law", back: "Force = Mass × Acceleration (F = ma)", subject: "Physics", isLearned: true, isFavorite: false, createdAt: Date.now() - 50000 },
        { id: "fc_3", front: "Mitosis Stages", back: "Prophase, Metaphase, Anaphase, Telophase (PMAT)", subject: "Biology", isLearned: false, isFavorite: false, createdAt: Date.now() - 100000 }
      ];
      setFlashcards(seedFlash);
      localStorage.setItem("ai_hw_flashcards", JSON.stringify(seedFlash));
    }

    if (cachedGoals) setGoals(JSON.parse(cachedGoals));
    else {
      const seedGoals: StudyGoal[] = [
        { id: "g_1", title: "Complete Calculus Homework", subject: "Mathematics", deadline: "In 2 days", isCompleted: false, notes: "Use the rate of change solver to cross-verify answers" },
        { id: "g_2", title: "Balance 10 chemistry reaction sheets", subject: "Chemistry", deadline: "Completed", isCompleted: true, notes: "Review stoichiometry tips" }
      ];
      setGoals(seedGoals);
      localStorage.setItem("ai_hw_goals", JSON.stringify(seedGoals));
    }

    if (cachedProfile) setProfile(JSON.parse(cachedProfile));
  }, []);

  // Sync to local storage on changes
  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ==========================================
  // Trigger Real-Time Gemini AI Solver Backend
  // ==========================================
  const handleSolveHomework = async () => {
    if (!inputText.trim() && !scannedImage) {
      setSolveError("Please enter a homework question or upload a photo scan first.");
      return;
    }

    setIsSolving(true);
    setSolveError(null);
    setSolveOutput(null);
    stopVoice();

    try {
      const response = await fetch("/api/ai/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: inputText,
          image: scannedImage,
          mimeType: scannedImage ? "image/jpeg" : undefined,
          subject: selectedSubject,
          classLevel: profile.gradeLevel,
          toolMode: toolMode,
          language: profile.preferredLanguage,
          tone: toolMode === "essay" ? "formal" : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to solve. Please make sure the Gemini API key is configured.");
      }

      const data = await response.json();
      setSolveOutput(data.text);
      
      // Award XP for solving!
      const earnedXp = scannedImage ? 40 : 25;
      const updatedProfile = { ...profile, xpPoints: profile.xpPoints + earnedXp };
      setProfile(updatedProfile);
      saveToLocal("ai_hw_profile", updatedProfile);

      // Save to History Cache
      const newHistoryItem: HistoryItem = {
        id: "h_" + Date.now(),
        question: inputText || (scannedImage ? `Uploaded Scanner Image (${selectedSubject})` : "Camera Scan"),
        response: data.text,
        subject: selectedSubject,
        timestamp: Date.now(),
        isFavorite: false,
        toolMode: toolMode,
        image: scannedImage || undefined
      };
      const updatedHistory = [newHistoryItem, ...historyList];
      setHistoryList(updatedHistory);
      saveToLocal("ai_hw_history", updatedHistory);

    } catch (err: any) {
      console.error(err);
      setSolveError(err.message || "Something went wrong. Please verify connection and Secrets panel.");
    } finally {
      setIsSolving(false);
    }
  };

  // ==========================================
  // Trigger Interactive Practice Quiz Backend
  // ==========================================
  const handleGenerateQuiz = async (subject: string, topicName?: string) => {
    setCurrentScreen('quiz');
    setQuizState('loading');
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    const targetTopic = topicName || `Core Concepts in ${subject}`;
    setQuizTopic(targetTopic);

    try {
      const response = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic,
          subject: subject,
          difficulty: quizDifficulty,
          questionCount: 4
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz from server.");
      }

      const data = await response.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
        setAnswersSubmitted(new Array(data.quiz.length).fill(false));
        setUserAnswers(new Array(data.quiz.length).fill(""));
        setQuizState('active');
      } else {
        throw new Error("Quiz empty, failed to parse structure.");
      }
    } catch (err: any) {
      console.error(err);
      setQuizState('error');
    }
  };

  // ==========================================
  // Text-To-Speech (TTS) Voice Explanations
  // ==========================================
  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopVoice();
      return;
    }

    if (!solveOutput) return;

    // Clean markdown characters for pleasant speech reading
    const speechText = solveOutput
      .replace(/[#*`$\-_]/g, "")
      .replace(/\\approx/g, "approximately equal to")
      .replace(/\\implies/g, "which implies that")
      .replace(/\\quad/g, " ");

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      setIsPlayingVoice(false);
    };

    utterance.onerror = () => {
      setIsPlayingVoice(false);
    };

    utteranceRef.current = utterance;
    setIsPlayingVoice(true);
    synthRef.current?.speak(utterance);
  };

  const stopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlayingVoice(false);
  };

  // ==========================================
  // Code Copy Utility
  // ==========================================
  const handleCopyCode = (text: string, fileName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // ==========================================
  // Android Project ZIP Downloader Call
  // ==========================================
  const handleDownloadAndroidProject = async () => {
    setDownloadingZip(true);
    try {
      window.location.href = "/api/download-android";
    } catch (err) {
      console.error(err);
      alert("Failed to queue android project zip download.");
    } finally {
      setTimeout(() => setDownloadingZip(false), 2000);
    }
  };

  // ==========================================
  // Quiz Interaction Handlers
  // ==========================================
  const handleSelectQuizAnswer = (option: string) => {
    if (answersSubmitted[currentQuizIndex]) return;
    setSelectedAnswer(option);
  };

  const handleSubmitQuizAnswer = () => {
    if (!selectedAnswer || answersSubmitted[currentQuizIndex]) return;

    const isCorrect = selectedAnswer.trim().toLowerCase() === quizQuestions[currentQuizIndex].correctAnswer.trim().toLowerCase();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Mark current question as submitted
    const nextSubmitted = [...answersSubmitted];
    nextSubmitted[currentQuizIndex] = true;
    setAnswersSubmitted(nextSubmitted);

    const nextUserAnswers = [...userAnswers];
    nextUserAnswers[currentQuizIndex] = selectedAnswer;
    setUserAnswers(nextUserAnswers);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz Completed! Award XP
      const xpEarned = score * 50;
      const updatedProfile = { 
        ...profile, 
        xpPoints: profile.xpPoints + xpEarned,
        streakCount: profile.streakCount + (score === quizQuestions.length ? 1 : 0)
      };
      setProfile(updatedProfile);
      saveToLocal("ai_hw_profile", updatedProfile);
      setQuizState('completed');
    }
  };

  // ==========================================
  // History & Caches Handlers
  // ==========================================
  const handleDeleteHistory = (id: string) => {
    const updated = historyList.filter(item => item.id !== id);
    setHistoryList(updated);
    saveToLocal("ai_hw_history", updated);
  };

  const handleToggleHistoryFavorite = (id: string) => {
    const updated = historyList.map(item => {
      if (item.id === id) return { ...item, isFavorite: !item.isFavorite };
      return item;
    });
    setHistoryList(updated);
    saveToLocal("ai_hw_history", updated);
  };

  const handleAddNewFlashcard = () => {
    if (!fcFront.trim() || !fcBack.trim()) return;
    const newCard: Flashcard = {
      id: "fc_" + Date.now(),
      front: fcFront,
      back: fcBack,
      subject: fcSubject,
      isLearned: false,
      isFavorite: false,
      createdAt: Date.now()
    };
    const updated = [newCard, ...flashcards];
    setFlashcards(updated);
    saveToLocal("ai_hw_flashcards", updated);

    // Clean inputs
    setFcFront("");
    setFcBack("");
    setShowAddFlashcard(false);
  };

  const handleToggleFlashLearned = (id: string) => {
    const updated = flashcards.map(c => {
      if (c.id === id) return { ...c, isLearned: !c.isLearned };
      return c;
    });
    setFlashcards(updated);
    saveToLocal("ai_hw_flashcards", updated);
  };

  const handleToggleFlashFavorite = (id: string) => {
    const updated = flashcards.map(c => {
      if (c.id === id) return { ...c, isFavorite: !c.isFavorite };
      return c;
    });
    setFlashcards(updated);
    saveToLocal("ai_hw_flashcards", updated);
  };

  const handleDeleteFlashcard = (id: string) => {
    const updated = flashcards.filter(c => c.id !== id);
    setFlashcards(updated);
    saveToLocal("ai_hw_flashcards", updated);
  };

  // Study Planner Goals Handlers
  const handleAddGoal = () => {
    if (!goalTitle.trim()) return;
    const newGoal: StudyGoal = {
      id: "g_" + Date.now(),
      title: goalTitle,
      subject: goalSubject,
      deadline: `In ${goalDays} days`,
      isCompleted: false,
      notes: goalNotes
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveToLocal("ai_hw_goals", updated);

    setGoalTitle("");
    setGoalNotes("");
    setShowAddGoal(false);
  };

  const handleToggleGoalCompleted = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const completedState = !g.isCompleted;
        // Award XP if completed!
        if (completedState) {
          const updatedProf = { ...profile, xpPoints: profile.xpPoints + 30 };
          setProfile(updatedProf);
          saveToLocal("ai_hw_profile", updatedProf);
        }
        return { ...g, isCompleted: completedState, deadline: completedState ? "Completed" : g.deadline };
      }
      return g;
    });
    setGoals(updated);
    saveToLocal("ai_hw_goals", updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    saveToLocal("ai_hw_goals", updated);
  };

  // Select preset homework sheet for camera/OCR mock scan
  const handleSelectPresetHomework = (hw: SampleHomework) => {
    setSelectedSubject(hw.subject);
    setInputText(hw.question);
    // Draw a simulated paper sheet canvas or load a nice preview
    setScannedImage(`https://images.unsplash.com/photo-1453733190148-c44698c265a8?w=500&auto=format&fit=crop`);
    setCurrentScreen('tutor');
    setToolMode('scanner');
  };

  // Filter history
  const filteredHistory = historyList.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(historySearch.toLowerCase()) || 
                          item.response.toLowerCase().includes(historySearch.toLowerCase());
    const matchesSubject = historyFilterSubject === "All" || item.subject === historyFilterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen w-full flex flex-col xl:flex-row bg-slate-50 text-slate-800 font-sans">
      
      {/* ======================================================================
          LEFT PANEL: THE INTERACTIVE ANDROID EMULATOR & PREVIEW SYSTEM
         ====================================================================== */}
      <div className="flex-1 lg:max-w-xl xl:max-w-[480px] mx-auto w-full p-6 flex flex-col justify-center items-center border-b xl:border-b-0 xl:border-r border-slate-200 bg-slate-100/30 shadow-xl shrink-0 z-10">
        
        {/* Device Container Frame (Styled to mimic flagship Pixel device) */}
        <div className={`relative w-full max-w-[390px] h-[780px] rounded-[48px] border-[12px] border-slate-900 shadow-2xl flex flex-col overflow-hidden select-none transition-colors duration-300 ${
          emulatorDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-slate-50 text-slate-900'
        }`}>
          
          {/* Top Notch Camera & Speaker Overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl flex justify-center items-center z-50">
            <div className="w-3 h-3 rounded-full bg-gray-800 mr-2"></div> {/* Lens */}
            <div className="w-12 h-1 bg-gray-700 rounded-full"></div> {/* Ear Speaker */}
          </div>

          {/* Android Device Status Bar */}
          <div className={`w-full h-8 pt-1 px-6 flex justify-between items-center text-xs font-semibold z-40 relative ${
            emulatorDarkMode ? 'bg-[#0f172a] text-gray-300' : 'bg-slate-50 text-slate-600'
          }`}>
            <span>09:24 AM</span>
            <div className="flex items-center gap-1">
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={12} className="rotate-90 origin-center" />
            </div>
          </div>

          {/* Core App Display Frame */}
          <div className="flex-1 overflow-y-auto relative flex flex-col pb-16">
            
            <AnimatePresence mode="wait">
              
              {/* SCREEN 1: LOGIN / WELCOME */}
              {currentScreen === 'login' && (
                <motion.div 
                  key="login-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 p-6 flex flex-col justify-center items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex justify-center items-center shadow-lg shadow-blue-500/30 mb-4">
                    <BookOpen size={36} />
                  </div>
                  
                  <h2 className="text-2xl font-bold font-display text-blue-600 dark:text-blue-400 mb-1">
                    AI Homework Helper
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-xs leading-relaxed">
                    Designed from Grade 1 through University. Learn and master concepts instead of copying!
                  </p>

                  <div className="w-full space-y-4 mb-6 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Student Name</label>
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Class Grade Level</label>
                      <select 
                        value={profile.gradeLevel} 
                        onChange={(e) => setProfile({ ...profile, gradeLevel: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {GRADE_LEVEL_OPTIONS.map((level, i) => (
                          <option key={i} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all text-sm mb-3"
                  >
                    Start Learning Session
                  </button>

                  <button 
                    onClick={() => {
                      setProfile({ ...profile, name: "Guest Student", isPremium: false });
                      setCurrentScreen('home');
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Continue as Guest
                  </button>
                </motion.div>
              )}

              {/* SCREEN 2: HOMEPAGE / DASHBOARD */}
              {currentScreen === 'home' && (
                <motion.div 
                  key="home-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 space-y-4"
                >
                  {/* Top Welcome Bar */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 block">Welcome Back</span>
                      <h3 className="text-lg font-bold font-display text-blue-600 dark:text-blue-400">
                        {profile.name} 👋
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleGenerateQuiz("Mathematics")}
                        className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:scale-105 transition-all"
                        title="Quick Quiz"
                      >
                        <Trophy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Streak & XP Gamification Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                    <div className="flex justify-between items-center border-b border-white/20 pb-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Flame size={18} className="text-amber-300 fill-amber-300 animate-pulse" />
                        <span className="text-sm font-semibold">{profile.streakCount} Day Streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={18} className="text-emerald-300" />
                        <span className="text-sm font-semibold">{profile.xpPoints} XP Points</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-blue-100">
                      <span>Level 3 (Scholar)</span>
                      <span>Next badge: 500 XP</span>
                    </div>
                    {/* XP Progress bar */}
                    <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(profile.xpPoints % 500) / 5}%` }}></div>
                    </div>
                  </div>

                  {/* Core Action Cards */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      Interactive AI Tools
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      
                      <button 
                        onClick={() => { setCurrentScreen('tutor'); setToolMode('math'); }}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-all text-left flex flex-col justify-between h-28"
                      >
                        <Calculator size={24} className="text-blue-600 dark:text-blue-400" />
                        <div>
                          <span className="text-xs font-bold block">Math Solver</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">Formulas & steps</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => { setCurrentScreen('tutor'); setToolMode('scanner'); }}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-all text-left flex flex-col justify-between h-28"
                      >
                        <Camera size={24} className="text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="text-xs font-bold block">OCR Scanner</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">Upload homework</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => { setCurrentScreen('tutor'); setToolMode('chat'); }}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-all text-left flex flex-col justify-between h-28"
                      >
                        <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400" />
                        <div>
                          <span className="text-xs font-bold block">Chat Tutor</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">Natural assistance</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => { setCurrentScreen('tutor'); setToolMode('quiz'); }}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-all text-left flex flex-col justify-between h-28"
                      >
                        <BookOpen size={24} className="text-purple-600 dark:text-purple-400" />
                        <div>
                          <span className="text-xs font-bold block">Practice Quiz</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">Test your skill</span>
                        </div>
                      </button>

                    </div>
                  </div>

                  {/* Daily Tip Card */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-3 border border-blue-100/30 flex gap-2">
                    <Lightbulb className="text-amber-500 shrink-0" size={18} />
                    <div>
                      <h5 className="text-xs font-bold text-blue-900 dark:text-blue-300">Daily Study Tip</h5>
                      <p className="text-[11px] text-blue-800/80 dark:text-blue-400/80 mt-0.5 leading-relaxed">
                        Never copy final equations! Breaking complex formulas into smaller steps strengthens memory pathways by 40%.
                      </p>
                    </div>
                  </div>

                  {/* Planner Goals */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        My Study Goals
                      </h4>
                      <button 
                        onClick={() => setShowAddGoal(true)}
                        className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-0.5 font-semibold hover:underline"
                      >
                        <Plus size={12} /> Add Goal
                      </button>
                    </div>

                    {showAddGoal && (
                      <div className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                        <input 
                          type="text" 
                          placeholder="Task (e.g. Study calculus review)" 
                          value={goalTitle}
                          onChange={(e) => setGoalTitle(e.target.value)}
                          className="w-full px-2 py-1.5 border dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-xs"
                        />
                        <div className="flex gap-2">
                          <select 
                            value={goalSubject}
                            onChange={(e) => setGoalSubject(e.target.value)}
                            className="flex-1 px-1 py-1.5 border dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-xs"
                          >
                            {SUBJECT_OPTIONS.map((sub, i) => (
                              <option key={i} value={sub}>{sub}</option>
                            ))}
                          </select>
                          <input 
                            type="number" 
                            placeholder="Days" 
                            value={goalDays}
                            onChange={(e) => setGoalDays(e.target.value)}
                            className="w-16 px-1 py-1.5 border dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-xs text-center"
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button onClick={() => setShowAddGoal(false)} className="px-2 py-1 text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded">Cancel</button>
                          <button onClick={handleAddNewFlashcard} className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded" onClickCapture={handleAddGoal}>Add</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {goals.map(goal => (
                        <div 
                          key={goal.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleToggleGoalCompleted(goal.id)}
                              className={`p-1 rounded-full border transition-colors ${
                                goal.isCompleted 
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-600' 
                                  : 'border-gray-300 dark:border-gray-600 text-transparent hover:text-gray-400'
                              }`}
                            >
                              <Check size={10} />
                            </button>
                            <div>
                              <span className={`font-semibold block ${goal.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                {goal.title}
                              </span>
                              <span className="text-[10px] text-gray-400 block">{goal.subject}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              goal.isCompleted ? 'bg-gray-100 text-gray-400 dark:bg-slate-700' : 'bg-red-50 text-red-500 dark:bg-red-950/20'
                            }`}>
                              {goal.deadline}
                            </span>
                            <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-400 hover:text-red-500">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* SCREEN 3: TUTOR EXPLANATIONS & SOLVERS */}
              {currentScreen === 'tutor' && (
                <motion.div 
                  key="tutor-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 flex flex-col h-full space-y-4"
                >
                  {/* Tutor Header */}
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                        <ArrowLeft size={16} />
                      </button>
                      <h3 className="text-sm font-bold font-display">Tutor Lab</h3>
                    </div>
                    <select 
                      value={selectedSubject} 
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200"
                    >
                      {SUBJECT_OPTIONS.map((sub, i) => (
                        <option key={i} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  {/* Horizontal Tool select bar */}
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                    {(['math', 'scanner', 'chat', 'essay', 'summary', 'translator'] as ActiveTool[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setToolMode(mode);
                          setSolveOutput(null);
                          setSolveError(null);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-full capitalize shrink-0 transition-all ${
                          toolMode === mode 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {mode === 'math' ? '🔢 math solver' : 
                         mode === 'scanner' ? '📸 image scan' : 
                         mode === 'chat' ? '💬 tutor chat' : 
                         mode === 'essay' ? '✍️ essay helper' : 
                         mode === 'summary' ? '📝 summarizer' : '🌐 translator'}
                      </button>
                    ))}
                  </div>

                  {/* Camera Viewfinder Mock / Photo Uploader */}
                  {toolMode === 'scanner' && (
                    <div className="space-y-2">
                      <div className="h-32 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 relative overflow-hidden flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-800/40 text-center px-4">
                        {scannedImage ? (
                          <>
                            <img src={scannedImage} alt="Scanned paper" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
                              <button 
                                onClick={() => setScannedImage(null)}
                                className="p-2 rounded-full bg-red-600 text-white text-xs hover:scale-105 transition-all"
                              >
                                Remove Photo
                              </button>
                            </div>
                            {/* Simulated laser scan scanner bar */}
                            <div className="absolute left-0 right-0 h-1 bg-emerald-500/80 shadow-md shadow-emerald-400/50 animate-bounce top-2"></div>
                          </>
                        ) : (
                          <>
                            <Camera className="text-gray-400 mb-1" size={24} />
                            <span className="text-xs font-semibold block">Homework Scan Frame</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Drag & drop image, or select a sample problem below</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Problem Input Text Area */}
                  <div className="flex-1 min-h-[80px] flex flex-col">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        toolMode === 'math' ? "Enter your math problem (e.g., solve 3x + 15 = 45)..." :
                        toolMode === 'essay' ? "Paste the student essay draft to analyze & correct..." :
                        toolMode === 'summary' ? "Paste notes, paragraphs or paragraphs here to summarize..." :
                        toolMode === 'translator' ? "Enter text you want translated..." :
                        "Ask anything you are struggling to understand..."
                      }
                      className="w-full flex-1 p-3 text-xs rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none text-slate-700 dark:text-gray-200"
                    />
                  </div>

                  {/* Actions / Trigger Solve */}
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSolveHomework}
                      disabled={isSolving}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex justify-center items-center gap-1.5"
                    >
                      {isSolving ? (
                        <>
                          <RotateCcw className="animate-spin" size={12} />
                          <span>Gemini explaining...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          <span>Explain Concept</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Outputs / Explanations Panel */}
                  <div className="flex-1 overflow-y-auto max-h-[300px] border-t dark:border-slate-800/80 pt-3">
                    {solveError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 text-xs flex gap-2 border border-red-100 dark:border-red-900/30">
                        <AlertCircle className="shrink-0" size={14} />
                        <span>{solveError}</span>
                      </div>
                    )}

                    {solveOutput && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/60 p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Step-by-Step Explanation</span>
                          <button 
                            onClick={handleToggleVoice}
                            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                              isPlayingVoice 
                                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-600 dark:text-amber-400' 
                                : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100'
                            }`}
                            title="Speak Response"
                          >
                            {isPlayingVoice ? <VolumeX size={12} /> : <Volume2 size={12} />}
                            <span className="text-[9px] font-bold">{isPlayingVoice ? "Stop" : "Listen"}</span>
                          </button>
                        </div>
                        <div className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed space-y-2 whitespace-pre-line bg-white dark:bg-slate-900/40 p-3 rounded-xl border dark:border-slate-800">
                          {/* Parse very simple markdown styles inside output */}
                          {solveOutput.split('\n').map((line, i) => {
                            if (line.startsWith('###') || line.startsWith('📘') || line.startsWith('🔢') || line.startsWith('🎯') || line.startsWith('⚠️') || line.startsWith('💡')) {
                              return <h4 key={i} className="font-bold text-blue-600 dark:text-blue-400 mt-2 mb-1 text-xs">{line.replace(/###\s*/, '')}</h4>;
                            }
                            return <p key={i} className="text-[11px] leading-relaxed">{line}</p>;
                          })}
                        </div>
                      </div>
                    )}

                    {!solveOutput && !isSolving && !solveError && (
                      <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-[11px]">
                        <BookOpen size={24} className="mx-auto mb-1.5 opacity-40 text-blue-500" />
                        <span>No solution active. Tap "Explain Concept" to consult the AI Chat Tutor.</span>
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {/* SCREEN 4: PRACTICE QUIZZES */}
              {currentScreen === 'quiz' && (
                <motion.div 
                  key="quiz-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 flex flex-col h-full space-y-4"
                >
                  <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-2">
                    <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <h3 className="text-sm font-bold font-display">Practice Quiz</h3>
                      <span className="text-[10px] text-gray-400 block">{quizTopic}</span>
                    </div>
                  </div>

                  {quizState === 'loading' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center py-12">
                      <RotateCcw className="animate-spin text-blue-600 mb-2" size={32} />
                      <span className="text-xs font-semibold">Gemini composing quiz sheets...</span>
                      <span className="text-[10px] text-gray-400 mt-1 max-w-xs">Configuring questions, options, and explanations</span>
                    </div>
                  )}

                  {quizState === 'error' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center py-12">
                      <AlertCircle className="text-red-500 mb-2" size={32} />
                      <span className="text-xs font-semibold text-red-500">Failed to construct practice quiz</span>
                      <button 
                        onClick={() => handleGenerateQuiz(selectedSubject)}
                        className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {quizState === 'active' && quizQuestions.length > 0 && (
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Question {currentQuizIndex + 1} of {quizQuestions.length}</span>
                          <span>Score: {score}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100/30 text-xs font-semibold">
                        {quizQuestions[currentQuizIndex].questionText}
                      </div>

                      {/* Options */}
                      <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[180px]">
                        {quizQuestions[currentQuizIndex].options.map((option, i) => {
                          const isSelected = selectedAnswer === option;
                          const isSubmitted = answersSubmitted[currentQuizIndex];
                          const isCorrectChoice = option.trim().toLowerCase() === quizQuestions[currentQuizIndex].correctAnswer.trim().toLowerCase();
                          const isUserChoice = userAnswers[currentQuizIndex] === option;

                          let btnStyle = "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800";
                          if (isSelected && !isSubmitted) {
                            btnStyle = "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400";
                          }
                          if (isSubmitted) {
                            if (isCorrectChoice) {
                              btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400";
                            } else if (isUserChoice) {
                              btnStyle = "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 dark:text-red-400";
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={isSubmitted}
                              onClick={() => handleSelectQuizAnswer(option)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{option}</span>
                              {isSubmitted && isCorrectChoice && <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />}
                              {isSubmitted && isUserChoice && !isCorrectChoice && <XCircle size={12} className="text-red-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Solution Feedback Area */}
                      {answersSubmitted[currentQuizIndex] && (
                        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-[10px] leading-relaxed border dark:border-slate-700 max-h-[100px] overflow-y-auto">
                          <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">Tutor Explanation:</span>
                          {quizQuestions[currentQuizIndex].explanation}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2">
                        {!answersSubmitted[currentQuizIndex] ? (
                          <button
                            disabled={!selectedAnswer}
                            onClick={handleSubmitQuizAnswer}
                            className="w-full py-2 bg-blue-600 disabled:bg-blue-400 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuizQuestion}
                            className="w-full py-2 bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 rounded-xl text-xs font-bold"
                          >
                            {currentQuizIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                          </button>
                        )}
                      </div>

                    </div>
                  )}

                  {quizState === 'completed' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-8">
                      <Trophy className="text-amber-500 w-16 h-16 animate-bounce" />
                      <div>
                        <h4 className="text-lg font-bold font-display">Quiz Complete!</h4>
                        <span className="text-xs text-gray-400">You scored {score} out of {quizQuestions.length}</span>
                      </div>
                      
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/30 rounded-2xl w-full">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">Rewards Earned:</span>
                        <span className="text-xs font-bold text-emerald-500">+{score * 50} XP Points!</span>
                      </div>

                      <button 
                        onClick={() => setCurrentScreen('home')}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  )}

                </motion.div>
              )}

              {/* SCREEN 5: STUDY HISTORY LIST */}
              {currentScreen === 'history' && (
                <motion.div 
                  key="history-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 flex flex-col h-full space-y-3"
                >
                  <div>
                    <h3 className="text-sm font-bold font-display">Study History</h3>
                    <span className="text-[10px] text-gray-400 block">Review your offline cached explanations and chats</span>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                      <input 
                        type="text" 
                        placeholder="Search history..." 
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-1 overflow-x-auto pb-1">
                      {["All", "Mathematics", "Physics", "Chemistry", "Biology", "English"].map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => setHistoryFilterSubject(sub)}
                          className={`px-2 py-1 rounded text-[9px] font-semibold shrink-0 ${
                            historyFilterSubject === sub 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* History List */}
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px]">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map(item => (
                        <div 
                          key={item.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800 text-xs space-y-1 relative group"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-[10px] uppercase text-blue-600 dark:text-blue-400">
                              {item.subject}
                            </span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleToggleHistoryFavorite(item.id)}
                                className={`text-gray-400 hover:text-amber-500 ${item.isFavorite ? 'text-amber-500' : ''}`}
                              >
                                <Star size={12} fill={item.isFavorite ? "currentColor" : "none"} />
                              </button>
                              <button 
                                onClick={() => handleDeleteHistory(item.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="font-semibold text-[11px] line-clamp-1">{item.question}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{item.response.replace(/[#*`$\-_]/g, "")}</p>
                          
                          <div className="flex justify-between items-center pt-1.5 border-t dark:border-slate-700/50 mt-1">
                            <span className="text-[9px] text-gray-400">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                            <button 
                              onClick={() => {
                                setSolveOutput(item.response);
                                setInputText(item.question);
                                setSelectedSubject(item.subject);
                                setToolMode(item.toolMode);
                                setCurrentScreen('tutor');
                              }}
                              className="text-[9px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                              Load Session &rarr;
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-400 text-xs">
                        <HistoryIcon className="mx-auto mb-1.5 opacity-40 text-blue-500" size={24} />
                        <span>No history matches found.</span>
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {/* SCREEN 6: FLASHCARDS CARD-BOX */}
              {currentScreen === 'saved' && (
                <motion.div 
                  key="saved-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 flex flex-col h-full space-y-4"
                >
                  <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-bold font-display">Flashcards study</h3>
                      <span className="text-[10px] text-gray-400 block">Flip, mark learned, or practice concepts</span>
                    </div>
                    <button 
                      onClick={() => setShowAddFlashcard(true)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-0.5"
                    >
                      <Plus size={10} /> Add Card
                    </button>
                  </div>

                  {showAddFlashcard && (
                    <div className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                      <input 
                        type="text" 
                        placeholder="Front Side (Concept / Word)" 
                        value={fcFront}
                        onChange={(e) => setFcFront(e.target.value)}
                        className="w-full px-2 py-1.5 border dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Back Side (Explanation / Answer)" 
                        value={fcBack}
                        onChange={(e) => setFcBack(e.target.value)}
                        className="w-full px-2 py-1.5 border dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-xs"
                      />
                      <select 
                        value={fcSubject}
                        onChange={(e) => setFcSubject(e.target.value)}
                        className="w-full px-2 py-1.5 border dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-xs"
                      >
                        {SUBJECT_OPTIONS.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                      </select>
                      <div className="flex gap-2 justify-end pt-1">
                        <button onClick={() => setShowAddFlashcard(false)} className="px-2 py-1 text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded">Cancel</button>
                        <button onClick={handleAddNewFlashcard} className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded">Add Card</button>
                      </div>
                    </div>
                  )}

                  {flashcards.length > 0 ? (
                    <div className="space-y-4">
                      {/* Interactive Flippable Card */}
                      <div 
                        onClick={() => setIsFlipped(!isFlipped)}
                        className={`h-48 w-full rounded-2xl cursor-pointer perspective-1000 transition-transform duration-500 transform-style-3d relative ${
                          isFlipped ? 'rotate-y-180 bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50'
                        }`}
                      >
                        <div className="absolute inset-0 p-6 flex flex-col justify-between items-center text-center backface-hidden">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                            {flashcards[currentFlashIndex].subject} (FRONT)
                          </span>
                          <p className="text-base font-bold font-display px-2">{flashcards[currentFlashIndex].front}</p>
                          <span className="text-[9px] text-gray-400">Click card to reveal concept</span>
                        </div>

                        <div className="absolute inset-0 p-6 flex flex-col justify-between items-center text-center rotate-y-180 backface-hidden">
                          <span className="text-[10px] font-bold text-blue-200 tracking-wider uppercase">
                            EXPLANATION (BACK)
                          </span>
                          <p className="text-xs leading-relaxed px-2">{flashcards[currentFlashIndex].back}</p>
                          <span className="text-[9px] text-blue-200">Click to flip front</span>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleToggleFlashLearned(flashcards[currentFlashIndex].id)}
                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                              flashcards[currentFlashIndex].isLearned 
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-600' 
                                : 'border-gray-200 text-gray-400'
                            }`}
                          >
                            {flashcards[currentFlashIndex].isLearned ? "Learned ✓" : "Mark Learned"}
                          </button>
                          <button 
                            onClick={() => handleToggleFlashFavorite(flashcards[currentFlashIndex].id)}
                            className="p-1 rounded border border-gray-200 text-gray-400 hover:text-amber-500"
                          >
                            <Star size={12} fill={flashcards[currentFlashIndex].isFavorite ? "#f59e0b" : "none"} className={flashcards[currentFlashIndex].isFavorite ? 'text-amber-500' : ''} />
                          </button>
                          <button 
                            onClick={() => handleDeleteFlashcard(flashcards[currentFlashIndex].id)}
                            className="p-1 rounded border border-gray-200 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button 
                            disabled={currentFlashIndex === 0}
                            onClick={() => { setCurrentFlashIndex(prev => prev - 1); setIsFlipped(false); }}
                            className="px-2 py-1 bg-gray-100 dark:bg-slate-800 disabled:opacity-40 rounded text-[10px] font-bold"
                          >
                            Prev
                          </button>
                          <span className="text-[10px] font-bold">{currentFlashIndex + 1}/{flashcards.length}</span>
                          <button 
                            disabled={currentFlashIndex === flashcards.length - 1}
                            onClick={() => { setCurrentFlashIndex(prev => prev + 1); setIsFlipped(false); }}
                            className="px-2 py-1 bg-gray-100 dark:bg-slate-800 disabled:opacity-40 rounded text-[10px] font-bold"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 text-xs">
                      <Star className="mx-auto mb-1.5 opacity-40 text-blue-500" size={24} />
                      <span>No flashcards saved. Add one above!</span>
                    </div>
                  )}

                </motion.div>
              )}

              {/* SCREEN 7: PROFILE & ACCOMPLISHMENTS */}
              {currentScreen === 'profile' && (
                <motion.div 
                  key="profile-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 space-y-4 overflow-y-auto max-h-full"
                >
                  <div className="text-center space-y-1">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex justify-center items-center mx-auto shadow-md">
                      <User size={32} />
                    </div>
                    <h3 className="text-sm font-bold font-display">{profile.name}</h3>
                    <span className="text-[10px] text-gray-400 block">{profile.email}</span>
                  </div>

                  {/* Profile Form Details */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b dark:border-slate-700/50">
                      <span className="text-gray-400">Grade level</span>
                      <span className="font-semibold">{profile.gradeLevel.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b dark:border-slate-700/50">
                      <span className="text-gray-400">School academy</span>
                      <span className="font-semibold">{profile.school}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b dark:border-slate-700/50">
                      <span className="text-gray-400">Language</span>
                      <span className="font-semibold capitalize">{profile.preferredLanguage}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b dark:border-slate-700/50">
                      <span className="text-gray-400">XP point</span>
                      <span className="font-semibold text-emerald-500">{profile.xpPoints} XP</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">AdMob Premium status</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                        profile.isPremium ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {profile.isPremium ? "Unlocked" : "Free Mode (Ads Enabled)"}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Mode */}
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs">
                      {emulatorDarkMode ? <Moon size={14} className="text-blue-400" /> : <Sun size={14} className="text-amber-500" />}
                      <span className="font-semibold">Emulator Dark Mode</span>
                    </div>
                    <button 
                      onClick={() => setEmulatorDarkMode(!emulatorDarkMode)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                        emulatorDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all shadow ${
                        emulatorDarkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>

                  {/* Pricing Package checkout trigger */}
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold">Upgrade to Premium</h4>
                        <p className="text-[9px] text-emerald-100 mt-0.5">Remove ads, unlock unlimited photos scans & priority AI response speed.</p>
                      </div>
                      <span className="text-xs font-extrabold">$2.99/mo</span>
                    </div>
                    <button 
                      onClick={() => setProfile({ ...profile, isPremium: !profile.isPremium })}
                      className="w-full py-1.5 bg-white text-emerald-600 rounded-xl text-[10px] font-bold hover:bg-emerald-50 transition-all"
                    >
                      {profile.isPremium ? "Downgrade to Free plan" : "Subscribe via Play Store"}
                    </button>
                  </div>

                  <button 
                    onClick={() => setCurrentScreen('login')}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-xs transition-all"
                  >
                    Logout Session
                  </button>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Android Device Native Navigation Bar (Bottom Tab Row Overlay) */}
          {currentScreen !== 'login' && (
            <div className={`absolute bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-2 z-40 ${
              emulatorDarkMode ? 'bg-[#0f172a] border-slate-800 text-gray-400' : 'bg-white border-gray-100 text-gray-500'
            }`}>
              <button 
                onClick={() => { setCurrentScreen('home'); stopVoice(); }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'home' ? 'text-blue-600 dark:text-blue-400' : ''}`}
              >
                <Smartphone size={18} />
                <span className="text-[9px] font-semibold">Home</span>
              </button>

              <button 
                onClick={() => { setCurrentScreen('tutor'); stopVoice(); }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'tutor' ? 'text-blue-600 dark:text-blue-400' : ''}`}
              >
                <BookOpen size={18} />
                <span className="text-[9px] font-semibold">AI Tutor</span>
              </button>

              <button 
                onClick={() => { setCurrentScreen('history'); stopVoice(); }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'history' ? 'text-blue-600 dark:text-blue-400' : ''}`}
              >
                <HistoryIcon size={18} />
                <span className="text-[9px] font-semibold">History</span>
              </button>

              <button 
                onClick={() => { setCurrentScreen('saved'); stopVoice(); }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'saved' ? 'text-blue-600 dark:text-blue-400' : ''}`}
              >
                <Star size={18} />
                <span className="text-[9px] font-semibold">Saved</span>
              </button>

              <button 
                onClick={() => { setCurrentScreen('profile'); stopVoice(); }}
                className={`flex flex-col items-center gap-0.5 ${currentScreen === 'profile' ? 'text-blue-600 dark:text-blue-400' : ''}`}
              >
                <User size={18} />
                <span className="text-[9px] font-semibold">Profile</span>
              </button>
            </div>
          )}

        </div>

        {/* Dynamic selector helper */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-gray-400">
            💡 Tap the tabs inside the phone to use real-time AI Homework Solvers.
          </span>
        </div>

      </div>

      {/* ======================================================================
          RIGHT PANEL: THE ANDROID STUDIO DEVELOPER WORKSPACE & EXPORTER
         ====================================================================== */}
      <div className="flex-1 p-6 flex flex-col min-w-0 bg-slate-50 z-0">
        
        {/* Workspace Top Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-extrabold tracking-wider uppercase border border-emerald-200/80">
                Play Store Ready
              </span>
              <span className="text-slate-500 text-xs font-medium">Target Platform: Android API 29+</span>
            </div>
            <h1 className="text-2xl font-black font-display text-slate-900 mt-1">
              AI Homework Helper Source Package
            </h1>
          </div>

          <div className="flex gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={handleDownloadAndroidProject}
              disabled={downloadingZip}
              className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Download size={14} className={downloadingZip ? 'animate-bounce' : ''} />
              <span>{downloadingZip ? 'Compiling ZIP package...' : 'Download Android Studio (.zip)'}</span>
            </button>
          </div>
        </div>

        {/* Tabs to toggle Workspace Viewer */}
        <div className="flex border-b border-slate-200 mb-4">
          <button
            onClick={() => setWorkspaceTab('editor')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              workspaceTab === 'editor' 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal size={14} />
            <span>Android Studio File Editor</span>
          </button>
          <button
            onClick={() => setWorkspaceTab('instructions')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              workspaceTab === 'instructions' 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info size={14} />
            <span>Setup & Gradle Instructions</span>
          </button>
        </div>

        {workspaceTab === 'editor' ? (
          <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-[500px]">
            
            {/* Kotlin File Explorer Navigation Tree */}
            <div className="w-full lg:w-56 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col space-y-4 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Project Workspace
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold mb-1">
                  <Folder size={14} className="text-amber-500 fill-amber-500" />
                  <span>AI_Homework_Helper/</span>
                </div>
              </div>

              {/* Browseable File Items */}
              <div className="space-y-1 overflow-y-auto flex-1 max-h-[400px] lg:max-h-none">
                {KOTLIN_PROJECT_FILES.map((file, i) => {
                  const isSelected = selectedFile.name === file.name;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode size={13} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <ChevronRight size={10} className="text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Syntax Editor Display */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-blue-600" />
                  <span className="text-xs text-slate-700 font-mono font-semibold">{selectedFile.path}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(selectedFile.content, selectedFile.name)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Copy size={12} />
                  <span>{copiedFile === selectedFile.name ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Raw syntax view with numbers */}
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-900 leading-relaxed">
                <pre className="grid grid-cols-[30px_1fr] gap-4">
                  <span className="text-slate-500 text-right select-none pr-2 border-r border-slate-800 font-mono">
                    {selectedFile.content.split('\n').map((_, i) => `${i + 1}`).join('\n')}
                  </span>
                  <code className="text-slate-100 font-mono text-xs whitespace-pre select-all">
                    {selectedFile.content}
                  </code>
                </pre>
              </div>
            </div>

          </div>
        ) : (
          /*Setup Guide & Readme tab */
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-6 overflow-y-auto leading-relaxed max-h-[580px] text-sm text-slate-800 shadow-sm markdown-body">
            <h3>🚀 Opening & Running the Project in Android Studio</h3>
            
            <p>We have pre-configured a clean <strong>Kotlin</strong> and <strong>Jetpack Compose</strong> codebase that adheres completely to modern industry specifications.</p>
            
            <h4>1. Unzip and Import</h4>
            <ul>
              <li>Click the <strong>Download Android Studio (.zip)</strong> button above to download the archive.</li>
              <li>Extract the archive on your local machine.</li>
              <li>Launch Android Studio (Iguana 2023.2.1 or newer recommended).</li>
              <li>Select <strong>File &gt; Open</strong>, navigate to the extracted directory, and click OK.</li>
            </ul>

            <h4>2. Gradle Sync & Dependencies</h4>
            <p>Upon opening, Android Studio will automatically identify the <code>build.gradle.kts</code> configurations and download the required packages, including:</p>
            <ul>
              <li><strong>Dagger Hilt:</strong> Enterprise dependency injection.</li>
              <li><strong>Room:</strong> SQLite ORM mapping for persistent database storage.</li>
              <li><strong>Retrofit & OkHttp:</strong> Secure, cached network connections.</li>
              <li><strong>Coil:</strong> Asynchronous, resource-efficient image loading.</li>
            </ul>

            <h4>3. Configuration & API Keys</h4>
            <p>Our client design proxies all AI requests through the local Express server backend. This is the optimal architecture because:</p>
            <ul>
              <li>It completely hides the sensitive <code>GEMINI_API_KEY</code> from the client application.</li>
              <li>It enables rapid fine-tuning of system instructions and temperature configs on the fly without republishing the app.</li>
            </ul>

            <h4>4. Running the App</h4>
            <p>Connect a physical Android device or launch an Android Virtual Device (AVD) emulator, and click the green <strong>Run</strong> button in the top toolbar of Android Studio!</p>
          </div>
        )}

        {/* Bottom Sample sheets to load directly */}
        <div className="mt-6 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-1.5">
            🚀 Sample Homework Sheets (Test Scanner Instantly)
          </h4>
          <p className="text-[11px] text-slate-500 mb-4">
            Click any of the prepopulated student sheets below. The emulator will automatically simulate scanning/OCR extraction of that homework using our server-side Gemini vision model!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SAMPLE_HOMEWORK_LIST.map((hw) => (
              <button
                key={hw.id}
                onClick={() => handleSelectPresetHomework(hw)}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-white text-left hover:shadow-md transition-all text-[11px] font-medium"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-extrabold text-blue-600 uppercase">{hw.subject}</span>
                </div>
                <span className="font-bold text-slate-800 block leading-tight truncate">{hw.title}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{hw.question}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
