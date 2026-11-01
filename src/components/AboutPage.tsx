import React, { useState } from 'react';
import { 
  GraduationCap, 
  Code2, 
  Terminal, 
  Sparkles, 
  Globe, 
  Mail, 
  ExternalLink, 
  FileDown, 
  Award, 
  Send, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

interface AboutPageProps {
  onBackToIDE: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToIDE }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Spam defense
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.honeypot) {
      // Honeypot triggered, silently discard spam
      return;
    }
    setFormSubmitted(true);
  };

  const handleDownloadResume = () => {
    const resumeText = `PAWAN SINGH
Full-Stack Developer | AI Builder
Email: pawan9140582015@gmail.com
Education: B.Tech CSE, Delhi Technical Campus (DTC), GGSIPU (Graduation 2028, CGPA: 9.16)
Profiles:
- GitHub: https://github.com/pawan00207
- LinkedIn: https://www.linkedin.com/in/pawan-singh-555423322/
- LeetCode: https://leetcode.com/u/pawansingh2005/
- HackerRank: https://www.hackerrank.com/profile/pawan_cse24
- X (Twitter): https://x.com/pawansi84184129
- Instagram: @up_rajjput_78

TECHNICAL SKILLS:
Languages: Python, C++, TypeScript, JavaScript, SQL, C, Bash, Go
Frameworks & Libraries: React 19, Node.js, Express, Three.js, Tailwind CSS, Monaco Editor
Infrastructure & Cloud: Docker, gVisor, Linux Containers, cgroups v2, Redis, PostgreSQL
AI & Pedagogy: Google Gemini SDK (@google/genai), Prompt Engineering, Semantic Code Parsers

FEATURED PROJECTS:
1. CodexNova: Next-Gen 3D Cloud Compiler & AI Learning IDE
   - Zero cold-start execution for 10+ languages with gVisor isolation
   - Built-in AI error fixer with unified diffs and Hinglish concept explainer
2. Algorithmic Problem Solving & Micro-Services Architecture

ACHIEVEMENTS:
- Academic Excellence: 9.16/10 CGPA at Delhi Technical Campus, GGSIPU
- Active Competitive Programmer on LeetCode & HackerRank
`;
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Pawan_Singh_Resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-y-auto font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Top Breadcrumb & Return to IDE */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBackToIDE}
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <span>← Back to Cloud Compiler</span>
            </button>
            <div className="text-xs text-slate-400 font-mono">
              SOLO FOUNDER PROFILE · 2026
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Avatar & Badges */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-1 shadow-2xl shadow-cyan-500/20">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-3xl font-extrabold text-white font-['Space_Grotesk']">
                    PS
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-semibold shadow-lg">
                  CGPA 9.16
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                Pawan Singh
              </h1>
              <div className="text-sm text-cyan-400 font-medium mt-1">
                Full-Stack Developer | AI Builder
              </div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Delhi Technical Campus (DTC), GGSIPU · '28</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  onClick={handleDownloadResume}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </button>

                <a
                  href="mailto:pawan9140582015@gmail.com"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email Me</span>
                </a>
              </div>
            </div>

            {/* Founder Tagline & Bio */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider mb-1">
                  Tagline
                </div>
                <p className="text-lg text-slate-100 font-semibold italic">
                  "A B.Tech CSE student building fast, secure, AI-powered tools for developers and learners."
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-indigo-400 font-mono uppercase tracking-wider mb-2">
                  My Story & Mission
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  "I'm Pawan Singh, a B.Tech CSE student at Delhi Technical Campus (DTC), GGSIPU, graduating in 2028, with a CGPA of 9.16. I build full-stack and AI-powered products, and I created this platform to make coding faster, easier to understand, and accessible to everyone, online and offline."
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mt-3">
                  Frustrated by the clunky ads, 10-second cold starts, broken stdin inputs, and generic AI errors in legacy compilers like JDoodle and OneCompiler, I set out as a solo founder to engineer an uncompromised solution: a 3D hardware-accelerated interface, sub-100ms execution, and pedagogical concept explanations in conversational English and Hinglish.
                </p>
              </div>

              {/* Verified Profiles - Clean Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <a
                  href="https://github.com/pawan00207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">GitHub</div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://www.linkedin.com/in/pawan-singh-555423322/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">LinkedIn</div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://leetcode.com/u/pawansingh2005/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">LeetCode</div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://www.hackerrank.com/profile/pawan_cse24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">HackerRank</div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://x.com/pawansi84184129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">X (Twitter)</div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://instagram.com/up_rajjput_78"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">Instagram</div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Education & Core Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-4 text-cyan-400 font-semibold text-sm font-['Space_Grotesk']">
              <GraduationCap className="w-5 h-5" />
              <span>Academic Credentials</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-base font-bold text-white">
                  Bachelor of Technology in Computer Science & Engineering
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Delhi Technical Campus (DTC), Guru Gobind Singh Indraprastha University (GGSIPU)
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  Expected Graduation: 2028 · Status: Active Full-Time
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Cumulative GPA (CGPA)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">9.16 / 10.0</span>
              </div>
            </div>
          </div>

          {/* Technical Skills Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-4 text-indigo-400 font-semibold text-sm font-['Space_Grotesk']">
              <Code2 className="w-5 h-5" />
              <span>Technical Repertoire</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block font-mono text-[11px] mb-1">LANGUAGES</span>
                <div className="text-slate-200">
                  Python, C++, TypeScript, JavaScript, SQL, C, Bash, Go, Java
                </div>
              </div>
              <div>
                <span className="text-slate-400 block font-mono text-[11px] mb-1">FRAMEWORKS & ARCHITECTURE</span>
                <div className="text-slate-200">
                  React 19, Node.js, Express, Three.js, Tailwind CSS v4, Monaco Editor
                </div>
              </div>
              <div>
                <span className="text-slate-400 block font-mono text-[11px] mb-1">SANDBOXING & INFRASTRUCTURE</span>
                <div className="text-slate-200">
                  gVisor (runsc), cgroups v2, Docker, Redis, PostgreSQL, Piston Engine
                </div>
              </div>
              <div>
                <span className="text-slate-400 block font-mono text-[11px] mb-1">AI & PEDAGOGY</span>
                <div className="text-slate-200">
                  Google Gemini SDK (@google/genai), AST Code Analysis, Multilingual Hinglish Tutoring
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-4 text-emerald-400 font-semibold text-sm font-['Space_Grotesk']">
              <Cpu className="w-5 h-5" />
              <span>Key Projects Built</span>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-cyan-500 pl-3">
                <div className="text-sm font-semibold text-white">CodexNova Cloud Compiler & IDE</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Next-generation cloud compiler with gVisor sandbox isolation, 3D WebGL core, Monaco editor, and zero-cold-start execution for 10+ languages.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3">
                <div className="text-sm font-semibold text-white">AI Concept Explainer (Hinglish Pedagogue)</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Deep pedagogical engine that deconstructs time/space complexity, invariant logic, and translates dense algorithms into conversational Indian developer vernacular.
                </p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-sm font-semibold text-white">Kernel Sandboxing & Fork Bomb Watchdog</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Linux cgroups v2 and SIGKILL watchdog service protecting multi-tenant nodes against recursive memory and process denial-of-service attacks.
                </p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-4 text-amber-400 font-semibold text-sm font-['Space_Grotesk']">
              <Award className="w-5 h-5" />
              <span>Achievements & Certifications</span>
            </div>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white text-xs">Top Academic Distinction</div>
                <div className="text-slate-400 mt-0.5">Maintained 9.16 CGPA across CSE coursework at Delhi Technical Campus (GGSIPU).</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white text-xs">LeetCode & HackerRank Continuous Practice</div>
                <div className="text-slate-400 mt-0.5">Proficient in Data Structures, Dynamic Programming, and Graph traversal algorithms.</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white text-xs">Open Source & Community Mentorship</div>
                <div className="text-slate-400 mt-0.5">Actively building open tools to democratize computer science education for student developers across India.</div>
              </div>
            </div>
          </div>
        </div>

        {/* About the Product Section */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider mb-2">
            About CodexNova
          </div>
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-3">
            Product Mission & Changelog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 mt-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-cyan-300 mb-1">Our Mission</div>
              <p className="text-slate-400 leading-relaxed">
                Democratize world-class coding tools without annoying ads, paywalled basic stdin, or confusing error messages.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-indigo-300 mb-1">Our Vision</div>
              <p className="text-slate-400 leading-relaxed">
                Empower 100,000+ students and developers across India and globally to master algorithms with 3D visuals and AI guidance.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-emerald-300 mb-1">v1.0.0 MVP Changelog</div>
              <p className="text-slate-400 leading-relaxed">
                Launched 10+ core languages, Monaco editor, gVisor sandboxing, AI Fix with unified diffs, and offline export capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Contact Form (with Spam Protection) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Get in Touch with Pawan
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Have feedback, collaboration ideas, or want to deploy CodexNova in your institution?
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-semibold text-emerald-200">Message Dispatched Successfully!</div>
                <p className="text-xs text-slate-300">
                  Thanks for reaching out! I will review your message and reply to <span className="font-mono text-cyan-300">{contactForm.email}</span> shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Honeypot hidden input for spam defense */}
                <input
                  type="text"
                  name="honeypot"
                  value={contactForm.honeypot}
                  onChange={(e) => setContactForm({ ...contactForm, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="e.g. Campus Partnership / Bug Report / Feature Request"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write your note here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Pawan</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>
            Crafted with passion by <strong className="text-slate-300">Pawan Singh</strong> · Delhi Technical Campus, GGSIPU
          </p>
          <p className="mt-1">
            CodexNova Engine · India DPDP Act 2023 & GDPR Compliant
          </p>
        </div>
      </div>
    </div>
  );
};
