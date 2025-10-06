'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NoteDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

const NoteDialogContext = createContext<NoteDialogContextType | undefined>(undefined);

export function NoteDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <NoteDialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        openDialog,
        closeDialog,
      }}
    >
      {children}
    </NoteDialogContext.Provider>
  );
}

export function useNoteDialog() {
  const context = useContext(NoteDialogContext);
  if (context === undefined) {
    throw new Error('useNoteDialog must be used within a NoteDialogProvider');
  }
  return context;
}