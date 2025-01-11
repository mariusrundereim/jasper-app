import { Folder } from "../types/notes";

export const initialNotes: Folder[] = [
  {
    id: "1",
    name: "My Notes",
    notes: [
      {
        id: "1",
        title: "Welcome Note",
        content: "Welcome to the app!",
        folderId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Getting Started",
        content: "Here's how to get started...",
        folderId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    isExpanded: false,
  },
];
