'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DialogTrigger } from '@/components/ui/dialog';
import { useNoteDialog } from '@/lib/note-dialog-context';
import { NotesDialog } from '@/components/ui/notes-dialog';
import { DeleteNotesDialog } from '@/components/ui/delete-notes-dialog';
import { Edit, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

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

  const confirmDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    setNoteToDelete(null);
  };

  const openDeleteDialog = (note: Note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
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
        <NotesDialog
          mode="create"
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={(title, content) => {
            addNote(title, content);
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full">
              Neue Notiz erstellen
            </Button>
          </DialogTrigger>
        </NotesDialog>
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
                  <NotesDialog
                    mode="edit"
                    open={true}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingNote(null);
                        setEditTitle('');
                        setEditContent('');
                      }
                    }}
                    onSubmit={(title, content) => {
                      if (title.trim() && content.trim()) {
                        setNotes(notes.map(n =>
                          n.id === note.id
                            ? { ...n, title: title.trim(), content: content.trim(), updatedAt: new Date() }
                            : n
                        ));
                        setEditingNote(null);
                        setEditTitle('');
                        setEditContent('');
                      }
                    }}
                    onDelete={() => {
                      setNotes(notes.filter(n => n.id !== note.id));
                      setEditingNote(null);
                      setEditTitle('');
                      setEditContent('');
                    }}
                    noteId={note.id}
                    initialTitle={editTitle}
                    initialContent={editContent}
                  />
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
                        onClick={() => {
                          setEditingNote(note);
                          setEditTitle(note.title);
                          setEditContent(note.content);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(note)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
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

      {/* Delete Confirmation Dialog */}
      <DeleteNotesDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => noteToDelete && confirmDeleteNote(noteToDelete.id)}
        noteTitle={noteToDelete?.title || ''}
      />
    </div>
  );
}