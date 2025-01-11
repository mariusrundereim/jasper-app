"use client";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  File,
  FolderClosed,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import { Folder, Note } from "../types/notes";

interface SidebarProps {
  folders: Folder[];
  selectedNote?: Note;
  onSelectNote: (note: Note) => void;
  onCreateNote: (folderId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onUpdateFolder: (folderId: string, updates: Partial<Folder>) => void;
}

function Sidebar({
  folders,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Toggle folder
  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Create folder
  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
    setNewFolderName("");
  };

  // Handle folder submit
  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setIsCreatingFolder(false);
      setNewFolderName("");
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Header with New File/Folder buttons */}
      <div className="border-b p-4">
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => selectedFolderId && onCreateNote(selectedFolderId)}
          >
            New File
          </button>
          <button
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={handleCreateFolder}
          >
            New Folder
          </button>
        </div>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-auto p-2">
        {/* New Folder Input */}
        {isCreatingFolder && (
          <form onSubmit={handleFolderSubmit} className="mb-2">
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => {
                if (!newFolderName.trim()) {
                  setIsCreatingFolder(false);
                }
              }}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
              placeholder="Enter folder name..."
            />
          </form>
        )}

        {/* Folders */}
        {folders.map((folder) => (
          <div key={folder.id} className="mb-1">
            <div
              className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 ${
                selectedFolderId === folder.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <button
                className="p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
              >
                {expandedFolders[folder.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <FolderClosed className="h-4 w-4" />
              <span className="flex-1 text-sm">{folder.name}</span>

              {/* Edit/Delete buttons - only shown when folder is selected */}
              {selectedFolderId === folder.id && (
                <div className="flex gap-1">
                  <button
                    className="rounded p-1 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateFolder(folder.id, {
                        name:
                          prompt("New folder name:", folder.name) ||
                          folder.name,
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded p-1 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this folder and all its notes?")) {
                        onDeleteFolder(folder.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            {expandedFolders[folder.id] && (
              <div className="ml-4 mt-1 space-y-1">
                {folder.notes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer ${
                      selectedNote?.id === note.id
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onSelectNote(note)}
                  >
                    <File className="h-4 w-4" />
                    <span className="text-sm">{note.title}</span>
                    <button
                      className="ml-auto rounded p-1 opacity-0 hover:bg-gray-200 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this note?")) {
                          onDeleteNote(note.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
