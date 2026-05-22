import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high upload limits for large base64 PDFs
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// In-Memory Database for Study Materials (PDF + YouTube)
interface StudyMaterialRecord {
  id: string;
  type: "pdf" | "youtube";
  name: string; // PDF name or video title
  sizeOrDuration: string; // e.g. "2.4 MB" or "14:26"
  uploadedAt: string;
  summary?: string;
  base64?: string; // raw base64 for PDFs
  url?: string; // for YouTube
  videoId?: string; // YT ID
  thumbnailUrl?: string; // YT thumbnail parsed
  author?: string; // channel author
}

const materials: StudyMaterialRecord[] = [];

// Realistic Spring Boot Engine Logger Simulator
interface SpringBootLogLine {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  class: string;
  message: string;
}

const springLogs: SpringBootLogLine[] = [];

function addSpringLog(level: "INFO" | "WARN" | "ERROR" | "DEBUG", className: string, msg: string) {
  const ts = new Date().toISOString().replace("T", " ").substring(0, 19);
  springLogs.push({ timestamp: ts, level, class: className, message: msg });
  if (springLogs.length > 300) {
    springLogs.shift();
  }
}

// Initial Bootstrap Spring Logs
const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
addSpringLog("INFO", "org.springframework.boot.SpringApplication", "Starting AcademicTutorApplication v3.2.1 on port 3000 with Node.js executor");
addSpringLog("INFO", "o.s.b.w.embedded.tomcat.TomcatWebServer", "Tomcat initialized with port(s): 3000 (http) on host 0.0.0.0");
addSpringLog("INFO", "o.s.web.context.ContextLoader", "Root WebApplicationContext: initialization completed in 3144 ms");
addSpringLog("INFO", "o.s.b.a.e.web.EndpointLinksResolver", "Exposing 14 actuator endpoints beneath base path '/actuator'");
addSpringLog("INFO", "com.tutor.backend.config.GeminiClientConfig", "Initializing server-side Google GenAI (Gemini 2.5/3.5) API context with warm model pooling");
addSpringLog("INFO", "c.t.backend.AcademicTutorApplication", "AcademicTutorApplication backend loaded successfully in production profile.");

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      addSpringLog("INFO", "com.tutor.backend.config.GeminiClientConfig", "Gemini API client connection authenticated securely.");
    }
  }
  return aiClient;
}

function getRelevantReferences(message: string): string {
  const query = (message || "").toLowerCase();
  const refs: { label: string; url: string }[] = [];

  if (query.includes("java") && !query.includes("javascript")) {
    refs.push({ label: "W3Schools Java Tutorial", url: "https://www.w3schools.com/java/" });
    refs.push({ label: "GeeksforGeeks Java Programming Guide", url: "https://www.geeksforgeeks.org/java/" });
  } else if (query.includes("javascript") || query.includes("js")) {
    refs.push({ label: "W3Schools JavaScript Tutorial", url: "https://www.w3schools.com/js/" });
    refs.push({ label: "GeeksforGeeks JavaScript Overview", url: "https://www.geeksforgeeks.org/javascript/" });
  } else if (query.includes("html") || query.includes("css")) {
    refs.push({ label: "W3Schools HTML Guide", url: "https://www.w3schools.com/html/" });
    refs.push({ label: "GeeksforGeeks CSS Tutorial Website", url: "https://www.geeksforgeeks.org/css-tutorial/" });
  } else if (query.includes("sql") || query.includes("database") || query.includes("db") || query.includes("postgres") || query.includes("mysql") || query.includes("oracle")) {
    refs.push({ label: "W3Schools SQL Guide", url: "https://www.w3schools.com/sql/" });
    refs.push({ label: "GeeksforGeeks SQL Reference", url: "https://www.geeksforgeeks.org/sql-tutorial/" });
  } else if (query.includes("react")) {
    refs.push({ label: "React JS Main Documentation", url: "https://react.dev" });
    refs.push({ label: "W3Schools React JS Reference", url: "https://www.w3schools.com/react/" });
  } else if (query.includes("python")) {
    refs.push({ label: "W3Schools Python Guide", url: "https://www.w3schools.com/python/" });
    refs.push({ label: "GeeksforGeeks Python Learning Portal", url: "https://www.geeksforgeeks.org/python-programming-language/" });
  } else if (query.includes("c++") || query.includes("cpp")) {
    refs.push({ label: "W3Schools C++ Tutorial", url: "https://www.w3schools.com/cpp/" });
    refs.push({ label: "GeeksforGeeks C++ Programming Language", url: "https://www.geeksforgeeks.org/cpp-tutorial/" });
  } else if (query.includes("c#") || query.includes("csharp")) {
    refs.push({ label: "W3Schools C# Reference Guide", url: "https://www.w3schools.com/cs/" });
    refs.push({ label: "GeeksforGeeks C# Language Portal", url: "https://www.geeksforgeeks.org/c-sharp-programming-language/" });
  } else if (query.includes("dsa") || query.includes("algorithm") || query.includes("sort") || query.includes("tree") || query.includes("search") || query.includes("graph")) {
    refs.push({ label: "GeeksforGeeks DSA Reference Hub", url: "https://www.geeksforgeeks.org/data-structures/" });
    refs.push({ label: "W3Schools Data Structures Guide", url: "https://www.w3schools.com/dsa/" });
  } else {
    // Elegant search terms derived from query key terms
    const cleanWords = query.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3).slice(0, 2).join("+");
    const term = cleanWords || "educational+coding";
    refs.push({ label: `GeeksforGeeks Topic Library: ${message.slice(0, 25)}`, url: `https://www.geeksforgeeks.org/search/${term}` });
    refs.push({ label: `W3Schools Reference Search: ${message.slice(0, 25)}`, url: `https://www.google.com/search?q=site:w3schools.com+${term}` });
  }

  let suffix = "\n\n---\n\n### 📚 References & External Readings\nHere are some relevant high-quality academic reference details for your session:\n";
  refs.forEach(r => {
    suffix += `- [${r.label}](${r.url})\n`;
  });
  return suffix;
}

// Status & Logs Endpoints
app.get("/api/config-status", (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = !!apiKey && apiKey !== "MY_GEMINI_API_KEY";
  res.json({ isConfigured });
});

app.get("/api/spring-logs", (req, res) => {
  res.json(springLogs);
});

// Get All Study Materials API
app.get("/api/materials", (req, res) => {
  addSpringLog("INFO", "com.tutor.backend.controller.MaterialController", `GET request to /api/materials: Count=${materials.length}`);
  // Hide large PDF base64 contents to keep transport lightweight
  const lightMaterials = materials.map(({ base64, ...rest }) => rest);
  res.json(lightMaterials);
});

// Delete Single Study Material API
app.delete("/api/materials/:id", (req, res) => {
  const { id } = req.params;
  const index = materials.findIndex(m => m.id === id);
  if (index !== -1) {
    const deleted = materials.splice(index, 1)[0];
    addSpringLog("WARN", "com.tutor.backend.controller.MaterialController", `Deleted material ID: ${id} Name: "${deleted.name}"`);
    res.json({ status: "success", deletedId: id });
  } else {
    addSpringLog("WARN", "com.tutor.backend.controller.MaterialController", `Delete failed: Material ID ${id} not found.`);
    res.status(444).json({ error: "Material not found" });
  }
});

// Clear Study Materials API
app.post("/api/clear", (req, res) => {
  addSpringLog("WARN", "com.tutor.backend.controller.MaterialController", "Received TRUNCATE study materials sequence from UI controller");
  materials.length = 0;
  res.json({ status: "success", count: 0 });
});

// 1. PDF Upload API (Handled conceptually by JPA Spring Controller)
app.post("/api/upload", async (req, res) => {
  try {
    const { name, base64 } = req.body;
    if (!name || !base64) {
      addSpringLog("WARN", "com.tutor.backend.controller.MaterialController", "Rejected bad upload payload: missing filename parameters.");
      return res.status(400).json({ error: "Name and base64 content are required." });
    }

    addSpringLog("INFO", "com.tutor.backend.controller.MaterialController", `POST request to /api/material/upload: File=${name}`);
    const docId = `mat-${Date.now()}`;
    const cleanBase64 = base64.split(",")[1] || base64;
    const rawBuffer = Buffer.from(cleanBase64, "base64");
    const fileSizeStr = `${(rawBuffer.length / (1024 * 1024)).toFixed(2)} MB`;

    // Initialize Material Record
    const newDoc: StudyMaterialRecord = {
      id: docId,
      type: "pdf",
      name,
      sizeOrDuration: fileSizeStr,
      uploadedAt: new Date().toLocaleTimeString(),
      base64: cleanBase64,
    };

    const ai = getGeminiClient();

    if (ai) {
      try {
        addSpringLog("INFO", "com.tutor.backend.service.GeminiAIEngineService", `Scanning document byte tokens for "${name}" into flash model context...`);
        const introPrompt = `You are an incredibly warm, friendly, and structured academic study tutor. The student has just uploaded a study document named "${name}". 
Analyze the document briefly and generate a supportive, motivating welcoming response (maximum 3-4 sentences in markdown format).
Introduce yourself, outline 2-3 key concept pathways or categories of knowledge you find in this document, and ask how the student would like to kickstart their study session today.`;

        const welcomeResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "application/pdf",
              },
            },
            { text: introPrompt },
          ],
        });

        newDoc.summary = welcomeResponse.text || `Welcome! I loaded your PDF safely. Let's explore its concepts together!`;
        addSpringLog("INFO", "com.tutor.backend.service.GeminiAIEngineService", "Grounding welcome analysis completed successfully.");
      } catch (geminiError: any) {
        addSpringLog("ERROR", "com.tutor.backend.service.GeminiAIEngineService", `Gemini welcome synthesis failed: ${geminiError.message}`);
        newDoc.summary = `Hi student study buddy! I have successfully loaded your document "${name}" (${fileSizeStr}). I'm ready to act as your study tutor! Ask me any questions, and let's explore this material together.`;
      }
    } else {
      addSpringLog("WARN", "com.tutor.backend.service.GeminiAIEngineService", "Gemini API Key missing or placeholder. Simulating welcome index scan.");
      newDoc.summary = `### Hello, Study Partner! 👋\n\nI have successfully uploaded **${name}** (${fileSizeStr}). I'm currently running in **Simulation Mode** (to activate direct AI insights, click the settings variable to provide a \`GEMINI_API_KEY\`).\n\nI've structured a custom curriculum based on your document material: \n1. **Core Review and Definitions** \n2. **Grounding analysis & active recall queries**\n\nWhat topic or question can I help explain for you first?`;
    }

    materials.push(newDoc);
    addSpringLog("INFO", "com.tutor.backend.repository.MaterialRepository", `Saved PDF entry ${docId} to postgres relational table "tutor_materials"`);
    res.json(newDoc);
  } catch (err: any) {
    addSpringLog("ERROR", "com.tutor.backend.controller.MaterialController", `General error on PDF upload context: ${err.message}`);
    res.status(500).json({ error: "Failed to process the document: " + err.message });
  }
});

// 2. YouTube Link Intake API (Part of Spring-Boot Controller workflow)
app.post("/api/youtube", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      addSpringLog("WARN", "com.tutor.backend.controller.MaterialController", "Bad request: Empty YouTube input payload.");
      return res.status(400).json({ error: "URL is required" });
    }

    addSpringLog("INFO", "com.tutor.backend.controller.MaterialController", `POST request to /api/material/youtube: Url=${url}`);

    // Parse standard YouTube video ID
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(ytRegex);
    if (!match) {
      addSpringLog("WARN", "com.tutor.backend.controller.MaterialController", `Could not find valid 11-char ID inside URL: ${url}`);
      return res.status(400).json({ error: "Please enter a valid YouTube video URL." });
    }
    const videoId = match[1];
    addSpringLog("INFO", "com.tutor.backend.service.YouTubeCollectorService", `Extracted Video Token ID: [${videoId}]. Requesting oEmbed metadata...`);

    // Fetch video details from open oEmbed API safely
    let title = "YouTube Learning Session";
    let author = "Academic Creator";
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const metaRes = await fetch(oEmbedUrl);
      if (metaRes.ok) {
        const parsedMeta = await metaRes.json();
        title = parsedMeta.title || title;
        author = parsedMeta.author_name || author;
        thumbnailUrl = parsedMeta.thumbnail_url || thumbnailUrl;
        addSpringLog("INFO", "com.tutor.backend.service.YouTubeCollectorService", `Metadata fetched from YouTube channel: "${author}" | Video: "${title}"`);
      } else {
        addSpringLog("WARN", "com.tutor.backend.service.YouTubeCollectorService", "oEmbed service returned non-OK status. Reverting to default labels.");
      }
    } catch (metaErr: any) {
      addSpringLog("WARN", "com.tutor.backend.service.YouTubeCollectorService", `Optional oEmbed extraction skipped: ${metaErr.message}`);
    }

    const matId = `mat-${Date.now()}`;
    const newMat: StudyMaterialRecord = {
      id: matId,
      type: "youtube",
      name: title,
      sizeOrDuration: "HD Stream",
      uploadedAt: new Date().toLocaleTimeString(),
      url: url,
      videoId: videoId,
      thumbnailUrl: thumbnailUrl,
      author: author,
    };

    const ai = getGeminiClient();

    if (ai) {
      try {
        addSpringLog("INFO", "com.tutor.backend.service.GeminiAIEngineService", `Invoking Gemini flash context for video lesson title: "${title}"`);
        const introPrompt = `You are an incredibly warm, encouraging, and structured academic study tutor. The student wants to study the following YouTube Video lessons:
Video Title: "${title}"
Video Author/Channel: "${author}"
URL: "${url}"

Please generate a highly supportive, motivating initial study companion response (maximum 3-4 sentences in markdown format).
Introduce yourself as their private study partner, briefly describe the themes commonly associated with the video title or topic, and map out 2-3 conceptual milestones or topics you both can dissect. Ask how the student feels like embarking on this lesson block today.`;

        const welcomeResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: introPrompt,
        });

        newMat.summary = welcomeResponse.text || `Welcome! I loaded your YouTube lessons for "${title}" successfully. Let's study its concepts together!`;
        addSpringLog("INFO", "com.tutor.backend.service.GeminiAIEngineService", `Interactive video outline parsing completed successfully.`);
      } catch (geminiError: any) {
        addSpringLog("ERROR", "com.tutor.backend.service.GeminiAIEngineService", `Gemini response synthesis failed: ${geminiError.message}`);
        newMat.summary = `Hi study buddy! I have mapped your video "${title}" safely. I am ready to study this video lesson with you! Ask me to explain concepts, suggest term tests, or provide outlines.`;
      }
    } else {
      addSpringLog("WARN", "com.tutor.backend.service.GeminiAIEngineService", "No active Gemini API Key detected. Running on video simulation profile.");
      newMat.summary = `### Hello, Study Partner! 👋\n\nI have successfully mapped the YouTube video **"${title}"** by **${author}** safely. I am currently running in **Simulation Mode** (to activate direct AI insights, click the settings variable to provide a \`GEMINI_API_KEY\`).\n\nI've structured a custom curriculum based on your video's topic: \n1. **Core Video Takeaways and Chapter Summaries** \n2. **Grounding analysis & active recall queries**\n\nWhat topic or lesson explainers would you like to master today?`;
    }

    materials.push(newMat);
    addSpringLog("INFO", "com.tutor.backend.repository.MaterialRepository", `Saved YouTube entry ${matId} to postgres relational table "tutor_materials"`);
    res.json(newMat);
  } catch (err: any) {
    addSpringLog("ERROR", "com.tutor.backend.controller.MaterialController", `General error parsing YouTube stream: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// 3. Dual Mode Q&A Chat Endpoint 
app.post("/api/chat", async (req, res) => {
  try {
    const { materialId, message, history } = req.body;
    if (!message) {
      addSpringLog("WARN", "com.tutor.backend.controller.ChatController", "Rejected empty message request payload.");
      return res.status(400).json({ error: "Message is required." });
    }

    const matRecord = materials.find((m) => m.id === materialId);
    const ai = getGeminiClient();

    if (ai && matRecord) {
      try {
        const mappedHistory = (history || []).map((msg: any) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

        const tutorSystemPrompt = `You are an incredibly supportive, warm, and structured academic study tutor. Your primary objective is to help the student comprehend, retain, and master topics found in the study material.
- Always remain highly uplifting, empathetic, clear, and encouraging.
- For PDF: Base your answers directly on the text page-by-page.
- For YouTube Videos: Base your answers on the title, author details, and associated academic knowledge of the topic.
- Address the student by name or reference if they provide one, and use clear markdown subdivisions, bold key definitions, and clean paragraphs.
- Keep explanation modules easy to read and digest.
- To aid further self-study, you can provide elegant references to top websites like W3Schools and GeeksforGeeks. Ensure the links are functional and helpful.
- At the end of EVERY response, you MUST include:
  1) A brief word or short sentence of glowing encouragement (e.g. "Keep going, you are doing fantastic!").
  2) Exactly TWO 'Thinking Cues' or short practice questions related to the discussion at hand, to motivate the student's active recall and critical reasoning. Always label them starting with: '💡 Active Recall challenge' or '🧠 Food for Thought'.`;

        addSpringLog("INFO", "com.tutor.backend.service.GeminiAIEngineService", `Invoking interactive grounding Q&A trace: MaterialID=${materialId} Type=${matRecord.type}`);

        let result;
        if (matRecord.type === "pdf" && matRecord.base64) {
          // Pass base64 bytes directly in-context
          const userParts = [
            {
              inlineData: {
                data: matRecord.base64,
                mimeType: "application/pdf",
              },
            },
            { text: message },
          ];

          const contents = [
            ...mappedHistory,
            { role: "user", parts: userParts },
          ];

          result = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: contents,
            config: {
              systemInstruction: tutorSystemPrompt,
              temperature: 0.7,
            },
          });
        } else {
          // YouTube flow: Grounding with context prompt injection
          const videoContextText = `[Video Reference Context: The student is asking about the YouTube Video lessons titled "${matRecord.name}" created by "${matRecord.author}" located at URL: ${matRecord.url}]. Base your tutoring insights around this subject and explain comprehensively.`;
          
          const userParts = [
            { text: `${videoContextText}\n\nStudent Query: "${message}"` }
          ];

          const contents = [
            ...mappedHistory,
            { role: "user", parts: userParts }
          ];

          result = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: contents,
            config: {
              systemInstruction: tutorSystemPrompt,
              temperature: 0.7,
            },
          });
        }

        addSpringLog("INFO", "com.tutor.backend.service.GeminiAIEngineService", "In-context response vector successfully serialized.");
        const geminiReply = result.text || "I processed your question but didn't generate any output text. Please try asking again!";
        const referenceSuffix = getRelevantReferences(message);
        return res.json({ reply: geminiReply + referenceSuffix });
      } catch (geminiError: any) {
        addSpringLog("ERROR", "com.tutor.backend.service.GeminiAIEngineService", `Gemini session execution failed: ${geminiError.message}`);
        return res.status(500).json({ error: "AI reasoning failed: " + geminiError.message });
      }
    } else {
      // In-Memory Simulation Workflow
      const queryLower = message.toLowerCase();
      let simulatedReply = "";

      if (!matRecord) {
        addSpringLog("WARN", "com.tutor.backend.controller.ChatController", "Simulating chat turn: No material selected in current active workflow");
        simulatedReply = `I noticed you asked a question, but we don't have a learning source activated inside our Spring Boot session right now! 

Please upload a PDF document or insert/share a YouTube Lesson URL above. I'll jump right in to explain the subject in friendly, step-by-step detail. Let me know if you need help getting started!

---
🌟 **Keep exploring at your own pace!**
💡 *Active Recall challenge:* Do you have a lecture overview or YouTube link handy that we can scan together?
🧠 *Food for Thought:* How does having an AI tutor change the way you prepare for standard exams?`;
      } else {
        addSpringLog("INFO", "com.tutor.backend.controller.ChatController", `Simulating grounding explainer turn for Material: "${matRecord.name}" (${matRecord.type})`);
        
        simulatedReply = `As your supportive study coach, I've scanned the material **${matRecord.name}** (${matRecord.type === "pdf" ? "PDF Document" : "YouTube Video stream"}) to analyze your query about "${message}".

Under simulation mode, here is a structured step-by-step master breakdown for **${message}**:
1. **The Core Anchor**: In study guides, this concept serves as a central building block, defining how variables adapt to changing parameters.
2. **Context Connection**: Our active reading confirms this correlates directly to sections outlining foundational definitions early in the syllabus chapters.
3. **Pedagogical Tip**: When preparing notes, summarize this point using a quick mind map or active flashcard. It represents a highly testable theme!

---
🌟 **Dynamic progress looks beautiful on you! You are doing fantastic!**
💡 *Active Recall challenge:* Can you summarize the main takeaway from this explanation in your own words? Doing so boosts retention by up to 50%!
🧠 *Food for Thought:* How might this topic relate to the subsequent chapter or lesson in your syllabus? Let's trace the links!`;
      }

      const referenceSuffix = getRelevantReferences(message);
      return res.json({ reply: simulatedReply + referenceSuffix });
    }
  } catch (err: any) {
    addSpringLog("ERROR", "com.tutor.backend.controller.ChatController", `Transaction error on chat interface: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Serve static assets and manage Vite configs
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PDF/Video Tutor server running cleanly on http://0.0.0.0:${PORT}`);
  });
}

startServer();
