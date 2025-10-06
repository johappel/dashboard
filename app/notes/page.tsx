'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNoteDialog } from '@/lib/note-dialog-context';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (title: string, content: string) => void;
}

function NewNoteDialog({ open, onOpenChange, onAddNote }: NewNoteDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onAddNote(title.trim(), content.trim());
      setTitle('');
      setContent('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Notiz erstellen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Notiz mit Titel und Inhalt.
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
            Notiz erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Willkommen bei deinen Notizen!',
      content: 'Hier kannst du deine Gedanken und Ideen festhalten.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  const { isOpen, setIsOpen } = useNoteDialog();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const addNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingNote && editTitle.trim() && editContent.trim()) {
      setNotes(notes.map(note =>
        note.id === editingNote.id
          ? { ...note, title: editTitle.trim(), content: editContent.trim(), updatedAt: new Date() }
          : note
      ));
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

  return (
    <div className="flex flex-col h-full w-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meine Notizen</h1>
        <p className="text-muted-foreground">
          Verwalte hier deine Gedanken und Ideen
        </p>
      </div>

      {/* Dialog und Trigger-Button */}
      <div className="mb-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              Neue Notiz erstellen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Neue Notiz erstellen</DialogTitle>
              <DialogDescription>
                Erstelle eine neue Notiz mit Titel und Inhalt.
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
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  aria-label="Inhalt der neuen Notiz"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => {
                if (editTitle.trim() && editContent.trim()) {
                  addNote(editTitle.trim(), editContent.trim());
                  setEditTitle('');
                  setEditContent('');
                  setIsOpen(false);
                }
              }}>
                Notiz erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mb-6" />

      {/* Notizen Liste */}
      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Noch keine Notizen vorhanden. Erstelle deine erste Notiz oben!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                {editingNote?.id === note.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Titel bearbeiten"
                    />
                    <label htmlFor="edit-note-content" className="sr-only">
                      Inhalt bearbeiten
                    </label>
                    <textarea
                      id="edit-note-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[80px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      aria-label="Inhalt der Notiz bearbeiten"
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm">
                        Speichern
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-4">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                      <span>
                        Erstellt: {note.createdAt.toLocaleDateString('de-DE')}
                      </span>
                      <span>
                        Aktualisiert: {note.updatedAt.toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(note)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        onClick={() => deleteNote(note.id)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        Löschen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}