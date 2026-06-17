<div align="center">
  <img src="https://img.shields.io/badge/DocuMind-AI%20Personal%20Tutor-6C63FF?style=for-the-badge&logo=react&logoColor=white" alt="DocuMind Banner" />
  
  # 📚 DocuMind
  
  ### *Your AI‑Powered Personal Tutor*
  
  <!-- Typing SVG Animation -->
  <a href="https://github.com/your-username/documind">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=Transform+any+PDF+into+quizzes;Turn+YouTube+lectures+into+flashcards;Learn+smarter+with+Gemini+AI;100%25+Private+%26+Local+First" alt="Typing SVG" />
  </a>
  
  [[License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [[Node.js](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [[Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [[React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [[TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [[Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [[Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
  
  <!-- Animated Stats -->
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=your-username&repo=documind&theme=tokyonight&hide_border=true&show_icons=true" />
  
  <p align="center">
    <strong>Transform any content into an interactive learning experience</strong>
    <br />
    <a href="#-getting-started">
      <img src="https://img.shields.io/badge/Get%20Started-6C63FF?style=for-the-badge&logo=rocket&logoColor=white" alt="Get Started" />
    </a>
    &nbsp;
    <a href="#-documentation">
      <img src="https://img.shields.io/badge/Docs-4ECDC4?style=for-the-badge&logo=gitbook&logoColor=white" alt="Documentation" />
    </a>
  </p>
</div>

---

## ✨ Why DocuMind?

> 🚀 **From Passive Reading to Active Learning**

<img align="right" width="400" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJ5cGJ6dGJ6dWJ5cGJ6dGJ6dWJ5cGJ6dGJ6dWJ5cGJ6dA/xT5LMHxhOfscxPfIfm/giphy.gif" alt="AI Learning GIF" />

DocuMind revolutionizes how you learn by turning any **text material** (books, PDFs, articles) or **video lecture** into an **interactive study session** — all while keeping your data private and secure.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 📖 **Smart Summaries** | AI‑generated overviews that capture the essence of your content |
| 🧠 **Grounded Quizzes** | Multiple‑choice, fill‑in‑the‑blank, and flash‑card questions that stay true to the source |
| 🎯 **Adaptive Learning** | Questions that adjust difficulty based on your performance |
| 🔒 **Privacy First** | All processing happens locally — your data never leaves your machine |
| 🌐 **Multi-Format Support** | Upload PDFs, paste text, or share YouTube video URLs |

<br clear="right"/>

---

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Gemini API Key** — Get one from [Google AI Studio](https://ai.google.dev/) (free tier available)

### 💻 Installation

<!-- Animated divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

```bash
# 1⃣ Clone the repository
git clone https://github.com/your-username/documind.git
cd documind

# 2⃣ Install dependencies
npm install

# 3⃣ Set up environment variables
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env.local

# 4⃣ Start the development server
npm run dev
```

Then open `http://localhost:5173` and start uploading your first PDF or pasting a video URL!

### 🚢 Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Or serve with Node.js
npm run start
```

---

<!-- Animated wave divider -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=6C63FF&height=100&section=header" width="100%"/>

## 📂 Project Structure

```
DocuMind/
├── 📁 src/                      # React + Vite source
│   ├── 📁 components/           # UI components
│   │   ├── Quiz/
│   │   ├── Summary/
│   │   ├── Upload/
│   │   └── ...
│   ├── 📁 hooks/                # Custom React hooks
│   │   └── useGemini.ts
│   ├── 📁 utils/                # Utility functions
│   ├── 📁 types/                # TypeScript definitions
│   └── App.tsx                  # Root component
├── 📁 server/                   # Backend server
│   └── server.ts                # Express server
├── 📁 public/                   # Static assets
├── 📄 package.json              # Dependencies & scripts
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 vite.config.ts            # Vite configuration
└── 📄 README.md                 # 📖 You are here
```

---

## 🔧 Customization & Extensibility

<details>
<summary><b>🎨 Click to expand UI Customization</b></summary>

### 🎨 UI Customization

- **Tailwind Configuration**: Edit `tailwind.config.cjs` to change colors, fonts, or add new utilities
- **Theme Switching**: Add dark/light mode with the built-in theme context
- **Component Overrides**: Copy any component to `src/overrides/` for local modifications

</details>

<details>
<summary><b>🤖 Click to expand AI Prompts</b></summary>

### 🤖 AI Prompts

Customize the AI behavior by editing prompt templates in `src/prompts/`:

```typescript
// src/prompts/quiz.ts
export const QUIZ_PROMPT = `
  Generate 5 multiple-choice questions based on the following content:
  {content}
  Difficulty level: {difficulty}
`;
```

</details>

<details>
<summary><b>📦 Click to expand Adding New Content Types</b></summary>

### 📦 Adding New Content Types

1. Create a parser in `src/parsers/`
2. Implement the `ContentParser` interface
3. Register it in `src/parsers/index.ts`

```typescript
// src/parsers/audio.ts
export class AudioParser implements ContentParser {
  parse(file: File): Promise<string> {
    // Your audio-to-text implementation
  }
}
```

</details>

---

## 📦 Deployment Options

### 🌐 Platform-Specific Deployment

| Platform | Method | Notes |
|----------|--------|-------|
| **Vercel** | `vercel deploy` | Automatic preview deployments |
| **Netlify** | Connect GitHub repo | Built-in CI/CD |
| **GitHub Pages** | `npm run deploy` | Static build only |
| **Docker** | `docker build -t documind .` | Containerized deployment |
| **AWS/Cloud** | `npm run build && npm start` | Use with PM2 or similar |

### 🐳 Docker Deployment

```bash
# Build the Docker image
docker build -t documind .

# Run the container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key documind
```

---

## 🛡 Security & Privacy

### 🔐 Our Commitment

- **Zero Data Collection**: All processing occurs locally or on your own Node.js server
- **API Key Protection**: Keys are stored in `.env.local` and never committed to version control
- **No External Tracking**: No analytics or telemetry — your learning stays private
- **HTTPS Ready**: Deploy behind HTTPS for secure communication
- **Open Source**: Fully auditable code — you can review every line

---

## 📚 Documentation

### 📖 API Reference

- **Gemini API Integration** — `src/api/gemini.ts` contains all TypeScript interfaces
- **Component Library** — Each component includes comprehensive JSDoc comments
- **Custom Hooks** — Reusable logic for Gemini calls, file handling, and state management

### 🔍 In-Depth Guides

- [Contributing Guide](CONTRIBUTING.md) — Standards, linting, and testing
- [Code of Conduct](CODE_OF_CONDUCT.md) — Community guidelines
- [Changelog](CHANGELOG.md) — Version history and updates

---

## 🤝 Contributing

We ❤ contributions! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🌿 **Create a feature branch**
   ```bash
   git checkout -b feat/amazing-feature
   ```
3. 💻 **Write your code** (with tests!)
4. ✅ **Run tests & linting**
   ```bash
   npm run lint && npm test
   ```
5. 📝 **Update documentation**
6. 🚀 **Open a Pull Request**

### 🎯 Areas We Need Help

- 🌍 **Translations** — Make DocuMind available in more languages
- 🎨 **UI/UX Improvements** — Design new components or themes
- 📚 **Documentation** — Write tutorials and guides
- 🐛 **Bug Fixes** — Help us squash issues

<!-- Contribution snake animation -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake.svg">
  <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake.svg">
</picture>

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) — Powering the intelligence behind DocuMind
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) — The foundation of our UI
- [Tailwind CSS](https://tailwindcss.com/) — Beautiful, utility-first styling

---

<div align="center">

### 🌟 **Turn the world's knowledge into your personal, AI‑enhanced classroom**

<!-- Animated footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=6C63FF&height=120&section=footer&text=Star%20this%20repo%20if%20you%20like%20it!&fontSize=24&fontColor=ffffff&animation=twinkling" width="100%"/>

**[⬆ Back to Top](#-documind)**

</div>
```

**Changes made:**
1. Removed entire `## 🎥 Demo` section
2. Removed "Live Demo" button from the header
3. Moved the `localhost:5173` instruction into Getting Started so people still know how to run it

Want me to swap the placeholder `your-username/documind` with your actual repo link too?
