export const ARCHITECTURE_SPEC = {
  version: '1.0.0-Phase1-MVP',
  productName: 'CodexNova',
  tagline: 'Next-Generation 3D Cloud Compiler & AI Learning IDE',
  market: 'India + Global (Students, Competitive Programmers, Engineering Teams)',
  noGptGuarantee: 'Strictly zero OpenAI/GPT dependencies. Powered by Google Gemini 3.8 / Anthropic Claude API / Self-hosted Qwen2.5-Coder.',
  
  techStack: [
    {
      layer: 'Frontend & UI',
      technologies: 'React 19, TypeScript, Tailwind CSS v4, Monaco Editor, Lucide Icons',
      rationale: 'Sub-second responsiveness, native VS Code editing experience with syntax trees, zero-pill aesthetic design system.',
    },
    {
      layer: '3D Graphics & Canvas',
      technologies: 'Three.js (r160+), RoomEnvironment, ACESFilmicToneMapping, Software-WebGL Guard',
      rationale: 'Interactive 3D compiler core and code particle field without frame drops or memory leaks; graceful fallback on headless/mobile.',
    },
    {
      layer: 'Backend & Orchestration',
      technologies: 'Node.js / Express, Piston Engine RPC, Redis / In-Memory State Cache',
      rationale: 'Ultra-fast cold starts (<300ms), isolated execution queue, server-side secret proxy protecting AI credentials.',
    },
    {
      layer: 'AI Intelligence (NO GPT)',
      technologies: 'Google Gemini 3.8 Flash SDK (@google/genai) with Anthropic Claude & Qwen-Coder Adapter Layer',
      rationale: 'Instant error diff calculation, multi-lingual Hinglish/English concept breakdown, zero training on user code.',
    },
    {
      layer: 'Execution Sandboxing',
      technologies: 'Piston Multi-Tenant Sandbox / gVisor runsc / Linux cgroups v2 / seccomp filters',
      rationale: 'Hard kernel-level boundary preventing fork bombs, container escapes, crypto mining, and network egress.',
    },
    {
      layer: 'Offline & PWA Roadmap',
      technologies: 'Service Worker, IndexedDB caching, Pyodide (WASM Python), QuickJS / JS WASM, SQLite WASM',
      rationale: 'Full local execution for Python/JS/SQL without internet; seamless transition when connectivity drops.',
    },
  ],

  folderStructure: `
codexnova/
├── index.html                   # HTML entry with font preconnects & SEO metadata
├── metadata.json                # AI Studio capability registry (SERVER_SIDE_GEMINI_API)
├── package.json                 # Dependency & build script definitions
├── server.ts                    # Full-Stack Express server with /api/execute & /api/ai routes
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root state coordinator (IDE vs 3D Landing view)
│   ├── index.css                # Tailwind CSS v4 styles & custom scrollbars
│   ├── types/
│   │   └── compiler.ts          # Core TypeScript types for compiler & AI responses
│   ├── config/
│   │   ├── languages.ts         # 12+ language configs, boilerplates & algorithms
│   │   └── architecture.ts      # Production blueprints, security invariants & roadmap
│   ├── services/
│   │   ├── executionService.ts  # Client-side API caller with local fallback
│   │   └── aiService.ts         # Structured AI error-fixing and concept analysis client
│   └── components/
│       ├── ThreeHero.tsx        # 3D interactive procedural compiler core & particle field
│       ├── Header.tsx           # Language picker, theme selector, Run & AI action buttons
│       ├── EditorPane.tsx       # Monaco Editor with multi-theme support & minimap
│       ├── ConsolePane.tsx      # Terminal output, Stdin interactive panel, stats & diffs
│       ├── AIFixModal.tsx       # Side-by-side diff view & one-click apply fix modal
│       ├── ExplainModal.tsx     # Concept cards, line-by-line guide (English/Hinglish)
│       ├── DownloadModal.tsx    # Source, output, ZIP & PDF/HTML report exports
│       └── ArchitectureModal.tsx# Interactive interactive architecture & roadmap visualizer
`,

  mermaidDiagram: `graph TD
    Client["Client Browser (React 19 + Monaco + Three.js)"]
    SW["Service Worker & IndexedDB (Offline Cache)"]
    WASM["WASM Runtimes (Pyodide, SQLite, QuickJS)"]
    API["Express Gateway /api/* (Node.js)"]
    Piston["Piston Execution Engine (Multi-Tenant)"]
    gVisor["gVisor / Isolate Sandbox (cgroups v2, no network)"]
    AI["AI Reasoning Gateway (Gemini 3.8 Flash / Claude)"]

    Client -->|Online Code & Stdin| API
    Client -.->|Offline Run (Python/JS/SQL)| WASM
    Client <-->|Cache & Session Sync| SW
    API -->|Sanitized Run Job| Piston
    Piston -->|Isolate Container| gVisor
    gVisor -->|stdout/stderr, exitCode, ms| Piston
    Piston -->|Execution Stream| API
    API -->|Render Output & Stats| Client
    API <-->|Error Analysis & Hinglish Concepts| AI`,

  securityGuards: [
    {
      title: 'Fork Bomb Defense',
      description: 'Strict PID limit (pids.max = 64) via cgroups v2 kills processes immediately upon excessive thread/process spawning.',
    },
    {
      title: 'Memory & Resource Bombs',
      description: 'Hard memory ceiling (256MB) per job. OOM-killer instantly terminates processes exceeding limit without host starvation.',
    },
    {
      title: 'Infinite Loop Watchdog',
      description: 'Hard CPU wall-clock limit (8 seconds for execution, 10 seconds for compilation) via SIGKILL timer.',
    },
    {
      title: 'Zero Network Egress',
      description: 'Network namespace unshared with no route to internet; sandbox cannot open sockets, prevent crypto miners or exfiltration.',
    },
    {
      title: 'Read-Only File System',
      description: 'Root filesystem mounted RO; ephemeral tmpfs limited to 16MB for compilation artifacts and cleaned immediately.',
    },
  ],
};
