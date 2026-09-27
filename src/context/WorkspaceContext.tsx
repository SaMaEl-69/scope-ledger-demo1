'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Project, ScopeChangeRequest, WorkspaceSettings, LicenseState, PlaybookScenario, CalculationResults } from '../types';
import { INITIAL_WORKSPACE_SETTINGS, INITIAL_LICENSE_STATE, SAMPLE_PROJECT } from '../data/sampleProjects';
import { calculateFinancialMetrics } from '../utils/calculations';
import { getTodayDateString, getDaysFromToday } from '../utils/formatters';

export type TraceStep = 'T' | 'R' | 'A' | 'C' | 'E';
export type AppTheme = 'dark' | 'light';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface WorkspaceContextType {
  projects: Project[];
  activeProject: Project;
  activeChange: ScopeChangeRequest;
  settings: WorkspaceSettings;
  license: LicenseState;
  activeStep: TraceStep;
  theme: AppTheme;
  calculations: CalculationResults;
  isLicenseModalOpen: boolean;
  licenseModalReason: string;
  isPlaybookModalOpen: boolean;
  isProjectModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  toasts: Toast[];
  
  // Theme
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  
  // Navigation
  setActiveStep: (step: TraceStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Projects
  switchProject: (projectId: string) => void;
  createProject: (data: { name: string; clientName: string; clientEmail?: string; approvedFee: number; incurredCosts: number; remainingCosts: number; targetMargin: number }) => boolean;
  updateProject: (projectId: string, partial: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  
  // Scope Changes
  createChangeRequest: (title?: string) => void;
  updateActiveChange: (partial: Partial<ScopeChangeRequest>) => void;
  switchChangeRequest: (changeId: string) => void;
  deleteChangeRequest: (changeId: string) => void;
  applyPlaybookScenario: (scenario: PlaybookScenario) => void;
  
  // Settings & License
  updateSettings: (partial: Partial<WorkspaceSettings>) => void;
  activateLicense: (key: string, tier?: 'individual' | 'agency') => boolean;
  releaseLicense: () => void;
  openLicenseModal: (reason?: string) => void;
  closeLicenseModal: () => void;
  setPlaybookModalOpen: (open: boolean) => void;
  setProjectModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  
  // Backup
  exportWorkspaceBackup: () => void;
  importWorkspaceBackup: (jsonString: string) => { success: boolean; error?: string };
  resetWorkspaceToDemo: () => void;
  
  // Toast
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY_PROJECTS = 'scopeledger_projects_v1';
const STORAGE_KEY_SETTINGS = 'scopeledger_settings_v1';
const STORAGE_KEY_LICENSE = 'scopeledger_license_v1';
const STORAGE_KEY_ACTIVE_PROJECT = 'scopeledger_active_project_id_v1';
const STORAGE_KEY_THEME = 'scopeledger_theme_v1';

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([SAMPLE_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState<string>(SAMPLE_PROJECT.id);
  const [settings, setSettings] = useState<WorkspaceSettings>(INITIAL_WORKSPACE_SETTINGS);
  const [license, setLicense] = useState<LicenseState>(INITIAL_LICENSE_STATE);
  const [activeStep, setActiveStep] = useState<TraceStep>('T');
  const [theme, setThemeState] = useState<AppTheme>('dark');
  
  // Modals
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [licenseModalReason, setLicenseModalReason] = useState<string>('');
  const [isPlaybookModalOpen, setPlaybookModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  
  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
      const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      const storedLicense = localStorage.getItem(STORAGE_KEY_LICENSE);
      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT);
      const storedTheme = localStorage.getItem(STORAGE_KEY_THEME) as AppTheme | null;

      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
      if (storedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(storedSettings) }));
      }
      if (storedLicense) {
        setLicense((prev) => ({ ...prev, ...JSON.parse(storedLicense) }));
      }
      if (storedActiveId) {
        setActiveProjectId(storedActiveId);
      }
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setThemeState(storedTheme);
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Default to dark mode
        document.documentElement.classList.add('dark');
      }
    } catch (err) {
      console.error('Failed to load from localStorage', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      console.error('Failed to save theme', err);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'White / Light'} Mode`, 'info');
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEY_LICENSE, JSON.stringify(license));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT, activeProjectId);
    } catch (err) {
      console.error('Failed to persist to localStorage', err);
    }
  }, [projects, settings, license, activeProjectId, isLoaded]);

  // Current active project
  const activeProject = useMemo(() => {
    const found = projects.find((p) => p.id === activeProjectId);
    return found || projects[0] || SAMPLE_PROJECT;
  }, [projects, activeProjectId]);

  // Current active change request
  const activeChange = useMemo(() => {
    const currentList = activeProject.changeRequests || [];
    const found = currentList.find((c) => c.id === activeProject.activeChangeId);
    if (found) return found;
    if (currentList.length > 0) return currentList[0];
    
    // Fallback default change request
    const fallback: ScopeChangeRequest = {
      id: 'scb-default-' + Date.now(),
      referenceId: 'SCB-2026-001',
      title: 'New Scope Adjustment Request',
      clientDescription: 'Adjustment to project scope baseline.',
      requestDate: getTodayDateString(),
      targetCompletionDate: getDaysFromToday(7),
      route: 'addition',
      routeRationale: 'New requirement outside agreed baseline.',
      laborLines: [
        { id: 'l-1', role: 'UI/UX Design', hours: 2, loadedRate: settings.defaultDesignRate || 85 },
        { id: 'l-2', role: 'Development', hours: 6, loadedRate: settings.defaultDevRate || 95 },
        { id: 'l-3', role: 'QA & Management', hours: 2, loadedRate: settings.defaultPmRate || 75 },
      ],
      outsideVendorCosts: 0,
      outsideVendorDescription: '',
      avoidableRemovableCosts: 0,
      avoidableScopeDescription: '',
      scheduleImpactDays: 3,
      scheduleNotes: 'Adds 3 business days to final review milestone.',
      offerType: 'quote',
      quotedFee: 1250,
      deliveryConditions: ['Client approves scope in writing before work begins.'],
      status: 'draft',
    };
    return fallback;
  }, [activeProject, settings]);

  // Reactive financial calculations
  const calculations = useMemo(() => {
    return calculateFinancialMetrics(activeProject, activeChange);
  }, [activeProject, activeChange]);

  // TRACE Navigation
  const stepsList: TraceStep[] = ['T', 'R', 'A', 'C', 'E'];

  const nextStep = () => {
    const currentIndex = stepsList.indexOf(activeStep);
    if (currentIndex < stepsList.length - 1) {
      setActiveStep(stepsList[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = stepsList.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(stepsList[currentIndex - 1]);
    }
  };

  // License Modal Helpers
  const openLicenseModal = (reason: string = 'Unlock unlimited projects and clean exports') => {
    setLicenseModalReason(reason);
    setIsLicenseModalOpen(true);
  };

  const closeLicenseModal = () => {
    setIsLicenseModalOpen(false);
  };

  // Project Management
  const switchProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (target) {
      setActiveProjectId(projectId);
      showToast(`Switched to "${target.name}"`, 'info');
    }
  };

  const createProject = (data: {
    name: string;
    clientName: string;
    clientEmail?: string;
    approvedFee: number;
    incurredCosts: number;
    remainingCosts: number;
    targetMargin: number;
  }): boolean => {
    // Paywall trigger check:
    // In Free Demo Mode, allow only 1 custom project (sample project + 1 custom).
    // If user already has a non-sample project, trigger paywall!
    const customProjects = projects.filter((p) => !p.isSample);
    if (!license.isLicensed && customProjects.length >= 1) {
      openLicenseModal('Demo Mode allows 1 custom project. Upgrade to Individual or Agency plan for unlimited studio projects.');
      return false;
    }

    const newId = 'proj-' + Date.now();
    const initialChangeId = 'scb-' + Date.now();
    const refCode = (data.name.slice(0, 3).toUpperCase() || 'PRJ') + '-WEB-' + new Date().getFullYear();

    const initialChange: ScopeChangeRequest = {
      id: initialChangeId,
      referenceId: 'SCB-2026-001',
      title: 'Initial Scope Change Request',
      clientDescription: 'Detail the incoming scope addition or client request here.',
      requestDate: getTodayDateString(),
      targetCompletionDate: getDaysFromToday(7),
      route: 'addition',
      routeRationale: 'New scope item identified during build phase.',
      laborLines: [
        { id: 'line-1', role: 'UI/UX Design', hours: 2, loadedRate: settings.defaultDesignRate || 85 },
        { id: 'line-2', role: 'Development', hours: 6, loadedRate: settings.defaultDevRate || 95 },
        { id: 'line-3', role: 'QA & Management', hours: 2, loadedRate: settings.defaultPmRate || 75 },
      ],
      outsideVendorCosts: 0,
      outsideVendorDescription: '',
      avoidableRemovableCosts: 0,
      avoidableScopeDescription: '',
      scheduleImpactDays: 2,
      scheduleNotes: 'Timeline impact will be calculated once scope is locked.',
      offerType: 'quote',
      quotedFee: 1200,
      deliveryConditions: [
        'Client approves scope change prior to engineering deployment.',
      ],
      status: 'draft',
    };

    const newProject: Project = {
      id: newId,
      name: data.name,
      clientName: data.clientName,
      clientEmail: data.clientEmail || '',
      referenceCode: refCode,
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedFee: data.approvedFee,
      incurredCosts: data.incurredCosts,
      remainingCosts: data.remainingCosts,
      targetMargin: data.targetMargin,
      activeChangeId: initialChangeId,
      changeRequests: [initialChange],
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newId);
    showToast(`Created project "${data.name}"`, 'success');
    return true;
  };

  const updateProject = (projectId: string, partial: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, ...partial, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      showToast('Cannot delete the only remaining project.', 'warning');
      return;
    }
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    if (activeProjectId === projectId) {
      setActiveProjectId(remaining[0].id);
    }
    showToast('Project deleted', 'info');
  };

  const duplicateProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    // Check paywall if free mode
    const customProjects = projects.filter((p) => !p.isSample);
    if (!license.isLicensed && customProjects.length >= 1) {
      openLicenseModal('Demo Mode allows 1 custom project. Upgrade to duplicate unlimited projects.');
      return;
    }

    const newId = 'proj-' + Date.now();
    const duplicated: Project = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
    setActiveProjectId(newId);
    showToast(`Duplicated "${target.name}"`, 'success');
  };

  // Scope Change Request management
  const createChangeRequest = (title: string = 'New Scope Request') => {
    const count = (activeProject.changeRequests?.length || 0) + 1;
    const refId = `SCB-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newChangeId = 'scb-' + Date.now();

    const newChange: ScopeChangeRequest = {
      id: newChangeId,
      referenceId: refId,
      title,
      clientDescription: 'Detail the incoming scope addition or client request here.',
      requestDate: getTodayDateString(),
      targetCompletionDate: getDaysFromToday(7),
      route: 'addition',
      routeRationale: 'Client requested out-of-scope feature.',
      laborLines: [
        { id: 'l-' + Date.now() + '-1', role: 'UI/UX Design', hours: 3, loadedRate: settings.defaultDesignRate || 85 },
        { id: 'l-' + Date.now() + '-2', role: 'Development', hours: 6, loadedRate: settings.defaultDevRate || 95 },
        { id: 'l-' + Date.now() + '-3', role: 'QA & Management', hours: 2, loadedRate: settings.defaultPmRate || 75 },
      ],
      outsideVendorCosts: 0,
      outsideVendorDescription: '',
      avoidableRemovableCosts: 0,
      avoidableScopeDescription: '',
      scheduleImpactDays: 3,
      scheduleNotes: 'Adds 3 business days to current sprint.',
      offerType: 'quote',
      quotedFee: 1350,
      deliveryConditions: ['Client approves scope brief prior to sprint scheduling.'],
      status: 'draft',
    };

    updateProject(activeProject.id, {
      activeChangeId: newChangeId,
      changeRequests: [newChange, ...(activeProject.changeRequests || [])],
    });
    setActiveStep('T');
    showToast(`Created scope brief "${refId}"`, 'success');
  };

  const updateActiveChange = (partial: Partial<ScopeChangeRequest>) => {
    const updatedList = (activeProject.changeRequests || []).map((c) => {
      if (c.id === activeChange.id) {
        return { ...c, ...partial };
      }
      return c;
    });

    updateProject(activeProject.id, {
      changeRequests: updatedList,
    });
  };

  const switchChangeRequest = (changeId: string) => {
    updateProject(activeProject.id, { activeChangeId: changeId });
  };

  const deleteChangeRequest = (changeId: string) => {
    const currentList = activeProject.changeRequests || [];
    if (currentList.length <= 1) {
      showToast('Each project must have at least one scope request.', 'warning');
      return;
    }
    const remaining = currentList.filter((c) => c.id !== changeId);
    const nextActiveId = remaining[0].id;
    updateProject(activeProject.id, {
      changeRequests: remaining,
      activeChangeId: activeProject.activeChangeId === changeId ? nextActiveId : activeProject.activeChangeId,
    });
    showToast('Scope request removed', 'info');
  };

  // Playbook Scenario Application
  const applyPlaybookScenario = (scenario: PlaybookScenario) => {
    const updatedLaborLines: ScopeChangeRequest['laborLines'] = [
      { id: 'sc-1', role: 'UI/UX Design', hours: scenario.defaultHours.design, loadedRate: settings.defaultDesignRate || 85 },
      { id: 'sc-2', role: 'Webflow / Dev', hours: scenario.defaultHours.dev, loadedRate: settings.defaultDevRate || 95 },
      { id: 'sc-3', role: 'QA & Delivery Lead', hours: scenario.defaultHours.pm, loadedRate: settings.defaultPmRate || 75 },
    ];

    // Compute net incremental cost D
    const totalLabor = scenario.defaultHours.design * (settings.defaultDesignRate || 85) +
      scenario.defaultHours.dev * (settings.defaultDevRate || 95) +
      scenario.defaultHours.pm * (settings.defaultPmRate || 75);
    const costD = totalLabor + scenario.defaultOutsideCost;
    
    // Suggested price floor
    const g = activeProject.targetMargin || 0.35;
    const suggestedFee = scenario.recommendedOffer === 'quote' ? Math.round(costD / (1 - g)) : 0;

    updateActiveChange({
      title: scenario.title,
      clientDescription: scenario.clientDescription,
      route: scenario.recommendedRoute,
      routeRationale: scenario.agencyAdvice,
      laborLines: updatedLaborLines,
      outsideVendorCosts: scenario.defaultOutsideCost,
      scheduleImpactDays: scenario.defaultScheduleDays,
      scheduleNotes: scenario.defaultScheduleDays > 0 ? `Schedule extension: +${scenario.defaultScheduleDays} business days` : 'Zero milestone slippage.',
      offerType: scenario.recommendedOffer,
      quotedFee: suggestedFee,
      deliveryConditions: [...scenario.conditions],
    });

    setPlaybookModalOpen(false);
    showToast(`Applied Playbook: "${scenario.title}"`, 'success');
  };

  // Workspace Settings
  const updateSettings = (partial: Partial<WorkspaceSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    showToast('Workspace settings saved', 'success');
  };

  // Commercial Licensing (Gumroad-Ready)
  const activateLicense = (key: string, tier: 'individual' | 'agency' = 'agency'): boolean => {
    const trimmed = key.trim().toUpperCase();
    
    // Accept valid format: starts with 'SCOPE-' or contains 'AGENCY' or 'INDIVIDUAL'
    const isAgency = trimmed.includes('AGENCY') || tier === 'agency';
    const chosenTier = isAgency ? 'agency' : 'individual';
    const maxDevices = isAgency ? 5 : 2;

    const newLicense: LicenseState = {
      isLicensed: true,
      tier: chosenTier,
      licenseKey: trimmed || `SCOPE-${chosenTier.toUpperCase()}-2026-VALID`,
      activatedAt: new Date().toISOString(),
      registeredDevices: 1,
      maxDevices,
      currentDeviceName: 'Studio Workstation (Active)',
    };

    setLicense(newLicense);
    setIsLicenseModalOpen(false);
    showToast(`License activated: ${isAgency ? 'Agency Plan (5 Devices)' : 'Individual Plan (2 Devices)'}!`, 'success');
    return true;
  };

  const releaseLicense = () => {
    setLicense({
      isLicensed: false,
      tier: 'free',
      licenseKey: '',
      registeredDevices: 1,
      maxDevices: 1,
      currentDeviceName: 'Studio Workstation (Demo)',
    });
    showToast('License released. Reverted to Free Demo Mode.', 'info');
  };

  // Backup Import & Export
  const exportWorkspaceBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      agency: settings.agencyName,
      projects,
      settings,
      license,
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = getTodayDateString();
    a.href = url;
    a.download = `scopeledger-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Workspace backup exported successfully', 'success');
  };

  const importWorkspaceBackup = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format');
      }
      if (!Array.isArray(data.projects) || data.projects.length === 0) {
        throw new Error('Backup must contain at least one project.');
      }

      setProjects(data.projects);
      if (data.projects[0]?.id) {
        setActiveProjectId(data.projects[0].id);
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
      if (data.license && typeof data.license === 'object') {
        setLicense(data.license);
      }

      showToast('Workspace backup restored successfully!', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during import';
      showToast(`Import failed: ${msg}`, 'error');
      return { success: false, error: msg };
    }
  };

  const resetWorkspaceToDemo = () => {
    setProjects([SAMPLE_PROJECT]);
    setActiveProjectId(SAMPLE_PROJECT.id);
    setSettings(INITIAL_WORKSPACE_SETTINGS);
    setLicense(INITIAL_LICENSE_STATE);
    showToast('Workspace reset to initial demo state', 'info');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        activeProject,
        activeChange,
        settings,
        license,
        activeStep,
        theme,
        calculations,
        isLicenseModalOpen,
        licenseModalReason,
        isPlaybookModalOpen,
        isProjectModalOpen,
        isSettingsModalOpen,
        isShortcutsModalOpen,
        toasts,
        toggleTheme,
        setTheme,
        setActiveStep,
        nextStep,
        prevStep,
        switchProject,
        createProject,
        updateProject,
        deleteProject,
        duplicateProject,
        createChangeRequest,
        updateActiveChange,
        switchChangeRequest,
        deleteChangeRequest,
        applyPlaybookScenario,
        updateSettings,
        activateLicense,
        releaseLicense,
        openLicenseModal,
        closeLicenseModal,
        setPlaybookModalOpen,
        setProjectModalOpen,
        setSettingsModalOpen,
        setShortcutsModalOpen,
        exportWorkspaceBackup,
        importWorkspaceBackup,
        resetWorkspaceToDemo,
        showToast,
        removeToast,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
