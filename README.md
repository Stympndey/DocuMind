<div align="center">
  <img src="https://img.shields.io/badge/DocuMind-AI%20Personal%20Tutor-6C63FF?style=for-the-badge&logo=react&logoColor=white" alt="DocuMind Banner" />
  
  # 📚 DocuMind
  
  ### *Your AI‑Powered Personal Tutor*
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
  
  <p align="center">
    <strong>Transform any content into an interactive learning experience</strong>
    <br />
    <br />
    <a href="#-getting-started"><strong>Get Started »</strong></a>
    &nbsp;&nbsp;&nbsp;
    <a href="#-demo"><strong>Live Demo</strong></a>
    &nbsp;&nbsp;&nbsp;
    <a href="#-documentation"><strong>Documentation</strong></a>
  </p>
</div>

---

## ✨ Why DocuMind?

> 🚀 **From Passive Reading to Active Learning**

DocuMind revolutionizes how you learn by turning any **text material** (books, PDFs, articles) or **video lecture** into an **interactive study session** — all while keeping your data private and secure.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 📖 **Smart Summaries** | AI‑generated overviews that capture the essence of your content |
| 🧠 **Grounded Quizzes** | Multiple‑choice, fill‑in‑the‑blank, and flash‑card questions that stay true to the source |
| 🎯 **Adaptive Learning** | Questions that adjust difficulty based on your performance |
| 🔒 **Privacy First** | All processing happens locally — your data never leaves your machine |
| 🌐 **Multi-Format Support** | Upload PDFs, paste text, or share YouTube video URLs |

---

## 🎥 Demo

### **Try it instantly**

```bash
git clone https://github.com/your-username/documind.git
cd documind
npm install && npm run dev
```

Then open `http://localhost:5173` and start uploading your first PDF or pasting a video URL!

### **Live Preview**

> 🚀 **[Live Demo → documind.pages.dev](https://documind.pages.dev)**

---

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Gemini API Key** — Get one from [Google AI Studio](https://ai.google.dev/) (free tier available)

### 💻 Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/documind.git
cd documind

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env.local

# 4️⃣ Start the development server
npm run dev
```

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

### 🎨 UI Customization

- **Tailwind Configuration**: Edit `tailwind.config.cjs` to change colors, fonts, or add new utilities
- **Theme Switching**: Add dark/light mode with the built-in theme context
- **Component Overrides**: Copy any component to `src/overrides/` for local modifications

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

## 🛡️ Security & Privacy

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

We ❤️ contributions! Here's how you can help:

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

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) — Powering the intelligence behind DocuMind
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) — The foundation of our UI
- [Tailwind CSS](https://tailwindcss.com/) — Beautiful, utility-first styling
- All our [contributors](https://github.com/your-username/documind/graphs/contributors) — Thank you! 🎉

---

## 📬 Contact & Community

- 🐛 **Report issues**: [GitHub Issues](https://github.com/your-username/documind/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/documind/discussions)
- 📧 **Email**: documind@example.com
- 🐦 **Twitter**: [@documind](https://twitter.com/documind)

---

<div align="center">

### 🌟 **Turn the world's knowledge into your personal, AI‑enhanced classroom**

**[⬆ Back to Top](#-documind)**

</div>
