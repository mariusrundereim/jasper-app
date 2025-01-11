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
} from "lucide-react";
import { Folder, Note } from "../types/notes";

interface SidebarProps {
  folders: Folder[];
  selectedNote?: Note;
  onSelectNote: (note: Note) => void;
  onCreateNote: (folderId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onCreateFolder: () => void;
}

function Sidebar({
  folders,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onCreateFolder,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Notes</h1>
      </div>

      <div className="flex-1 overflow-auto px-2">
        {folders.map((folder) => (
          <div key={folder.id} className="mb-2">
            <div
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleFolder(folder.id)}
            >
              {expandedFolders[folder.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <FolderClosed className="h-4 w-4" />
              <span className="text-sm font-medium">{folder.name}</span>

              <button
                className="ml-auto rounded-sm p-1 hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNote(folder.id);
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

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

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          className="ml-auto rounded-sm p-1 hover:bg-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[120px] rounded-md bg-white p-1 shadow-md"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-gray-100"
                            onClick={() => onDeleteNote(note.id)}
                          >
                            Delete Note
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4">
        <button
          className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
          onClick={onCreateFolder}
        >
          <Plus className="h-4 w-4" />
          New Folder
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
