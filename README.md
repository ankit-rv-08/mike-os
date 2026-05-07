<div align="center">

<img src="https://img.shields.io/badge/MIKE%20OS-v1.0-black?style=for-the-badge&labelColor=000000&color=6366f1" />

# ⚡ MIKE OS
### *Run Your Reality.*

**A personal AI operating system for high-performance living.**  
Track performance. Automate decisions. Optimize your life.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mike--os--frontend.vercel.app-6366f1?style=flat-square&logo=vercel)](https://mike-os-frontend.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203-f97316?style=flat-square)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## What is MIKE OS?

MIKE OS is not a productivity app. It's a **personal operating system** — a unified AI-powered environment that replaces scattered tools with a single intelligent interface built around *you*.

Most people use 6–10 different apps to manage their life. MIKE OS collapses them into one: your AI assistant, health tracker, finance dashboard, task system, calendar, and performance analytics — all talking to each other, all powered by the same AI brain.

The goal is simple: **know yourself better, execute faster, live with more intention.**

---

## Modules

| Module | What it does |
|--------|-------------|
| 🧠 **Neural (AI Chat)** | Conversational AI powered by LLaMA 3 via Groq. Ask anything, plan your day, get decisions made. |
| ⚙️ **Core (Dashboard)** | Central command center. Daily life score, streaks, focus time, AI insights — all in one view. |
| 📈 **Vitals (Performance)** | Track sleep, workouts, weight, and consistency. See how your body affects your productivity. |
| 💰 **Capital (Finance)** | Financial tracking, spending insights, and crypto overview. Know where your money goes. |
| 📋 **Execution (Tasks)** | Task and workflow management built for disciplined people who actually ship. |
| 📅 **Calendar** | Schedule intelligence. See your day, plan your week, let MIKE remind you. |
| 📰 **News** | Curated news feed filtered to what matters to you. |
| 📊 **Trading** | Market and crypto insights dashboard. |
| 🎙️ **Voice** | Voice interface for hands-free interaction with MIKE. |

---

## Tech Stack

```
Frontend     →  Next.js 15, React, TypeScript, Tailwind CSS
AI Engine    →  Groq API (LLaMA 3 — fastest inference available)
Deployment   →  Vercel (frontend) + Vercel API Routes (backend)
State        →  React Hooks + Local Storage
Styling      →  Tailwind CSS + shadcn/ui
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Groq API key → [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/ankit-rv-08/mike-os.git
cd mike-os

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at [console.groq.com](https://console.groq.com) — it's free and the fastest LLM inference available.

---

## Roadmap

- [x] Dashboard with daily life score
- [x] AI Chat (MIKE Neural) with Groq/LLaMA
- [x] Performance tracking module
- [x] Finance dashboard
- [x] Calendar integration
- [x] Vercel deployment
- [ ] Persistent memory — MIKE remembers your history
- [ ] Real data inputs — log sleep, workouts, tasks via chat
- [ ] Multi-agent architecture — MIKE executes tasks, not just talks
- [ ] Voice interface (always-on)
- [ ] Mobile optimization
- [ ] User accounts + cloud sync
- [ ] SaaS subscription model

---

## Vision

> *Most AI assistants answer questions. MIKE runs your life.*

The long-term vision for MIKE OS is a **multi-agent personal AI** that:
- Knows your patterns better than you do
- Proactively surfaces what you need before you ask
- Executes tasks across your tools automatically
- Evolves its model of you over time

Think less ChatGPT, more **Jarvis** — an AI that operates as an extension of your executive function.

---

## Project Structure

```
mike-os/
├── app/                    # Next.js app router pages
│   ├── page.tsx            # Dashboard (Core)
│   ├── chat/               # Neural (AI Chat)
│   ├── performance/        # Vitals
│   ├── finance/            # Capital
│   ├── calendar/           # Calendar
│   ├── trading/            # Trading
│   ├── news/               # News feed
│   ├── projects/           # Execution
│   └── voice/              # Voice interface
├── backend/                # API routes + Groq integration
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers
└── styles/                 # Global styles
```

---

## Author

**Ankith RV**  
Full Stack Developer · NITK '27  
Building real products, not just learning.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ankith%20RV-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/ankith-rv-44892b2a9)
[![GitHub](https://img.shields.io/badge/GitHub-ankit--rv--08-181717?style=flat-square&logo=github)](https://github.com/ankit-rv-08)
[![Live](https://img.shields.io/badge/MIKE%20OS-Live%20Demo-6366f1?style=flat-square)](https://mike-os-frontend.vercel.app)

---

## License

MIT — use it, build on it, make it yours.

---

<div align="center">
<sub>Built with focus. Designed for execution. ⚡</sub>
</div>
