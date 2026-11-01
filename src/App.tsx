import React, { useState } from 'react';
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

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<ExplorationItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-sky-500/25 selection:text-white font-body relative">
      {/* Section 1: Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Floating Navbar */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenSayHi={() => setIsContactOpen(true)}
      />

      <main className="relative z-0">
        {/* Section 2: Hero */}
        <Hero
          isLoading={isLoading}
          onSeeWorks={() => {
            document.getElementById('selected-works')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onReachOut={() => setIsContactOpen(true)}
        />

        {/* Section 3: Selected Works */}
        <SelectedWorks
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAllWork={() => {
            // Scroll smoothly or open explore
            document.getElementById('explorations')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section 4: Journal */}
        <Journal
          onSelectArticle={(article) => setSelectedArticle(article)}
          onViewAll={() => {
            // Highlight thoughts
            document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section 5: Explorations (Parallax Gallery) */}
        <Explorations
          onOpenLightbox={(item) => setSelectedExploration(item)}
        />

        {/* Section 6: Stats */}
        <Stats />

        {/* Section 7: Contact / Footer */}
        <Footer
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
    </div>
  );
};

export default App;
