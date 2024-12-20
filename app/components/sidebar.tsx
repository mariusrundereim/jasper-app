"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
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

function Sidebar({ folders, selectedNote, onSelectNote }: SidebarProps) {
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
    <div>
      <div>
        <h1>Notes</h1>
      </div>
    </div>
  );
}

export default Sidebar;
