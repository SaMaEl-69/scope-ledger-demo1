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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* App Header */}
      <Header />

      {/* TRACE Methodology Navigation */}
      <div id="trace-nav" className="print:hidden">
        <TraceNavigation />
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeStep === 'T' && <StepTrace />}
        {activeStep === 'R' && <StepRoute />}
        {activeStep === 'A' && <StepAssess />}
        {activeStep === 'C' && <StepChoose />}
        {activeStep === 'E' && <StepEvidence />}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 sm:px-6 py-4 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ScopeLedger</span>
            <span>•</span>
            <span>Margin-Protection Kit for $5k–$25k Webflow & Framer Studios</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => setPlaybookModalOpen(true)}
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>Agency Playbook</span>
              <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                Cmd+K
              </kbd>
            </button>

            <button
              onClick={() => setShortcutsModalOpen(true)}
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>TRACE Guide</span>
              <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
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
