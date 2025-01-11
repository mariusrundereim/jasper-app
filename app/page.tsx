"use client";

import { useState, useCallback } from "react";
import { Note, Folder, ViewMode } from "./types/notes";
import Sidebar from "./components/sidebar";
import MarkdownEditor from "./components/markdown-editor";

function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  // Handler for selecting a note
  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNote(note);
  }, []);

  // Handler for creating a new note
  const createNote = useCallback((folderId: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      folderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId
          ? { ...folder, notes: [...folder.notes, newNote] }
          : folder
      )
    );

    setSelectedNote(newNote);
  }, []);

  // Handler for deleting a note
  const handleDeleteNote = useCallback(
    (noteId: string) => {
      setFolders((prevFolders) =>
        prevFolders.map((folder) => ({
          ...folder,
          notes: folder.notes.filter((note) => note.id !== noteId),
        }))
      );

      if (selectedNote?.id === noteId) {
        setSelectedNote(undefined);
      }
    },
    [selectedNote]
  );

  // Handler for creating a new folder
  const createFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: name,
      notes: [],
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  }, []);

  // Handler for updating a note

  const handleUpdateFolder = useCallback(
    (folderId: string, updates: Partial<Folder>) => {
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId ? { ...folder, ...updates } : folder
        )
      );
    },
    []
  );

  const handleUpdateNote = useCallback(
    (updatedNote: Partial<Note>) => {
      if (!selectedNote) return;

      const newNote = {
        ...selectedNote,
        ...updatedNote,
        updatedAt: new Date(),
      };

      setFolders((prevFolders) =>
        prevFolders.map((folder) => ({
          ...folder,
          notes: folder.notes.map((note) =>
            note.id === selectedNote.id ? newNote : note
          ),
        }))
      );

      setSelectedNote(newNote);
    },
    [selectedNote]
  );

  // Handler for deleting a folder
  const handleDeleteFolder = useCallback(
    (folderId: string) => {
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.id !== folderId)
      );
      // If the selected note was in the deleted folder, clear the selection
      if (selectedNote?.folderId === folderId) {
        setSelectedNote(undefined);
      }
    },
    [selectedNote]
  );

  return (
    <div className="flex h-screen">
      <Sidebar
        folders={folders}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onCreateNote={createNote}
        onDeleteNote={handleDeleteNote}
        onCreateFolder={createFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
      />
      <main className="flex-1 overflow-hidden p-4">
        {selectedNote ? (
          <MarkdownEditor note={selectedNote} onUpdateNote={handleUpdateNote} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select or create a note to get started
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
