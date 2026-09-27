'use client';

import React, { useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

export const CommandPalette: React.FC = () => {
  const {
    setActiveStep,
    setPlaybookModalOpen,
    setProjectModalOpen,
    setSettingsModalOpen,
    setShortcutsModalOpen,
    isPlaybookModalOpen,
    isProjectModalOpen,
    isSettingsModalOpen,
    isShortcutsModalOpen,
    isLicenseModalOpen,
    closeLicenseModal,
  } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger single key shortcuts if focused in an input/textarea/select
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPlaybookModalOpen(true);
        return;
      }

      if (e.key === 'Escape') {
        if (isLicenseModalOpen) closeLicenseModal();
        if (isPlaybookModalOpen) setPlaybookModalOpen(false);
        if (isProjectModalOpen) setProjectModalOpen(false);
        if (isSettingsModalOpen) setSettingsModalOpen(false);
        if (isShortcutsModalOpen) setShortcutsModalOpen(false);
        return;
      }

      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '1' || e.key.toLowerCase() === 't') {
          setActiveStep('T');
        } else if (e.key === '2' || e.key.toLowerCase() === 'r') {
          setActiveStep('R');
        } else if (e.key === '3' || e.key.toLowerCase() === 'a') {
          setActiveStep('A');
        } else if (e.key === '4' || e.key.toLowerCase() === 'c') {
          setActiveStep('C');
        } else if (e.key === '5' || e.key.toLowerCase() === 'e') {
          setActiveStep('E');
        } else if (e.key === '?') {
          setShortcutsModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setActiveStep,
    setPlaybookModalOpen,
    setProjectModalOpen,
    setSettingsModalOpen,
    setShortcutsModalOpen,
    isPlaybookModalOpen,
    isProjectModalOpen,
    isSettingsModalOpen,
    isShortcutsModalOpen,
    isLicenseModalOpen,
    closeLicenseModal,
  ]);

  return null;
};
