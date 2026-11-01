import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SelectedWorks, { Project } from './components/SelectedWorks';
import Journal, { JournalArticle } from './components/Journal';
import Explorations, { ExplorationItem } from './components/Explorations';
import Stats from './components/Stats';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import JournalModal from './components/JournalModal';
import LightboxModal from './components/LightboxModal';
import ResumeModal from './components/ResumeModal';
import ContactModal from './components/ContactModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import CompilerIDE from './components/CompilerIDE';
import { AboutPage } from './components/AboutPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FOUNDER_ADMIN } from './services/userService';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // View state: 'ide' | 'landing' | 'about' | 'admin'
  const [currentView, setCurrentView] = useState<'ide' | 'landing' | 'about' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#landing' || hash === '#home') return 'landing';
      if (hash === '#about') return 'about';
      if (hash === '#admin') return 'admin';
      if (hash === '#ide' || hash === '#compiler') return 'ide';
    }
    // Default to 'ide' so the user immediately has their compiler active
    return 'ide';
  });

  // Modal states for Landing Page
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<ExplorationItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Sync hash when view changes
  const handleViewChange = (view: 'ide' | 'landing' | 'about' | 'admin') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view === 'ide' ? 'compiler' : view;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#landing' || hash === '#home') setCurrentView('landing');
      else if (hash === '#about') setCurrentView('about');
      else if (hash === '#admin') setCurrentView('admin');
      else if (hash === '#ide' || hash === '#compiler') setCurrentView('ide');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 1. If currently in About view
  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <AboutPage onBackToIDE={() => handleViewChange('ide')} />
      </div>
    );
  }

  // 2. If currently in Admin view
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <AdminDashboard
          currentUser={FOUNDER_ADMIN}
          onBackToIDE={() => handleViewChange('ide')}
        />
      </div>
    );
  }

  // 3. If currently in IDE view (Full Cloud Compiler)
  if (currentView === 'ide') {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        {/* Floating Switcher to view Cosmic Landing Page anytime */}
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => handleViewChange('landing')}
            className="group relative p-[1.5px] rounded-full accent-gradient shadow-xl hover:scale-105 transition-transform cursor-pointer"
            title="View Cosmic Showcase / Landing Page"
          >
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface text-xs font-mono font-medium text-text-primary group-hover:bg-transparent group-hover:text-white transition-colors">
              <span>Cosmic Landing</span>
              <span>🌌</span>
            </span>
          </button>
        </div>

        <CompilerIDE
          onChangeView={handleViewChange}
          currentView={currentView}
        />
      </div>
    );
  }

  // 4. If currently in Landing view (Portfolio Cosmic Landing Page)
  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-sky-500/25 selection:text-white font-body relative">
      {/* Loading Screen on initial visit */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Persistent Quick Action to Launch Compiler */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => handleViewChange('ide')}
          className="group relative p-[2px] rounded-full accent-gradient shadow-2xl hover:scale-110 transition-transform cursor-pointer"
          title="Open Full Code Editor & Terminal"
        >
          <span className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 text-sm font-mono font-semibold text-white group-hover:bg-transparent transition-colors">
            <span>⚡ Launch Compiler (IDE)</span>
          </span>
        </button>
      </div>

      {/* Floating Navbar */}
      <Navbar
        onOpenCompiler={() => handleViewChange('ide')}
        onOpenAbout={() => handleViewChange('about')}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenSayHi={() => setIsContactOpen(true)}
      />

      <main className="relative z-0">
        {/* Hero Section */}
        <Hero
          isLoading={isLoading}
          onOpenCompiler={() => handleViewChange('ide')}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />

        {/* Selected Works (Core Capabilities) */}
        <SelectedWorks
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAllWork={() => handleViewChange('ide')}
        />

        {/* Journal (Engineering & Insights) */}
        <Journal
          onSelectArticle={(article) => setSelectedArticle(article)}
          onViewAll={() => handleViewChange('ide')}
        />

        {/* Explorations (Parallax Visuals) */}
        <Explorations
          onOpenLightbox={(item) => setSelectedExploration(item)}
        />

        {/* Stats */}
        <Stats />

        {/* Contact & Footer */}
        <Footer
          onOpenCompiler={() => handleViewChange('ide')}
          onContactClick={() => setIsContactOpen(true)}
        />
      </main>

      {/* Modals & Overlays */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <JournalModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <LightboxModal
        item={selectedExploration}
        onClose={() => setSelectedExploration(null)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};

export default App;
