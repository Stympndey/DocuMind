<div align="center">
  <img src="https://img.shields.io/badge/DocuMind-AI%20Personal%20Tutor-6C63FF?style=for-the-badge&logo=react&logoColor=white" alt="DocuMind Banner" />
  
  # 📚 DocuMind
  
  ### *Your AI-Powered Personal Study Companion*
  
  <!-- Typing SVG Animation -->
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=Transform+PDFs+into+quizzes;Create+AI+summaries+instantly;Learn+smarter,+not+harder" alt="Typing animation" />
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-latest-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  
  <p align="center">
    <strong>Transform any content into an interactive learning experience</strong>
    <br />
    <a href="#-getting-started">
      <img src="https://img.shields.io/badge/Get%20Started-6C63FF?style=for-the-badge&logo=rocket&logoColor=white" alt="Get Started" />
    </a>
    &nbsp;
    <a href="#-features">
      <img src="https://img.shields.io/badge/Features-4ECDC4?style=for-the-badge&logo=sparkles&logoColor=white" alt="Features" />
    </a>
  </p>
</div>

---

## ✨ Why DocuMind?

> **From Passive Reading to Active Learning**

DocuMind revolutionizes how you learn by transforming any **PDF, article, or text material** into an **interactive study session** — complete with AI-generated summaries, grounded quizzes, and adaptive learning paths. All while keeping your data completely private.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 📖 **Smart Summaries** | AI-generated overviews that capture the essence of your content |
| 🧠 **Grounded Quizzes** | Multiple-choice, fill-in-the-blank, and flashcard questions |
| 🎯 **Adaptive Learning** | Difficulty adjusts based on your performance |
| 🔒 **Privacy First** | All processing happens locally — your data stays yours |
| 🌐 **Multi-Format Support** | Upload PDFs, paste text, or share video URLs |
| ⚡ **Lightning Fast** | Built with React + Vite for instant interactions |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Gemini API Key** ([Get free key](https://ai.google.dev/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Stympndey/DocuMind.git
cd DocuMind

# 2. Install dependencies
npm install

# 3. Set up environment variables
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env.local

# 4. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser and start learning! 🎓

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📂 Project Structure

```
DocuMind/
├── src/
│   ├── components/           # UI components (Quiz, Summary, Upload, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript definitions
│   ├── services/             # API services
│   └── App.tsx               # Root component
├── server/                   # Backend Express server
├── public/                   # Static assets
├── package.json              # Dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation
```

---

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server on localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality |
| `npm run test` | Run tests |

---

## 🎨 Customization

### Theme & Colors

Edit `tailwind.config.js` to customize colors, fonts, and styling:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#6C63FF',
      // ... your colors
    }
  }
}
```

### AI Behavior

Customize Gemini prompts in `src/services/gemini.ts`:

```typescript
const SUMMARY_PROMPT = `Generate a concise summary: ...`;
const QUIZ_PROMPT = `Create 5 questions based on: ...`;
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Add `GEMINI_API_KEY` to environment variables
4. Deploy with one click

### Docker

```bash
docker build -t documind .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key documind
```

---

## 🔐 Security & Privacy

✅ **Zero Data Collection** — All processing is local  
✅ **API Key Protection** — Stored in `.env.local`, never committed  
✅ **No Analytics** — Complete privacy  
✅ **Open Source** — Fully auditable code  

---

## 🤝 Contributing

We'd love your help! Here's how to contribute:

1. **Fork** the repository
2. **Create a branch** — `git checkout -b feat/amazing-feature`
3. **Code** with tests
4. **Lint** — `npm run lint && npm test`
5. **Push** and **create a Pull Request**

### Areas We Need Help

- 🌍 Translations
- 🎨 UI/UX improvements
- 📚 Documentation
- 🐛 Bug fixes
- ✨ New features

---

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Build** | Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js + Express |
| **AI** | Google Gemini API |
| **Package Manager** | npm |

---

## 📜 License

MIT License © 2024 DocuMind — See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) — Powering the intelligence
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) — Foundation
- [Tailwind CSS](https://tailwindcss.com/) — Beautiful styling

---

<div align="center">

### 🌟 Turn the world's knowledge into your personal, AI-enhanced classroom

**[⬆ Back to Top](#-documind)**

</div>
