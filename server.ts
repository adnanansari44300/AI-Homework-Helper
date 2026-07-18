import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { exec } from "child_process";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limits for high-resolution homework photo uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Google Gemini API Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for checking if API Key is configured
const ensureApiKey = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in the Secrets panel.");
  }
};

// ==========================================
// AI homework solver / tutor api route
// ==========================================
app.post("/api/ai/solve", async (req, res) => {
  try {
    ensureApiKey();
    const { question, image, mimeType, subject, classLevel, toolMode, tone, language } = req.body;

    let systemInstruction = 
      "You are 'AI Homework Helper', an expert, supportive AI Chat Tutor designed for students from Grade 1 through university. " +
      "YOUR ABSOLUTE HIGHEST DIRECTIVE: Never just provide the final answer. You must focus on learning, not cheating. " +
      "Always explain the concepts step-by-step, show the detailed reasoning and methods, provide custom illustrative examples, " +
      "warn about common mistakes, and provide friendly learning tips. Encourage the student and guide them to understand the underlying theory.";

    if (subject) {
      systemInstruction += ` The subject is ${subject}.`;
    }
    if (classLevel) {
      systemInstruction += ` The student is at ${classLevel} level. Adapt your vocabulary, tone, and complexity accordingly.`;
    }
    if (language) {
      systemInstruction += ` Respond in ${language} language, keeping explanations clear and simple.`;
    }

    let prompt = "";
    if (toolMode === "math") {
      prompt = 
        `Solve and explain the following mathematics/science problem: "${question}".\n` +
        `Structure your response with clear sections:\n` +
        `1. 📘 Formula / Core Concept: Define the mathematical rule or science concept applied.\n` +
        `2. 🔢 Step-by-Step Method: Show each step of solving clearly, explaining the 'why' behind each step.\n` +
        `3. 🎯 Final Answer: State the final calculated result clearly.\n` +
        `4. ⚠️ Common Mistakes: What do students usually get wrong here?\n` +
        `5. 💡 Study Tip: A helpful trick to solve similar problems in the future.`;
    } else if (toolMode === "essay") {
      const selectedTone = tone || "formal";
      prompt = 
        `Act as an expert Essay and Grammar Helper. Analyze the following student text:\n` +
        `"${question}"\n\n` +
        `Please perform the following:\n` +
        `1. Provide a revised/improved version adjusted to a "${selectedTone}" tone, polishing grammar, spelling, flow, and sentence structure.\n` +
        `2. List specific grammar corrections and explanations of why they were changed so the student can learn.\n` +
        `3. Give constructive vocabulary improvement recommendations.`;
    } else if (toolMode === "summary") {
      prompt = 
        `Act as an expert Study Summarizer. Summarize the following notes or material:\n` +
        `"${question}"\n\n` +
        `Please generate:\n` +
        `- A short, engaging high-level summary (1 paragraph)\n` +
        `- Bullets of core key points and takeaways\n` +
        `- Exam-readiness notes (concepts likely to be tested and how to remember them).`;
    } else if (toolMode === "translator") {
      const targetLang = language || "Spanish";
      prompt = 
        `Translate the following homework text into "${targetLang}", maintaining original mathematical or scientific formatting:\n` +
        `"${question}"\n\n` +
        `After the translation, provide a list of difficult or key vocabulary words used in the text, with explanations of what they mean.`;
    } else {
      // General Tutor Chat or Camera Scanner
      prompt = 
        `The student asks: "${question}".\n` +
        `Provide a helpful, detailed, and highly educational explanation. Use formatting, bold text, bullet points, and code blocks to make the response engaging and easy to study. Always show step-by-step reasoning and use illustrative examples.`;
    }

    // Prepare contents with optional image
    let contents: any;
    if (image && mimeType) {
      // Clean base64 prefix if present
      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `[Homework Scanner Mode] Read the text or equations from the uploaded image. First, transcribe/OCR the question or equation shown in the picture. Then, solve and explain it in detail following these guidelines: ${prompt}`,
          },
        ],
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Solve Error:", error);
    res.status(500).json({ error: error.message || "Failed to solve homework question." });
  }
});

// ==========================================
// AI interactive quiz generator api route
// ==========================================
app.post("/api/ai/quiz", async (req, res) => {
  try {
    ensureApiKey();
    const { topic, subject, difficulty, questionCount } = req.body;
    const count = questionCount || 4;
    const diff = difficulty || "medium";

    const prompt = 
      `Generate a practice quiz on the topic: "${topic}" (Subject: ${subject || "General Study"}).\n` +
      `Create exactly ${count} interactive questions of ${diff} difficulty.\n` +
      `Make sure there is a diverse mix of question types: Multiple Choice (MCQ), True/False, and Fill in the Blanks.\n` +
      `For Fill in the Blanks, provide options or the exact word as correctAnswer.\n` +
      `Include a detailed explanation for each correct answer that teaches the underlying concept.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert curriculum designer. You generate challenging, high-quality, and highly educational practice quizzes. You must strictly output your response in the requested JSON schema format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of quiz questions",
          items: {
            type: Type.OBJECT,
            required: ["id", "type", "questionText", "options", "correctAnswer", "explanation"],
            properties: {
              id: { type: Type.INTEGER, description: "Sequential question index starting from 1" },
              type: { type: Type.STRING, description: "The type of question: 'mcq' (Multiple Choice), 'boolean' (True/False), or 'blank' (Fill in the blank)" },
              questionText: { type: Type.STRING, description: "The quiz question itself" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "List of 4 choices for MCQs, or exactly ['True', 'False'] for boolean, or empty/example suggestions for blanks" 
              },
              correctAnswer: { type: Type.STRING, description: "The precise text matching the correct option (e.g. 'True', or the specific MCQ option string, or the exact word for blank)" },
              explanation: { type: Type.STRING, description: "A highly educational explanation of why this answer is correct and the reasoning behind it" }
            }
          }
        },
        temperature: 0.8,
      },
    });

    const parsedQuiz = JSON.parse(response.text || "[]");
    res.json({ quiz: parsedQuiz });
  } catch (error: any) {
    console.error("AI Quiz Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate interactive quiz." });
  }
});

// ==========================================
// Android Studio Kotlin project export zip
// ==========================================
app.get("/api/download-android", (req, res) => {
  const androidPath = path.join(__dirname, "android");
  const zipPath = path.join("/tmp", "ai_homework_helper_android.zip");

  // Ensure android source exists first
  if (!fs.existsSync(androidPath)) {
    return res.status(404).json({ error: "Android source directory not found. Please wait until generation is complete." });
  }

  // Use system zip utility to zip the android directory cleanly
  exec(`zip -r ${zipPath} android`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error("Zip Error:", error, stderr);
      return res.status(500).json({ error: "Failed to generate Android project ZIP package." });
    }

    res.download(zipPath, "AI_Homework_Helper_Android_Project.zip", (err) => {
      if (err) {
        console.error("Download Stream Error:", err);
      }
      // Clean up the temporary zip file after download finishes
      try {
        fs.unlinkSync(zipPath);
      } catch (e) {}
    });
  });
});

// ==========================================
// Vite Dev Server Middleware or Static Build
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI Homework Helper] Server running on http://localhost:${PORT}`);
  });
}

startServer();
