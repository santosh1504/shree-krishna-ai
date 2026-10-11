# Shree Krishna AI 🪷

> Compassionate spiritual guidance and life reflection inspired by Shree Krishna's teachings in the Bhagavad Gita.

A complete, full-stack web application where anyone can bring personal burdens (anxiety, career burnout, heartbreak, family pressure, grief, moral dilemmas) and receive grounded, compassionate guidance rooted in authentic Sanskrit scripture.

---

## ✨ Features

- **11-Step Compassionate Reflection**: Every response follows a structured, empathetic format (warm validation, verified Sanskrit shloka in Devanagari, transliteration, English translation, everyday explanation, practical next steps, pitfalls to avoid, and concluding blessing).
- **701 Verified Bhagavad Gita Verses**: Bundled with all 18 chapters and authentic translations from respected scholars (*Swami Sivananda*, *Swami Gambhirananda*, *Swami Ramsukhdas*). Zero hallucinated verses.
- **Dual-Engine Flexibility**:
  - **Dynamic AI Mode**: Connects to Google's Gemini API when `GEMINI_API_KEY` is provided.
  - **Self-Contained Local Mode**: Operates 100% offline and locally without requiring any API key or subscription.
- **Privacy by Design**: No accounts, no logins, no persistent tracking, and zero database storage of private confessions.
- **Universal Deployment**: Can run as a full-stack Node.js server or as a static site on Vercel, Netlify, or Render.

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/<your-username>/shree-krishna-ai.git
cd shree-krishna-ai
npm install
```

### 2. Run Locally

```bash
# Start full-stack server (Frontend + API at http://localhost:3001)
npm start

# Or run Vite dev server with live hot-reloading
npm run dev
```

### 3. Optional: Enable Gemini Generative AI

To enable dynamic generative synthesis using Google's Gemini API:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
npm start
```

*(If omitted, the application seamlessly runs in authentic local scripture synthesis mode).*

---

## 📦 Project Structure

```
├── public/               # Static assets & verified Gita data (chapters, verses)
├── server/               # Full-stack Node.js server & scripture retrieval engine
│   ├── index.js          # API server entrypoint
│   ├── guidanceEngine.js # 11-step compassionate spiritual synthesis
│   └── retrieval.js      # Semantic verse search & ranking
├── src/
│   ├── components/       # Reusable UI cards, navbar, footer, dilemma grid
│   ├── pages/            # Home, Guidance chamber, Gita Explorer, About, Sources, Privacy
│   ├── services/         # Universal API client with automatic offline fallback
│   └── types/            # TypeScript type contracts
└── vite.config.ts        # Vite build configuration
```

---

## 🕊️ Ethical Boundary & Spiritual Notice

Shree Krishna AI is an educational and reflective tool designed to make the wisdom of the Bhagavad Gita accessible for everyday contemplation. It is an artificial intelligence application and does not possess divine personhood, supernatural authority, or replace professional psychiatric, medical, financial, or legal counsel.

---

## 📄 License

MIT License. Open for educational, cultural, and spiritual exploration.
