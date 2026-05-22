## 📚 DocuMind – AI‑Powered Personal Tutor  

[![GitHub stars](https://img.shields.io/github/stars/your‑username/documind?style=flat&logo=github)](https://github.com/your-username/documind)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)  
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)  

---

### ✨ What is DocuMind?

DocuMind turns any **text material** (books, PDFs, articles) or **video lecture** into an **interactive study session**:

* 📖 **Summaries** – concise, AI‑generated overviews of the content.  
* 🧠 **Grounded Quizzes** – multiple‑choice, fill‑in‑the‑blank, and flash‑card style questions that stay true to the source.  
* 🎯 **Personalised Review** – Adaptive difficulty based on your answers.  

All of this runs locally, powered by the Gemini API, so your data never leaves your machine.

---

### 🎥 Demo (Live)

> **Try it now** – clone the repo, run `npm install` and `npm run dev`. Open `http://localhost:5173` and start uploading PDFs or pasting URLs to your favorite lecture videos.

_(If you’ve deployed to GitHub Pages, replace the link below with your pages URL.)_  
[🚀 Live demo → **documind.pages.dev**](#)

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18+)
* **Git** (for cloning & committing)
* A **Gemini API key** – you can obtain one from the [Google AI Studio console](https://ai.google.dev/).

### Install & Run Locally

```bash
# 1️⃣ Clone the repo
git clone https://github.com/your-username/documind.git
cd documind

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set your Gemini key (create a .env.local file)
echo "GEMINI_API_KEY=YOUR_KEY_HERE" > .env.local

# 4️⃣ Start the dev server
npm run dev
```

Open <http://localhost:5173> and start exploring!

### Build for Production

```bash
npm run build   # creates ./dist
npm run start   # serves the built bundle with Node/Express
```

---

## 📂 Project Structure

```
DocuMind/
├─ src/                  # React + Vite source files
│   ├─ components/       # UI components (Quiz, Summary, Upload, etc.)
│   ├─ hooks/            # Custom hooks for Gemini API calls
│   └─ App.tsx           # Root component
├─ server.ts             # Express server handling Gemini requests
├─ vite.config.ts        # Vite configuration (Tailwind, React)
├─ package.json          # Scripts, dependencies & devDependencies
├─ tsconfig.json         # TypeScript config
├─ .env.example          # Sample .env file
└─ README.md             # ★ YOU ARE HERE ★
```

---

## 🔧 Customisation & Extensibility

| Area | How to extend |
|------|----------------|
| **New content types** | Add parsers under `src/parsers/` (e.g., for audio transcripts). |
| **AI prompts** | Edit the prompt templates in `src/prompts/` to change quiz style or summary length. |
| **Styling** | Tailwind config lives in `tailwind.config.cjs`; modify or add new utilities for a fresh look. |
| **Server‑side logic** | Extend `server.ts` to integrate other LLM providers or add caching. |

---

## 📦 Deployment Options

| Platform | Steps |
|----------|-------|
| **GitHub Pages** *(static UI only)* | `npm run build && git push origin gh-pages` |
| **Vercel / Netlify** | Connect the repo, set `NODE_ENV=production`, provide `GEMINI_API_KEY` as an environment variable. |
| **Docker** | `docker build -t documind . && docker run -p 3000:3000 documind` (see `Dockerfile` in the repo). |

---

## 🛡️ Security & Privacy

* All processing happens **client‑side** or on your **local Node server**; no third‑party data collection.  
* Your **Gemini API key** is stored only in `.env.local` (never committed).  
* Feel free to host the server behind HTTPS or behind a VPN for extra safety.

---

## 📚 Documentation

* **API reference** – `src/api/` contains TypeScript interfaces for Gemini calls.  
* **Component docs** – each component folder includes a `README.md` describing its props and usage.  
* **Contribution guide** – see `CONTRIBUTING.md` for coding standards, linting, and testing.

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repo.  
2. Create a feature branch (`git checkout -b feat/awesome‑feature`).  
3. Run lint & tests (`npm run lint && npm test`).  
4. Open a Pull Request with a clear description of the change.

Read the full guidelines in `CONTRIBUTING.md`.

---

## 📜 License

Distributed under the **MIT License** – see the `LICENSE` file for details.

---

### 🎉 Happy Studying!

*Turn the world’s knowledge into your personal, AI‑enhanced classroom.*  
