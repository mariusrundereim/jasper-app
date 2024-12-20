"use client";
import { useState, useCallback } from "react";
import { Folder, Note, ViewMode } from "./types/notes";
import Sidebar from "./components/sidebar";

export default function Home() {
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  // State for managing folders and selected note
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "1",
      name: "My Notes",
      notes: [
        {
          id: "1",
          title: "Welcome Note",
          content: "Welcome to the app!",
          folderId: "1", // Match parent folder
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Getting Started",
          content: "Here's how to get started...",
          folderId: "1", // Match parent folder
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      isExpanded: false,
    },
  ]);

  // Select Note state
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  // Handler functions
  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNote(note);
  }, []);

  const handleCreateNote = useCallback((folderId: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      folderId: folderId,
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
  }, []);

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

  const handleCreateFolder = useCallback(() => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: "New Folder",
      notes: [],
    };
    setFolders((prev) => [...prev, newFolder]);
  }, []);

  return (
    <div>
      <Sidebar
        folders={folders}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}
