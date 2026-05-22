const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF({ unit: 'pt', format: 'a4' });
const margin = 40;
let y = margin;
const lineHeight = 14;

const content = `## 📦 Project Overview

**Name**: DocuMind – PDF / YouTube Tutor
**Purpose**: A lightweight web‑app that lets a student upload a PDF (lecture notes, textbook chapters, etc.) **or** paste a YouTube video URL, then converse with an AI‑powered study‑tutor. The tutor is backed by Google Gemini (gemini‑3.5‑flash) and can answer questions, give references, and keep a small “Spring‑Boot‑style” log stream for a premium‑look‑and‑feel.

### Core Technologies
| Layer | Tech | Why it’s used |
|-------|------|----------------|
| Runtime | Node.js (v20+), TypeScript | Modern async I/O, static typing, easy tooling |
| Server | Express | Minimal HTTP API layer |
| AI | @google/genai (Google Gemini) | Generates welcome summaries, Q&A, reference links |
| Frontend | React 19, Vite, @vitejs/plugin‑react, Tailwind CSS, Tailwind‑vite | Fast dev server, utility‑first styling |
| Build / Run | tsx (runs TS/JS directly), npm scripts (npm run dev) | No extra compile step needed for dev |
| Environment | dotenv | Loads GEMINI_API_KEY and APP_URL from .env |
| Utilities | fetch, jsPDF, Lucide‑React icons, motion (Framer Motion) | Enhances UI & network calls |
| Dev‑only | eslint / tsc (via npm run lint) | Code quality & type checking |

### Project Structure (high‑level)
```
DocuMindv2/
├─ .env                # GEMINI_API_KEY, APP_URL
├─ index.html          # Entry point for Vite SPA
├─ src/                # React frontend (components, routes, Tailwind config)
├─ server.ts           # Express API + Gemini integration
├─ package.json        # Scripts, deps, devDeps
├─ tsconfig.json
└─ node_modules/
```

### Runtime Workflow
1. **Start** – `npm run dev` launches Vite (middleware) **and** the Express server on port 3000.
2. **UI** – React SPA shows upload forms, material list, and chat area.
3. **PDF Upload** – Stores base64, optionally calls Gemini for a welcome summary.
4. **YouTube URL** – Extracts video ID, fetches oEmbed metadata, optionally calls Gemini.
5. **Chat/Q&A** – Sends material context + user message to Gemini, returns answer with encouragement and two thinking‑cues.
6. **Logs & Status** – `/api/config-status` shows Gemini readiness, `/api/spring-logs` streams simulated logs.
7. **Cleanup** – `/api/clear` wipes all in‑memory materials.

### Design & UX Highlights
- Glassmorphism & Dark Mode via Tailwind utilities.
- Framer Motion animations for cards & buttons.
- Lucide icons for clean SVG UI.
- Dynamic reference footer with live W3Schools / GeeksforGeeks links.
- Spring‑Boot‑style log panel for a developer‑oriented feel.

You can now explore the UI at http://localhost:3000, upload a document or video link, and start a tutoring conversation.
`;

const paragraphs = content.split('\n');
paragraphs.forEach(p => {
  const lines = doc.splitTextToSize(p, 515);
  lines.forEach(line => {
    doc.text(line, margin, y);
    y += lineHeight;
    if (y > 770) { // new page
      doc.addPage();
      y = margin;
    }
  });
  y += lineHeight; // extra space after paragraph
});

const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync('project_overview.pdf', Buffer.from(pdfBytes));
console.log('PDF generated: project_overview.pdf');
