import React, { useState, useEffect } from 'react';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_SKILL_CATEGORIES,
  PortfolioProfile,
  Project,
} from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { CustomizeDrawer } from './components/CustomizeDrawer';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Profile data state with local storage persistence
  const [profile, setProfile] = useState<PortfolioProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  const [projects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences] = useState(DEFAULT_EXPERIENCES);
  const [skills] = useState(DEFAULT_SKILL_CATEGORIES);

  // Modals state
  const [resumeOpen, setResumeOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('portfolio_dark_mode', darkMode.toString());
  }, [darkMode]);

  const handleSaveProfile = (updated: PortfolioProfile) => {
    setProfile(updated);
    localStorage.setItem('portfolio_profile', JSON.stringify(updated));
  };

  const handleResetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('portfolio_profile');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 transition-colors duration-200 dark:bg-[#09090b] dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Navigation */}
      <Navbar
        name={profile.name}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenResume={() => setResumeOpen(true)}
        onOpenCustomize={() => setCustomizeOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero profile={profile} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projects} />
        <SkillsSection categories={skills} />
        <ExperienceSection experiences={experiences} />
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <Footer name={profile.name} />

      {/* Printable / Viewable Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        profile={profile}
        projects={projects}
        experiences={experiences}
        skills={skills}
      />

      {/* Customize Profile Drawer */}
      <CustomizeDrawer
        isOpen={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetDefaults={handleResetProfile}
      />
    </div>
  );
}
