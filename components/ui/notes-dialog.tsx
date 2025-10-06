'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
  children?: React.ReactNode;
}

export function NotesDialog({
  mode,
  open,
  onOpenChange,
  onSubmit,
  initialTitle = '',
  initialContent = '',
  children
}: NotesDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent, open]);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
      // Form wird durch useEffect resetted wenn sich initialTitle/Content ändern
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setContent(initialContent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Neue Notiz erstellen' : 'Notiz bearbeiten'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Erstelle eine neue Notiz mit Titel und Inhalt.'
              : 'Bearbeite Titel und Inhalt der Notiz.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="note-title" className="text-sm font-medium">
              Titel
            </label>
            <Input
              id="note-title"
              placeholder="Titel der Notiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="note-content" className="text-sm font-medium">
              Inhalt
            </label>
            <label htmlFor="note-content-textarea" className="sr-only">
              Inhalt der Notiz
            </label>
            <textarea
              id="note-content-textarea"
              placeholder="Inhalt der Notiz..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              aria-label="Inhalt der neuen Notiz"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'create' ? 'Notiz erstellen' : 'Änderungen speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}