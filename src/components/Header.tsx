'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FolderKanban,
  ChevronDown,
  Plus,
  BookOpen,
  Settings,
  Sparkles,
  ShieldCheck,
  Check,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    projects,
    activeProject,
    switchProject,
    license,
    theme,
    toggleTheme,
    openLicenseModal,
    setPlaybookModalOpen,
    setProjectModalOpen,
    setSettingsModalOpen,
    setShortcutsModalOpen,
  } = useWorkspace();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/60 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand + Project Switcher */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm flex items-center justify-center font-mono font-bold text-xs tracking-tight">
              SL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-sm">
                  ScopeLedger
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-medium">
                  Studio
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Project Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 transition-all max-w-[220px] sm:max-w-[300px]"
              title="Switch Active Project"
            >
              <FolderKanban className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <div className="flex flex-col text-left truncate">
                <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                  {activeProject.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {activeProject.clientName}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0 transition-transform duration-150" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                  <span>Projects ({projects.length})</span>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] normal-case font-medium"
                  >
                    Manage
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        switchProject(proj.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        proj.id === activeProject.id
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-xs font-medium truncate flex items-center gap-1.5">
                          {proj.name}
                          {proj.isSample && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              Demo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {proj.clientName} • Fee: ${proj.approvedFee.toLocaleString()}
                        </div>
                      </div>
                      {proj.id === activeProject.id && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Playbook, Licensing, Theme Toggle, Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Agency Playbook button */}
          <button
            onClick={() => setPlaybookModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all shadow-none group"
            title="Search Agency Playbook (12 Pre-built Scenarios)"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <span className="hidden sm:inline">Playbooks</span>
            <kbd className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Licensing Badge */}
          {license.isLicensed ? (
            <button
              onClick={() => openLicenseModal()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-500/20 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-all"
              title="License Details & Device Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline capitalize">{license.tier}</span>
            </button>
          ) : (
            <button
              onClick={() => openLicenseModal('Unlock unwatermarked briefs and unlimited custom studio projects.')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 border border-amber-200/80 dark:border-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300 transition-all"
              title="Click to Activate Full License"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Demo</span>
            </button>
          )}

          {/* Theme Toggle: Dark / White Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Workspace Settings button */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs"
            title="Studio Settings & Backup"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Shortcuts Help button */}
          <button
            onClick={() => setShortcutsModalOpen(true)}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs"
            title="TRACE Framework Guide (?)"
            aria-label="Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
