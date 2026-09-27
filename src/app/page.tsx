'use client';

import React from 'react';
import { WorkspaceProvider, useWorkspace } from '../context/WorkspaceContext';
import { Header } from '../components/Header';
import { TraceNavigation } from '../components/TraceNavigation';
import { StepTrace } from '../components/steps/StepTrace';
import { StepRoute } from '../components/steps/StepRoute';
import { StepAssess } from '../components/steps/StepAssess';
import { StepChoose } from '../components/steps/StepChoose';
import { StepEvidence } from '../components/steps/StepEvidence';
import { PlaybookModal } from '../components/modals/PlaybookModal';
import { ProjectManagerModal } from '../components/modals/ProjectManagerModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { LicenseModal } from '../components/modals/LicenseModal';
import { ShortcutsModal } from '../components/modals/ShortcutsModal';
import { CommandPalette } from '../components/CommandPalette';
import { ToastContainer } from '../components/ui/ToastContainer';
import { HelpCircle } from 'lucide-react';

const WorkspaceApp: React.FC = () => {
  const { activeStep, setShortcutsModalOpen, setPlaybookModalOpen } = useWorkspace();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* App Header */}
      <Header />

      {/* TRACE Methodology Navigation */}
      <div id="trace-nav" className="print:hidden">
        <TraceNavigation />
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {activeStep === 'T' && <StepTrace />}
        {activeStep === 'R' && <StepRoute />}
        {activeStep === 'A' && <StepAssess />}
        {activeStep === 'C' && <StepChoose />}
        {activeStep === 'E' && <StepEvidence />}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 px-4 sm:px-8 py-5 text-xs text-slate-500 dark:text-slate-400 print:hidden transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">ScopeLedger</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Margin-Protection Kit for Boutique Webflow & Framer Studios</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => setPlaybookModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>Playbooks</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]">
                Cmd+K
              </kbd>
            </button>

            <button
              onClick={() => setShortcutsModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]">
                ?
              </kbd>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals & Handlers */}
      <PlaybookModal />
      <ProjectManagerModal />
      <SettingsModal />
      <LicenseModal />
      <ShortcutsModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};

export default function Home() {
  return (
    <WorkspaceProvider>
      <WorkspaceApp />
    </WorkspaceProvider>
  );
}
