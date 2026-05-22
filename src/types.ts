export interface StudyMaterial {
  id: string;
  type: "pdf" | "youtube";
  name: string; // PDF filename or Video Title
  sizeOrDuration: string; // e.g., "1.4 MB" or "12:35"
  uploadedAt: string;
  summary?: string;
  base64?: string; // for PDF
  url?: string; // for YouTube
  videoId?: string; // YT ID
  thumbnailUrl?: string; // YT thumbnail
  author?: string; // YT author
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SpringBootLogLine {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  class: string;
  message: string;
}
