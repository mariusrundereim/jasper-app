export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
  lastModified: Date;
}

export interface Folder {
  id: string;
  name: string;
  notes: Note[];
  isExpanded?: boolean;
}

export type ViewMode = "preview" | "code";

export type NoteState = {
  notes: Note[];
  folders: Folder[];
  currentNote: Note | null;
};

export type NoteAction =
  | { type: "SET_CURRENT_NOTE"; payload: Note | null }
  | { type: "UPDATE_NOTE_TITLE"; payload: { id: string; title: string } }
  | { type: "UPDATE_NOTE_CONTENT"; payload: { id: string; content: string } }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "ADD_FOLDER"; payload: Folder }
  | { type: "DELETE_FOLDER"; payload: string };
