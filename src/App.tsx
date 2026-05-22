import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Sparkles, 
  UploadCloud, 
  Send, 
  Trash2, 
  GraduationCap, 
  Loader2, 
  BrainCircuit, 
  ArrowRight, 
  Info,
  Check,
  RefreshCw,
  Search,
  BookOpen,
  Youtube,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Monitor,
  Flame,
  FileDown
} from "lucide-react";
import { StudyMaterial, ChatMessage, SpringBootLogLine } from "./types";
import { exportNotesToPDF } from "./lib/pdfGenerator";

export default function App() {
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(null);
  const [materialsList, setMaterialsList] = useState<StudyMaterial[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hello! I am your supportive academic tutor. 🎓\n\nI can read standard PDF articles/notes **OR** analyze shared YouTube lesson streams to explain complex subjects in real time. Choose your study model on the left deck, upload a PDF or enter a video link, and let's master the curriculum!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [ytUrlInput, setYtUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isParsingYt, setIsParsingYt] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  
  // Left Sidebar panel tabs: "library" (multiple uploads management) | "active" (grounded player or syllabus indices summary)
  const [leftSectionTab, setLeftSectionTab] = useState<"library" | "active">("library");
  
  // Tab control inside library add section: "pdf" | "youtube"
  const [materialTab, setMaterialTab] = useState<"pdf" | "youtube">("pdf");
  
  // Spring Boot Logs System Console States (Starts collapsed to prevent vertical layout overwhelming)
  const [showConsole, setShowConsole] = useState(false);
  const [springLogs, setSpringLogs] = useState<SpringBootLogLine[]>([]);
  const [isPollingLogs, setIsPollingLogs] = useState(true);

  // Modern collapsible UI state for Upload deck
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(true);

  // Search filter for your Study library files
  const [searchTerm, setSearchTerm] = useState("");

  // Non-intrusive beautiful toast notification system
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Fetch all study materials from backend
  const fetchMaterials = async (selectLatest = false, preventAutoSelect = false) => {
    try {
      const res = await fetch("/api/materials");
      if (res.ok) {
        const data = await res.json();
        setMaterialsList(data);
        if (data.length > 0) {
          if (selectLatest) {
            const latest = data[data.length - 1];
            setActiveMaterial(latest);
          } else {
            setActiveMaterial(prev => {
              if (prev && data.some((m: StudyMaterial) => m.id === prev.id)) {
                return data.find((m: StudyMaterial) => m.id === prev.id) || prev;
              }
              return preventAutoSelect ? null : data[0];
            });
          }
        } else {
          setActiveMaterial(null);
        }
      }
    } catch (err) {
      console.error("Retrieving materials failed:", err);
    }
  };

  // Check Gemini config status & load Spring logs
  useEffect(() => {
    async function checkConfig() {
      try {
        const res = await fetch("/api/config-status");
        if (res.ok) {
          const data = await res.json();
          setIsConfigured(data.isConfigured);
        }
      } catch (err) {
        console.warn("Could not retrieve AI configuration state - default to simulator:", err);
        setIsConfigured(false);
      }
    }
    checkConfig();
    fetchMaterials();
  }, []);

  // Poll Spring Boot Logs relative to operations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchLogs() {
      try {
        const res = await fetch("/api/spring-logs");
        if (res.ok) {
          const logs = await res.json();
          setSpringLogs(logs);
        }
      } catch (e) {
        console.warn("Spring Log pull failed:", e);
      }
    }

    if (isPollingLogs) {
      fetchLogs(); // initial pull
      interval = setInterval(fetchLogs, 3000);
    }
    return () => clearInterval(interval);
  }, [isPollingLogs]);

  // Scroll to bottom helper for message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Scroll to bottom of Spring Boot Terminal when active
  useEffect(() => {
    if (showConsole) {
      consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [springLogs, showConsole]);

  // PDF Handshakes & Processing
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      showToast("Please select a standard PDF article or document first.", "error");
      return;
    }

    setIsUploading(true);
    showToast("Reading your study PDF into secure session context...", "info");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Str = e.target?.result as string;
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name,
              base64: base64Str
            })
          });

          if (!res.ok) {
            throw new Error("Spring REST endpoint parser failed internally.");
          }

          const docResult: StudyMaterial = await res.json();
          // Reload all list items immediately and set newest active
          await fetchMaterials(true);
          setLeftSectionTab("active");
          showToast(`Successfully indexed "${docResult.name}"!`, "success");

          // Add feedback logs
          setMessages(prev => [
            ...prev,
            {
              id: `upload-${Date.now()}`,
              role: "assistant",
              content: `### 📋 Scanned PDF Material Successfully Loaded!\n\n**File:** ${docResult.name} (${docResult.sizeOrDuration})\n\n${docResult.summary}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } catch (serverErr: any) {
          console.error(serverErr);
          showToast("PDF scanning stalled. Ensure document contains readable text layers.", "error");
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        showToast("Error reading file stream buffer from local disk.", "error");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  // YouTube Links Intake Process
  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytUrlInput.trim() || isParsingYt) return;

    setIsParsingYt(true);
    showToast("Mapping your lecture video stream... Synthesizing metadata.", "info");
    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ytUrlInput })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process YouTube link.");
      }

      const ytResult: StudyMaterial = await res.json();
      // Reload all list items immediately and set newest active
      await fetchMaterials(true);
      setLeftSectionTab("active");
      setYtUrlInput("");
      showToast("Educational YouTube link loaded and formatted!", "success");

      setMessages(prev => [
        ...prev,
        {
          id: `youtube-${Date.now()}`,
          role: "assistant",
          content: `### 🎥 YouTube Media Stream Registered!\n\n**Video Title:** ${ytResult.name}\n**Speaker/Channels:** ${ytResult.author || "Educational Expert"}\n\n${ytResult.summary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      showToast(err.message || "Connection to YouTube service refused.", "error");
    } finally {
      setIsParsingYt(false);
    }
  };

  // Delete Individual Study Material
  const deleteMaterial = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Remove this study item from active dashboard index?")) {
      try {
        const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
        if (res.ok) {
          if (activeMaterial?.id === id) {
            setActiveMaterial(null);
          }
          await fetchMaterials(false, true);
          showToast("Study material purged from shelf database.", "info");
          setMessages(prev => [
            ...prev,
            {
              id: `del-${Date.now()}`,
              role: "assistant",
              content: `ℹ️ Removed study resource from session memory. Choose another active material in the library deck.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } else {
          showToast("Unable to remove. Relational record sync error.", "error");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Reset Session
  const clearCurrentWorkspace = async () => {
    if (confirm("Purge study workspace completely? This cannot be undone.")) {
      try {
        await fetch("/api/clear", { method: "POST" });
        setActiveMaterial(null);
        showToast("Study workspace fully reset.", "success");
        setMessages([
          {
            id: `reset-${Date.now()}`,
            role: "assistant",
            content: "Welcome, let's start a fresh study cohort! Upload another textbook PDF or drop a YouTube lesson link and we will dissect it together page-by-page.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err) {
        console.error("Clearing sessions failed:", err);
      }
    }
  };

  // Chat message submit
  const handleChatSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const query = customPrompt || inputText;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: activeMaterial?.id || null,
          message: query,
          history: messages.slice(-12) // feed context history window
        })
      });

      if (!res.ok) {
        throw new Error("Chat response status failure");
      }

      const data = await res.json();
      
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Oops! My reasoning engines hit a brief sync snag. Could you try sending that query again or choose one of our active coach shortcuts?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Preset prompts
  const applyPresetAction = (presetKey: string) => {
    if (!activeMaterial) return;
    let queryText = "";
    
    if (activeMaterial.type === "pdf") {
      switch (presetKey) {
        case "quiz":
          queryText = "Could you please test my memory on the core terminology in this PDF document with a quick multiple choice active recall question? Give me feedback after my next turn.";
          break;
        case "summarize":
          queryText = "Please break down the most essential testable takeaways of this PDF document into hierarchical step-by-step summaries.";
          break;
        case "analogy3":
          queryText = "Identify the most sophisticated mathematical or logical concept of this PDF and explain it to me using a simple, relatable real-world analogy.";
          break;
        case "notes":
          queryText = "Please construct a comprehensive set of rigorous study notes from this textbook PDF. Outline the main definitions, equations/formulas (if any), sequential key points, and core takeaways in a beautiful study sheet format that is easy to memorize. Label the response clearly as a completed study notes guide.";
          break;
      }
    } else {
      switch (presetKey) {
        case "quiz":
          queryText = "Please quiz me on the primary content of this YouTube video lesson. Give me a question to test my understanding.";
          break;
        case "summarize":
          queryText = "Provide a comprehensive, step-by-step core study map summarizing this YouTube lesson's main points.";
          break;
        case "analogy3":
          queryText = "Take the most complex terms discussed in this YouTube lecture video and explain them perfectly with a fun real-world analogy.";
          break;
        case "notes":
          queryText = "Please write a comprehensive academic study guide and notes document from this YouTube lecture stream. Synthesize the core concepts, outline the step-by-step explanations, and structure them nicely into key study sections that are highly testable.";
          break;
      }
    }
    handleChatSubmit(undefined, queryText);
  };

  // Format markdown helper
  const formatMarkdownText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let content = line;
      
      const isQuote = content.startsWith("> ");
      if (isQuote) {
        content = content.slice(2);
      }

      const isBullet = content.startsWith("- ") || content.startsWith("* ");
      if (isBullet) {
        content = content.slice(2);
      }

      let headingLevel = 0;
      if (content.startsWith("### ")) {
        headingLevel = 3;
        content = content.slice(4);
      } else if (content.startsWith("## ")) {
        headingLevel = 2;
        content = content.slice(3);
      } else if (content.startsWith("# ")) {
        headingLevel = 1;
        content = content.slice(2);
      }

      // Formatting text spans
      let elements: React.ReactNode[] = [];
      let tempText = content;
      let key = 0;

      while (tempText.length > 0) {
        const boldIndex = tempText.indexOf("**");
        const italicIndex = tempText.indexOf("*");
        const codeIndex = tempText.indexOf("`");

        let linkIndex = tempText.indexOf("[");
        let hasValidLink = false;
        let linkTextEnd = -1;
        let linkUrlEnd = -1;
        if (linkIndex !== -1) {
          linkTextEnd = tempText.indexOf("]", linkIndex);
          if (linkTextEnd !== -1 && tempText[linkTextEnd + 1] === "(") {
            linkUrlEnd = tempText.indexOf(")", linkTextEnd + 2);
            if (linkUrlEnd !== -1) {
              hasValidLink = true;
            }
          }
        }
        if (!hasValidLink) {
          linkIndex = -1;
        }

        const indexes = [
          { type: "bold", idx: boldIndex },
          { type: "italic", idx: italicIndex },
          { type: "code", idx: codeIndex },
          { type: "link", idx: linkIndex }
        ].filter(item => item.idx !== -1).sort((a, b) => a.idx - b.idx);

        if (indexes.length === 0) {
          elements.push(<span key={key++}>{tempText}</span>);
          break;
        }

        const next = indexes[0];
        if (next.idx > 0) {
          elements.push(<span key={key++}>{tempText.slice(0, next.idx)}</span>);
        }

        tempText = tempText.slice(next.idx);

        if (next.type === "bold") {
          const closingIndex = tempText.indexOf("**", 2);
          if (closingIndex !== -1) {
            elements.push(<strong key={key++} className="font-bold text-white tracking-tight">{tempText.slice(2, closingIndex)}</strong>);
            tempText = tempText.slice(closingIndex + 2);
          } else {
            elements.push(<span key={key++}>{"**"}</span>);
            tempText = tempText.slice(2);
          }
        } else if (next.type === "italic") {
          const closingIndex = tempText.indexOf("*", 1);
          if (closingIndex !== -1) {
            elements.push(<em key={key++} className="italic text-indigo-300">{tempText.slice(1, closingIndex)}</em>);
            tempText = tempText.slice(closingIndex + 1);
          } else {
            elements.push(<span key={key++}>{"*"}</span>);
            tempText = tempText.slice(1);
          }
        } else if (next.type === "code") {
          const closingIndex = tempText.indexOf("`", 1);
          if (closingIndex !== -1) {
            elements.push(<code key={key++} className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-amber-300 font-mono text-[10.5px] font-medium">{tempText.slice(1, closingIndex)}</code>);
            tempText = tempText.slice(closingIndex + 1);
          } else {
            elements.push(<span key={key++}>{"`"}</span>);
            tempText = tempText.slice(1);
          }
        } else if (next.type === "link") {
          const currentCloseBracket = tempText.indexOf("]");
          const currentCloseParen = tempText.indexOf(")", currentCloseBracket + 2);

          if (currentCloseBracket !== -1 && currentCloseParen !== -1) {
            const linkText = tempText.slice(1, currentCloseBracket);
            const linkUrl = tempText.slice(currentCloseBracket + 2, currentCloseParen);
            elements.push(
              <a 
                key={key++} 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-400 hover:text-indigo-300 font-bold underline decoration-indigo-500/50 hover:decoration-indigo-500 transition-all text-[12px] cursor-pointer inline-flex items-center"
              >
                {linkText}
              </a>
            );
            tempText = tempText.slice(currentCloseParen + 1);
          } else {
            elements.push(<span key={key++}>{"["}</span>);
            tempText = tempText.slice(1);
          }
        }
      }

      let renderedNode = <span className="leading-relaxed">{elements}</span>;
      
      if (headingLevel === 1) {
        renderedNode = <h1 className="text-base font-bold text-white mt-3 mb-1.5 tracking-tight border-b border-slate-800/80 pb-0.5">{elements}</h1>;
      } else if (headingLevel === 2) {
        renderedNode = <h2 className="text-sm font-bold text-slate-100 mt-3 mb-1 tracking-tight">{elements}</h2>;
      } else if (headingLevel === 3) {
        renderedNode = <h3 className="text-xs font-semibold text-indigo-400 mt-2 mb-1 uppercase tracking-wide font-mono flex items-center">{elements}</h3>;
      }

      if (isBullet) {
        renderedNode = (
          <li className="list-disc ml-4 my-0.5 text-slate-300 leading-relaxed text-[12px]">
            {renderedNode}
          </li>
        );
      }

      if (isQuote) {
        renderedNode = (
          <blockquote className="border-l-2 border-indigo-500 pl-3 italic text-slate-400 my-2 bg-indigo-950/10 py-1 rounded-r">
            {renderedNode}
          </blockquote>
        );
      }

      return (
        <div key={idx} className={`${!isBullet && !isQuote && headingLevel === 0 ? "mb-1.5" : ""}`}>
          {renderedNode}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#070913] text-slate-150 font-sans overflow-hidden antialiased">
      
      {/* 1. Header Area with Blur & Premium Glowing Accents */}
      <header className="h-16 px-6 bg-[#0c1020]/90 backdrop-blur-md border-b border-indigo-950/40 flex items-center justify-between flex-shrink-0 z-20 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-700 to-indigo-550 rounded-xl flex items-center justify-center shadow-md shadow-indigo-900/30">
            <GraduationCap className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <span>DocuMind</span>
              <span className="text-[8px] text-indigo-300 bg-indigo-950/85 px-2 py-0.5 rounded-full border border-indigo-500/30 font-mono font-semibold uppercase tracking-widest">
                Personal AI Tutor
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Interactive Personal Study Companion & Lecture Grounding Engine</p>
          </div>
        </div>

        {/* Top-Right Navigation Controls Area */}
        <div className="flex items-center space-x-4">
          {/* Status indicators removed for pristine aesthetic style */}
        </div>
      </header>

      {/* 2. Custom Floating Toast Notification Area */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-3 bg-slate-950/95 border border-indigo-950/60 shadow-2xl p-3.5 rounded-2xl animate-fade-in backdrop-blur-md max-w-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${
            toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-red-500" : "bg-indigo-500"
          } animate-pulse`} />
          <p className="text-xs text-slate-200 font-medium tracking-tight leading-snug">{toast.message}</p>
        </div>
      )}

      {/* 3. Main Split Grid Workspace */}
      <main className="flex-1 overflow-hidden grid grid-cols-12 min-h-0 bg-[#080b15]">
        
        {/* Left Column: Media Workspace Library */}
        <section className="col-span-12 md:col-span-5 lg:col-span-4 border-r border-indigo-950/20 bg-[#0a0d1a] flex flex-col min-h-0">
          
          {/* Main Space Segmented Picker */}
          <div className="p-3.5 bg-[#0b0e1d] border-b border-indigo-950/20 flex-shrink-0">
            <div className="bg-[#050812] p-1 rounded-xl border border-indigo-950/40 flex">
              <button
                onClick={() => setLeftSectionTab("library")}
                id="tab-library"
                className={`flex-1 py-2 text-center text-[11px] font-bold font-mono tracking-wider uppercase flex items-center justify-center space-x-1.5 rounded-lg transition-all ${
                  leftSectionTab === "library" 
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shadow-sm" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Shelf ({materialsList.length})</span>
              </button>
              <button
                onClick={() => setLeftSectionTab("active")}
                id="tab-active-material"
                className={`flex-1 py-2 text-center text-[11px] font-bold font-mono tracking-wider uppercase flex items-center justify-center space-x-1.5 rounded-lg transition-all ${
                  leftSectionTab === "active" 
                    ? "bg-[#0c1122] text-indigo-400 border border-indigo-500/25" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Study</span>
              </button>
            </div>
          </div>

          {leftSectionTab === "library" ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
              
              {/* Collapsible Accordion Upload Panel */}
              <div className="bg-slate-950/40 rounded-xl border border-indigo-950/30 overflow-hidden">
                <div 
                  onClick={() => setIsAddResourceOpen(!isAddResourceOpen)}
                  className="px-4 py-3 bg-[#0c1022]/40 flex items-center justify-between cursor-pointer select-none hover:bg-[#0c132c]/50 transition-colors"
                >
                  <span className="text-[10px] font-bold font-mono text-indigo-300 uppercase tracking-wider flex items-center">
                    <UploadCloud className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                    Expand Upload Deck
                  </span>
                  <div className="text-slate-500">
                    {isAddResourceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isAddResourceOpen && (
                  <div className="p-4 border-t border-indigo-950/20 space-y-3.5 bg-slate-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest">
                        Choose Format
                      </span>

                      {/* PDF / YouTube selector caps */}
                      <div className="flex bg-slate-950/85 p-0.5 rounded border border-indigo-950/60">
                        <button
                          onClick={() => setMaterialTab("pdf")}
                          id="mini-tab-pdf"
                          type="button"
                          className={`text-[9px] font-bold py-0.5 px-2 bg-transparent rounded font-mono uppercase transition-all ${
                            materialTab === "pdf" ? "bg-indigo-600/80 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Book PDF
                        </button>
                        <button
                          onClick={() => setMaterialTab("youtube")}
                          id="mini-tab-yt"
                          type="button"
                          className={`text-[9px] font-bold py-0.5 px-2 bg-transparent rounded font-mono uppercase transition-all ${
                            materialTab === "youtube" ? "bg-red-650/80 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Video URL
                        </button>
                      </div>
                    </div>

                    {materialTab === "pdf" ? (
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        id="dropzone-area"
                        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[100px] transition-all ${
                          dragActive 
                            ? "border-indigo-500 bg-indigo-950/30" 
                            : "border-indigo-950/50 bg-slate-950/25 hover:border-indigo-500/40 hover:bg-slate-950/50"
                        }`}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          accept="application/pdf" 
                          className="hidden" 
                        />
                        {isUploading ? (
                          <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                            <span className="text-[10px] text-slate-400 font-mono">Indexing PDF layers...</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-bold text-slate-300">Click or drag your PDF workbook</p>
                            <p className="text-[9.5px] text-slate-500 font-mono">Auto-structured on relational table</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleYoutubeSubmit} className="space-y-2">
                        <p className="text-[9.5px] text-slate-500 font-mono">Link academic lecture or webinar:</p>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={ytUrlInput}
                            onChange={(e) => setYtUrlInput(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            id="youtube-url-inline"
                            className="flex-1 bg-slate-950 border border-indigo-950/60 rounded px-3 py-2 text-[11px] text-white outline-none focus:border-red-550/30 placeholder-slate-700"
                          />
                          <button
                            type="submit"
                            disabled={isParsingYt || !ytUrlInput.trim()}
                            id="submit-youtube-btn"
                            className="px-3 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold flex items-center justify-center transition-colors disabled:opacity-35"
                          >
                            {isParsingYt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Link"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Study Library Shelf list area with query search helper! */}
              <div className="space-y-3.5 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between flex-shrink-0">
                  <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                    Study Library ({materialsList.length})
                  </span>
                  
                  {materialsList.length > 0 && (
                    <button
                      onClick={clearCurrentWorkspace}
                      id="clear-all-cohort-btn"
                      className="text-[9px] font-mono text-slate-500 hover:text-red-400 transition-colors flex items-center cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Prune Shelf
                    </button>
                  )}
                </div>

                {/* Instant Search filter input */}
                {materialsList.length > 0 && (
                  <div className="relative flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search books & lectures..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-950/30 rounded-xl pl-9 pr-3 py-1.5 text-[11px] text-slate-200 outline-none focus:border-indigo-500/40 placeholder-slate-700"
                    />
                  </div>
                )}

                {/* Library Books Scroll Container */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scroll">
                  {materialsList.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-slate-950/20 border border-indigo-950/20 border-dashed space-y-2 mt-2">
                      <div className="w-10 h-10 bg-indigo-950/20 border border-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-300 font-bold">Shelf is Vacant</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Your academic AI mentor is standing by. Drag a textbook PDF or link a video lesson above to load study vectors!
                      </p>
                    </div>
                  ) : (
                    materialsList
                      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => {
                        const isActive = activeMaterial?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setActiveMaterial(item);
                              setLeftSectionTab("active");
                              showToast(`Focused learning target: ${item.name.substring(0, 20)}...`, "info");
                            }}
                            id={`material-card-${item.id}`}
                            className={`group p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between relative ${
                              isActive
                                ? "bg-indigo-950/15 border-indigo-500/50 shadow-md shadow-indigo-950/30"
                                : "bg-slate-950/20 border-indigo-950/10 hover:border-indigo-550/30 hover:bg-slate-950/40"
                            }`}
                          >
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 ${
                                item.type === "pdf"
                                  ? "bg-indigo-950/30 border-indigo-500/25 text-indigo-400"
                                  : "bg-red-950/25 border-red-500/15 text-red-500"
                              }`}>
                                {item.type === "pdf" ? (
                                  <FileText className="w-4 h-4" />
                                ) : (
                                  <Youtube className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1 pr-1">
                                  {item.name}
                                </h5>
                                <p className="text-[9px] text-slate-500 font-mono mt-0.5 flex items-center">
                                  <span className={item.type === "pdf" ? "text-indigo-450 font-semibold" : "text-red-400 font-semibold"}>
                                    {item.type === "pdf" ? "PDF" : "Lecture Video"}
                                  </span>
                                  <span className="mx-1 text-slate-800">•</span>
                                  <span>{item.sizeOrDuration}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 flex-shrink-0">
                              {isActive && (
                                <span className="text-[8px] font-mono bg-indigo-950/90 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">
                                  ACTIVE
                                </span>
                              )}
                              <button
                                onClick={(e) => deleteMaterial(item.id, e)}
                                id={`delete-btn-${item.id}`}
                                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors opacity-60 hover:opacity-100 group-hover:opacity-100 cursor-pointer"
                                title="Delete study item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>
          ) : (
            // ACTIVE STUDY FOCUS DECK: YouTube player iframe + Lesson map notes summary!
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
              
              {!activeMaterial ? (
                <div className="p-8 text-center rounded-xl bg-slate-950/20 border border-indigo-950/25 border-dashed space-y-2 my-auto">
                  <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">No Material Grounded</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto text-center">
                    Select a course file or webinar lecture from the library shelf to open details, trigger YouTube player screens, and map out the study syllabus!
                  </p>
                  <button
                    onClick={() => setLeftSectionTab("library")}
                    id="return-to-library-btn"
                    className="mt-2 text-[10px] font-bold text-indigo-400 hover:underline inline-flex items-center"
                  >
                    Go to Library <ArrowRight className="w-3 h-3 ml-1 animate-bounce" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Current Active Material Passport */}
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-indigo-950/30 flex items-start justify-between">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <div className={`w-8 h-8 border rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activeMaterial.type === "pdf"
                          ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-400"
                          : "bg-red-950/30 border-red-500/20 text-red-500"
                      }`}>
                        {activeMaterial.type === "pdf" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <Youtube className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate pr-1">
                          {activeMaterial.name}
                        </h4>
                        <span className="text-[8.5px] text-slate-400 font-mono block mt-0.5">
                          {activeMaterial.type === "pdf" ? `PDF Article • Size: ${activeMaterial.sizeOrDuration}` : `Video Stream • Speaker: ${activeMaterial.author}`}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => deleteMaterial(activeMaterial.id, e)}
                      id="active-material-delete-btn"
                      className="p-1 rounded bg-slate-900/50 hover:bg-slate-850 hover:text-red-400 text-slate-400 transition-colors"
                      title="Clear active lesson"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Grounded Custom Video Player */}
                  {activeMaterial.type === "youtube" && activeMaterial.videoId && (
                    <div className="rounded-xl overflow-hidden border border-indigo-950/20 bg-black aspect-video relative group shadow-lg">
                      <iframe
                        title={activeMaterial.name}
                        src={`https://www.youtube.com/embed/${activeMaterial.videoId}?autoplay=0&rel=0`}
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                      <div className="absolute top-2 left-2 pointer-events-none bg-red-900/80 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest font-bold text-white border border-red-500/10 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                        <span>Interactive Video Stream</span>
                      </div>
                    </div>
                  )}

                  {/* Core Synthesized Lesson Syllabus Map */}
                  <div className="bg-[#0b101f] rounded-xl p-4 border border-indigo-950/20 flex flex-col min-h-[160px] max-h-[380px] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-indigo-950/30 pb-2 mb-2 flex-shrink-0">
                      <h5 className="text-[9.5px] font-bold text-slate-400 font-mono tracking-wider uppercase flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                        Interactive Lesson Syllabus Map
                      </h5>
                      {activeMaterial.summary && (
                        <button
                          onClick={() => {
                            exportNotesToPDF(`Academic Lesson Map - ${activeMaterial?.name}`, activeMaterial?.summary || "", activeMaterial?.name || "Resource");
                            showToast("Downloaded Study Lesson Map PDF successfully!", "success");
                          }}
                          id="download-lesson-map-pdf"
                          className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Download study syllabus instantly as formatted PDF"
                        >
                          <FileDown className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto pr-1 flex-1 text-[11px] text-slate-300 leading-relaxed font-sans custom-scroll">
                      {formatMarkdownText(activeMaterial.summary || "Generating study syllabus pathways...")}
                    </div>
                  </div>

                  {/* Quick-Trigger Dashboard shortcut references */}
                  <div className="bg-slate-950/20 rounded-xl p-3 border border-indigo-950/10 space-y-2">
                    <span className="text-[8.5px] font-bold font-mono text-slate-500 uppercase tracking-widest block">
                      Active Focus Indicators
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-mono bg-indigo-950/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        📄 Formatted Study Guide Ready
                      </span>
                      <span className="text-[9px] font-mono bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        💡 Analogies Prepared
                      </span>
                      <span className="text-[9px] font-mono bg-amber-950/20 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        ❓ Contextual Quiz Configured
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>
          )}
        </section>

        {/* Right Column: Active Chat Guidance Dialogue */}
        <section className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col bg-[#070912] min-h-0 relative">
          
          {/* Active Study Material grounded banner */}
          <div className="px-5 py-3 border-b border-indigo-950/10 bg-[#0a0d1a] flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              Tutor Guidance Session
            </span>
            <div className="flex items-center space-x-2 font-mono text-[9px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-indigo-950/30">
              <span className="text-slate-500">Workspace focus:</span>
              <strong className="text-indigo-400 truncate max-w-[150px] sm:max-w-xs">{activeMaterial ? activeMaterial.name : "Unassigned"}</strong>
            </div>
          </div>

          {/* Chat dialog bubbles space */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scroll">
            {messages.map((item) => {
              const isAi = item.role === "assistant";
              return (
                <div key={item.id} className={`flex items-start space-x-3.5 ${isAi ? "" : "flex-row-reverse space-x-reverse"}`}>
                  
                  {/* Speech bubble avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm shadow-md border ${
                    isAi 
                      ? "bg-indigo-650 border-indigo-500/30 text-white animate-pulse" 
                      : "bg-[#141a2c] border-indigo-950 text-slate-350"
                  }`}>
                    {isAi ? "👩‍🏫" : "👤"}
                  </div>

                  {/* Speech Bubble body */}
                  <div className="max-w-[85%] space-y-1">
                    <div className={`p-4 rounded-2xl text-[11.5px] leading-relaxed border transition-all ${
                      isAi 
                        ? "bg-[#0d1020] text-slate-200 border-indigo-950/60 shadow-lg shadow-indigo-950/10 hover:border-indigo-900/30" 
                        : "bg-indigo-600 font-medium text-white border-transparent shadow-xl shadow-indigo-950/20"
                    }`}>
                      {formatMarkdownText(item.content)}

                      {/* Download Individual AI Prompt Generation as PDF tool */}
                      {isAi && item.id !== "initial" && (
                        <div className="mt-3.5 pt-2 border-t border-indigo-950/20 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              exportNotesToPDF(
                                `Study Guide - ${activeMaterial ? activeMaterial.name : "Lesson details"}`,
                                item.content,
                                activeMaterial ? activeMaterial.name : "Tutoring Dialogue Notes"
                              );
                              showToast("Tutor study guide exported to your PDF file folder!", "success");
                            }}
                            className="bg-[#050812] border border-indigo-500/20 hover:bg-indigo-600 hover:text-white hover:border-transparent text-[9.5px] font-mono py-1 px-3 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                            title="Download these generated notes as a formatted PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Download PDF Notes</span>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <span className={`text-[8.5px] text-slate-550 font-mono block px-1.5 ${isAi ? "text-left" : "text-right"}`}>
                      {item.timestamp}
                    </span>
                  </div>

                </div>
              );
            })}

            {/* AI thinking state spinner */}
            {isThinking && (
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-655 flex items-center justify-center text-sm text-white">
                  👩‍🏫
                </div>
                <div className="max-w-[85%]">
                  <div className="p-4 bg-[#0d1020] border border-indigo-950/50 rounded-2xl flex items-center space-x-2.5 shadow-md">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span className="text-[11px] text-slate-400 italic">Thinking and synthesizing course indexes...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Floating Coach prompt shortcuts (Floating directly inside Chat viewport context) */}
          {activeMaterial && (
            <div className="px-5 py-2 bg-gradient-to-t from-[#0a0d1a] to-transparent flex-shrink-0">
              <div className="flex items-center space-x-2 overflow-x-auto py-1 pr-1 border-b border-indigo-950/15 scrollbar-none no-scrollbar">
                <span className="text-[8px] font-mono font-extrabold text-[#7c88b0] uppercase tracking-wider flex-shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-950">
                  COACH PATHWAYS:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    applyPresetAction("notes");
                    showToast("Coach is drafting complete study notes guide... Please study along!", "info");
                  }}
                  id="preset-notes-btn"
                  className="px-2.5 py-1 text-[9.5px] font-semibold font-mono bg-[#0c122a] text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer flex-shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span>📝 Draft Study Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyPresetAction("summarize");
                    showToast("Syllabus summarizing triggered.", "info");
                  }}
                  id="preset-summarize-btn"
                  className="px-2.5 py-1 text-[9.5px] font-semibold font-mono bg-[#0c122a] text-slate-300 border border-indigo-950 hover:bg-indigo-600 hover:text-white rounded-lg transition-all cursor-pointer flex-shrink-0"
                >
                  <span>🔍 Chapter Summaries</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyPresetAction("quiz");
                    showToast("Quick feedback quiz loaded.", "info");
                  }}
                  id="preset-quiz-btn"
                  className="px-2.5 py-1 text-[9.5px] font-semibold font-mono bg-[#0c122a] text-slate-300 border border-indigo-950 hover:bg-indigo-600 hover:text-white rounded-lg transition-all cursor-pointer flex-shrink-0"
                >
                  <span>❓ Multi-choice Quiz</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyPresetAction("analogy3");
                    showToast("Mapping analogical conceptualization.", "info");
                  }}
                  id="preset-analogy-btn"
                  className="px-2.5 py-1 text-[9.5px] font-semibold font-mono bg-[#0c122a] text-slate-300 border border-indigo-950 hover:bg-indigo-600 hover:text-white rounded-lg transition-all cursor-pointer flex-shrink-0"
                >
                  <span>💡 Relatable Analogy</span>
                </button>
              </div>
            </div>
          )}

          {/* Form input controls section with centered input bar */}
          <div className="p-4 bg-[#0a0d1a] border-t border-indigo-950/20 flex-shrink-0">
            <form onSubmit={handleChatSubmit} className="relative flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={materialsList.length === 0 ? "⚠️ Upload a lecture video link or textbook PDF first..." : !activeMaterial ? "👈 Choose a source file on the left tab to ground your question..." : "Inquire, test, or converse with your study supervisor..."}
                disabled={materialsList.length === 0 || isThinking}
                className="flex-1 bg-[#050812] border-2 border-indigo-950/40 focus:border-indigo-550 focus:border-indigo-600/60 rounded-xl px-4 py-3 text-xs text-white outline-none placeholder-slate-700 disabled:opacity-45 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={materialsList.length === 0 || !activeMaterial || !inputText.trim() || isThinking}
                className="h-10 px-4.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-indigo-950/25 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                title="Send Inquiry"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* SPRING BOOT MICROSERVICES API RUNTIME METRIC WRAPPER (Sleek Collapsible Panel) */}
          <div className="border-t border-indigo-950/30 bg-[#05070e] flex flex-col z-20 flex-shrink-0">
            <div 
              onClick={() => setShowConsole(!showConsole)}
              className="px-5 py-2.5 bg-[#090c17] hover:bg-[#0c1022] border-b border-indigo-950/40 flex items-center justify-between cursor-pointer select-none transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400 mr-1" />
                <span className="text-[9.5px] font-bold font-mono text-slate-300 uppercase tracking-widest flex items-center">
                  <span>Spring Boot Gateway API Console</span>
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-[8.5px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-indigo-950/40">
                  HikariCP Master Node (Active)
                </span>
                {showConsole ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-slate-500 animate-bounce" />
                )}
              </div>
            </div>

            {showConsole && (
              <div className="h-44 overflow-y-auto p-4 font-mono text-[10px] space-y-1 bg-slate-950/95 text-slate-350 leading-relaxed border-b border-indigo-950/20 custom-scroll">
                {springLogs.length === 0 ? (
                  <div className="text-slate-600 italic flex items-center">
                    <Loader2 className="w-3 h-3 text-indigo-500 animate-spin mr-2" />
                    <span>Spinning internal telemetry JVM logging socket stream...</span>
                  </div>
                ) : (
                  springLogs.map((log, i) => {
                    let levelColor = "text-indigo-400";
                    if (log.level === "ERROR") levelColor = "text-red-400 font-bold";
                    if (log.level === "WARN") levelColor = "text-amber-500";
                    if (log.level === "DEBUG") levelColor = "text-slate-500";
                    return (
                      <div key={i} className="flex space-x-2 hover:bg-[#080d1e] py-0.5 px-1.5 rounded transition-colors truncate">
                        <span className="text-slate-650 flex-shrink-0">{log.timestamp}</span>
                        <span className={`[${levelColor}] font-bold w-12 flex-shrink-0 text-center`}>{log.level}</span>
                        <span className="text-indigo-500/80 flex-shrink-0 text-[8.5px] max-w-[150px] truncate">[{log.class}]</span>
                        <span className="text-slate-300 whitespace-pre-wrap">{log.message}</span>
                      </div>
                    );
                  })
                )}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>

        </section>

      </main>

    </div>
  );
}
