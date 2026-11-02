# 🚀 Menguasai AI: Panduan Lengkap Prompt & Context Engineering

Website tutorial interaktif, mewah, dan komprehensif tentang cara menggunakan Artificial Intelligence (AI) secara profesional. Dibangun dengan desain modern, tipografi kuat, non-AI-slop, mengusung palet warna utama **Royal Blue (`#0000FF`)**, background putih bersih (`#FFFFFF`), dan teks hitam pekat (`#111111`).

---

## 🌟 Fitur Utama & Materi Pembelajaran

### 1. 🎯 RACE Framework (Prompt Engineering)
- **Role**: Mengkondisikan persona, domain prior, dan tingkat senioritas AI.
- **Action**: Perintah kata kerja operasional yang decisive dan terukur.
- **Context**: Grounding lingkungan teknis, target audience, dan data input.
- **Expectation**: Output schema, standar kualitas, dan *negative constraints*.
- **5 Contoh Prompt Real-World Interaktif**: Coding (Refactoring Express/TypeScript), Writing (Executive Incident Comms), Data Analysis (SaaS Churn Cohort), UX Design (Fintech Onboarding Flow), dan SRE Problem Solving (Distributed Deadlock RCA).
- **6 Kesalahan Umum & Solusinya**: Flattery fallacy, action bloat, context starvation, dll.

### 2. 🧠 Context Engineering
- **Prompt Engineering vs Context Engineering**: Tabel komparasi mendalam (fokus, temporalitas, sistem, artefak).
- **5 Pilar Context Engineering**: Context Window Management, Retrieval Augmented Generation (RAG), Memory Systems, Tool Use, Structured Context.
- **Teknik Lanjutan**: Context Compression (LLMLingua), Hierarchical Context (RAPTOR), Dynamic Context Selection (JIT), dan Context Caching.
- **Contoh Realistis Structured Context**: Menggunakan semantic delimiters (XML tags).

### 3. ⚡ Teknik Prompting Lanjutan
- **Chain of Thought (CoT)**: Zero-shot CoT, Few-shot CoT, Tree of Thoughts (ToT), dan siklus ReAct (Reason + Act).
- **Few-Shot vs Zero-Shot**: Analisis komparatif, panduan kapan menggunakannya, dan aturan pemilihan *exemplars*.
- **Optimal System Prompt**: Blueprint arsitektur system prompt production-ready dengan 5 blok hierarkis.

### 4. 💡 AI Skills
- **Tools ("Tangan") vs Skills ("Otak")**: Perbedaan mendasar antara atomic tools dengan procedural skills.
- **8 Kategori AI Skills**: Code Generation, Analysis & Research, Creative Writing, Data Processing, Reasoning, Communication, UI/UX Design, dan Automation.
- **Chaining Workflow**: Contoh nyata kolaborasi multi-skill end-to-end (Security Audit → Code Gen → Unit Test → PR Writer).

### 5. 🔌 AI Connectors & Model Context Protocol (MCP)
- **3 Kemampuan Kritis Connector**: Perception, Actionability, Grounding.
- **Ragam Connector**: MCP Servers, REST/GraphQL APIs, Plugins/Extensions, Database Connectors, File Systems, dan Communication Bridges.
- **Model Context Protocol (MCP) Deep Dive**: Arsitektur Host ↔ Client ↔ Server, 3 primitif protokol (*Resources*, *Tools*, *Prompts*), serta contoh file konfigurasi JSON.
- **Best Practices**: Principle of least privilege, schema minimization, idempotency, dan rate limiting.

### 6. 🎛️ Parameter Tuning
- **Temperature Scale**: Visualisasi rentang 0.0 (Deterministic) hingga 2.0 (Chaotic).
- **Tabel Rekomendasi per Use Case**: Coding, JSON Extraction, Root Cause Analysis, Technical Writing, Creative Brainstorming.
- **Parameter Lainnya**: Top-P (Nucleus Sampling), Presence Penalty, Frequency Penalty, Max Tokens.

---

## 🎨 Design System & Animasi

- **Palet Warna**:
  - Primary Accent: `#0000FF` (Royal Blue)
  - Background: `#FFFFFF` (Pure White) & `#F8F9FD` (Soft Secondary White)
  - Text: `#111111` (Deep Charcoal Black) & `#444444` (Neutral Secondary)
- **Interactive Motion**:
  - Scroll Progress Bar di bagian teratas.
  - Typing Effect dinamis pada Hero Title.
  - Floating Neural Particles Canvas (50 partikel interaktif terhubung dengan dynamic distance-based line opacity).
  - Parallax Background Effect 60fps dengan GPU acceleration.
  - Scroll Reveal Animations (IntersectionObserver) dengan dukungan stagger delays.
  - Expandable Accordion Cards dengan perhitungan dynamic height.
  - Interactive Tab Switching (RACE Examples & Advanced Techniques).
  - One-Click Clipboard Copy dengan real-time feedback state.
  - Smooth Animated Numeric Counters.
  - Responsive Mobile Navigation dengan hamburger drawer.

---

## 📂 Struktur Berkas

```
004.Anti_Gravity_002_Project_Cara_Penggunaan_AI/
├── index.html          # Halaman utama tutorial single-page
├── README.md           # Dokumentasi repositori
├── css/
│   └── style.css       # Design system lengkap, variabel, & responsivitas
├── js/
│   └── main.js         # Engine interaktivitas vanilla JS (zero dependencies)
└── assets/
    ├── hero-bg.jpg     # Background neural network abstrak biru & putih
    ├── brain-bg.jpg    # Background geometric brain node network
    └── wave-bg.jpg     # Background flowing data waves royal blue
```

---

## 💻 Cara Menjalankan

Karena web ini dibangun murni menggunakan standar web modern (**HTML5**, **CSS3**, **Vanilla JavaScript ES6+**) tanpa framework build step, Anda dapat langsung membukanya di browser:

### Opsi 1: Buka Langsung
Cukup klik ganda berkas `index.html` atau buka melalui browser pilihan Anda.

### Opsi 2: Local HTTP Server (Python)
```bash
# Di dalam direktori project:
python3 -m http.server 8080
```
Buka `http://localhost:8080` di browser Anda.

---

## 📝 Lisensi & Kredit

Dibuat sebagai bagian dari **Anti Gravity Project 002: Cara Penggunaan AI**. Seluruh hak cipta dilindungi. Bebas digunakan untuk keperluan edukasi dan pengembangan profesional.
