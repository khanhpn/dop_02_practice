export interface NoteCategory {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface StudyNote {
  id: string;
  categoryId: string | null;
  lessonId: string | null;
  title: string;
  bodyMarkdown: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotesSnapshot {
  version: 1;
  categories: NoteCategory[];
  notes: StudyNote[];
}

export type NoteSaveStatus = "loading" | "saving" | "saved" | "error";
