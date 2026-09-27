'use client';

import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PLAYBOOK_SCENARIOS } from '../../data/playbook';
import {
  BookOpen,
  Search,
  X,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const PlaybookModal: React.FC = () => {
  const {
    isPlaybookModalOpen,
    setPlaybookModalOpen,
    applyPlaybookScenario,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'CMS & Content',
    'Design & Revisions',
    'Integrations & Code',
    'Timeline & Assets',
    'Scope Management',
    'Triage & Defect',
  ];

  const filteredScenarios = useMemo(() => {
    return PLAYBOOK_SCENARIOS.filter((sc) => {
      const matchesCategory =
        selectedCategory === 'All' || sc.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        sc.title.toLowerCase().includes(q) ||
        sc.summary.toLowerCase().includes(q) ||
        sc.agencyAdvice.toLowerCase().includes(q) ||
        sc.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isPlaybookModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Agency Playbook
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                  12 Standard Scenarios
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-calibrated decision playbooks for boutique Webflow and Framer studios.
              </p>
            </div>
          </div>

          <button
            onClick={() => setPlaybookModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenarios (e.g. CMS collection, API webhook, late assets, rush)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Categories Pill bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredScenarios.map((sc) => {
              const totalHours =
                sc.defaultHours.design + sc.defaultHours.dev + sc.defaultHours.pm;

              return (
                <div
                  key={sc.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center">
                          {sc.number}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                          {sc.category}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                        sc.recommendedRoute === 'addition'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : sc.recommendedRoute === 'defect'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                          : sc.recommendedRoute === 'ambiguous'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}>
                        {sc.recommendedRoute}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sc.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {sc.summary}
                    </p>

                    {/* Agency advice quote */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      &quot;{sc.agencyAdvice}&quot;
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{totalHours} hrs
                      </span>
                      {sc.defaultOutsideCost > 0 && (
                        <span>+${sc.defaultOutsideCost}</span>
                      )}
                      <span>+{sc.defaultScheduleDays}d delay</span>
                    </div>

                    <button
                      onClick={() => applyPlaybookScenario(sc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-xs font-medium transition-all shadow-none"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredScenarios.length === 0 && (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
              <p className="text-sm">No scenarios match your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
