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
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    projects,
    activeProject,
    switchProject,
    license,
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
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand + Project Switcher */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <span className="font-mono font-black text-xs text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 via-emerald-300 to-white">
                  SL
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-100 tracking-tight text-sm sm:text-base">
                  ScopeLedger
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                  Studio Edition
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 tracking-tight">
                Margin-Protection & Scope Kit for Webflow & Framer Studios
              </p>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Project Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all max-w-[210px] sm:max-w-[280px]"
              title="Switch Active Project"
            >
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <div className="flex flex-col text-left truncate">
                <span className="truncate font-semibold text-slate-200">
                  {activeProject.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {activeProject.clientName} • {activeProject.referenceCode}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/70 flex justify-between items-center">
                  <span>Projects ({projects.length})</span>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] normal-case"
                  >
                    Manage All
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        switchProject(proj.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-start justify-between gap-2 hover:bg-slate-800/60 transition-colors ${
                        proj.id === activeProject.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-xs font-medium truncate flex items-center gap-1.5">
                          {proj.name}
                          {proj.isSample && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {proj.clientName} • Fee: ${proj.approvedFee.toLocaleString()}
                        </div>
                      </div>
                      {proj.id === activeProject.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-1.5 border-t border-slate-800/70">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-indigo-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Playbook, Licensing, Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Agency Playbook button */}
          <button
            onClick={() => setPlaybookModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 text-xs font-medium text-indigo-300 transition-all shadow-sm group"
            title="Search Agency Playbook (12 Pre-built Scenarios)"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">Agency Playbook</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-900/60 text-indigo-200 font-mono">
              12
            </span>
          </button>

          {/* Licensing Badge */}
          {license.isLicensed ? (
            <button
              onClick={() => openLicenseModal()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-medium text-emerald-300 transition-all"
              title="License Details & Device Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline capitalize">
                {license.tier} Plan
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          ) : (
            <button
              onClick={() => openLicenseModal('Unlock unwatermarked briefs and unlimited custom studio projects.')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/40 text-xs font-medium text-amber-300 transition-all shadow-sm"
              title="Click to Activate Full License"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Demo Mode</span>
              <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                Upgrade
              </span>
            </button>
          )}

          {/* Workspace Settings button */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
            title="Studio Settings & Backup"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Shortcuts Help button */}
          <button
            onClick={() => setShortcutsModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            title="Keyboard Shortcuts & Method"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
