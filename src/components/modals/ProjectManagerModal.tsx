'use client';

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { calculateBaselineMargin } from '../../utils/calculations';
import {
  FolderKanban,
  X,
  Plus,
  Copy,
  Trash2,
} from 'lucide-react';

export const ProjectManagerModal: React.FC = () => {
  const {
    projects,
    activeProject,
    switchProject,
    createProject,
    duplicateProject,
    deleteProject,
    isProjectModalOpen,
    setProjectModalOpen,
    settings,
    license,
    openLicenseModal,
  } = useWorkspace();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFee, setNewFee] = useState<number>(12500);
  const [newIncurred, setNewIncurred] = useState<number>(3500);
  const [newRemaining, setNewRemaining] = useState<number>(3000);
  const [newTargetMargin] = useState<number>(settings.defaultTargetMargin || 0.38);

  if (!isProjectModalOpen) return null;

  const handleStartCreate = () => {
    // Check paywall if demo mode
    const customProjects = projects.filter((p) => !p.isSample);
    if (!license.isLicensed && customProjects.length >= 1) {
      setProjectModalOpen(false);
      openLicenseModal('Demo Mode allows 1 custom project. Upgrade to Individual or Agency plan for unlimited studio projects.');
      return;
    }
    setIsCreating(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newClient.trim()) return;

    const success = createProject({
      name: newName.trim(),
      clientName: newClient.trim(),
      clientEmail: newEmail.trim(),
      approvedFee: Number(newFee) || 10000,
      incurredCosts: Number(newIncurred) || 0,
      remainingCosts: Number(newRemaining) || 0,
      targetMargin: Number(newTargetMargin) || 0.38,
    });

    if (success) {
      setIsCreating(false);
      setNewName('');
      setNewClient('');
      setNewEmail('');
      setProjectModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Studio Projects Manager
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch active client accounts or add fixed-fee website projects.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCreating(false);
              setProjectModalOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {!isCreating ? (
            <>
              {/* Project Action Top Bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Projects ({projects.length})
                </span>
                <button
                  onClick={handleStartCreate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => {
                  const isActive = proj.id === activeProject.id;
                  const committed = proj.incurredCosts + proj.remainingCosts;
                  const margin = calculateBaselineMargin(proj.approvedFee, committed);

                  return (
                    <div
                      key={proj.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500/70 shadow-md ring-1 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {proj.name}
                          </span>
                          {proj.isSample && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-semibold">
                              Demo Sample
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>Client: <strong className="text-slate-800 dark:text-slate-300">{proj.clientName}</strong></span>
                          <span>•</span>
                          <span>Fee: <strong className="text-slate-800 dark:text-slate-300 font-mono">{formatCurrency(proj.approvedFee, settings.currency)}</strong></span>
                          <span>•</span>
                          <span>Margin: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{formatPercent(margin)}</strong></span>
                          <span>•</span>
                          <span>{proj.changeRequests?.length || 0} Scope Items</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        {!isActive && (
                          <button
                            onClick={() => {
                              switchProject(proj.id);
                              setProjectModalOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
                          >
                            Switch To
                          </button>
                        )}

                        <button
                          onClick={() => duplicateProject(proj.id)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
                          title="Duplicate project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {projects.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${proj.name}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Create Project Form */
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add New Agency Project Baseline
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Vesper / SaaS Brand Redesign"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Client Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="e.g. Vesper Technologies, Inc."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Client Contact Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. sarah@vesper.io"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Agreed Fixed Contract Fee ($F) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Incurred Delivery Sunk Costs ($A)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={newIncurred}
                    onChange={(e) => setNewIncurred(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Remaining Delivery Cost ($R)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={newRemaining}
                    onChange={(e) => setNewRemaining(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md"
                >
                  Save & Set Active
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
