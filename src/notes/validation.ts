import type { NoteCategory, NotesSnapshot, StudyNote } from "./types";

export const MAX_NOTES_FILE_BYTES = 50_000_000;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const id = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= 200;
const timestamp = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export function validateNotesSnapshot(value: unknown): NotesSnapshot {
  const fail = (): never => {
    throw new Error("File ghi chú không hợp lệ hoặc có phiên bản chưa được hỗ trợ. Dữ liệu hiện tại chưa bị thay đổi.");
  };
  if (!record(value) || value.version !== 1 || !Array.isArray(value.categories) || !Array.isArray(value.notes)) return fail();
  if (value.categories.length > 100_000 || value.notes.length > 100_000) return fail();
  const categoryIds = new Set<string>();
  const categories: NoteCategory[] = value.categories.map((item) => {
    if (!record(item) || !id(item.id) || typeof item.name !== "string" || !item.name.trim() || item.name.length > 120 || !timestamp(item.createdAt) || !timestamp(item.updatedAt) || categoryIds.has(item.id)) fail();
    categoryIds.add(item.id);
    return { id: item.id, name: item.name, createdAt: item.createdAt, updatedAt: item.updatedAt };
  });
  const noteIds = new Set<string>();
  const notes: StudyNote[] = value.notes.map((item) => {
    if (!record(item) || !id(item.id) || (item.categoryId !== null && (!id(item.categoryId) || !categoryIds.has(item.categoryId))) || (item.lessonId !== null && !id(item.lessonId)) || typeof item.title !== "string" || item.title.length > 300 || typeof item.bodyMarkdown !== "string" || item.bodyMarkdown.length > 5_000_000 || !timestamp(item.createdAt) || !timestamp(item.updatedAt) || noteIds.has(item.id)) fail();
    noteIds.add(item.id);
    return { id: item.id, categoryId: item.categoryId, lessonId: item.lessonId, title: item.title, bodyMarkdown: item.bodyMarkdown, createdAt: item.createdAt, updatedAt: item.updatedAt };
  });
  return { version: 1, categories, notes };
}

export function parseNotesJson(text: string): NotesSnapshot {
  if (new Blob([text]).size > MAX_NOTES_FILE_BYTES) {
    throw new Error("File ghi chú vượt quá 50 MB. Dữ liệu hiện tại chưa bị thay đổi.");
  }
  let value: unknown;
  try { value = JSON.parse(text); }
  catch { throw new Error("File JSON không đọc được. Dữ liệu hiện tại chưa bị thay đổi."); }
  return validateNotesSnapshot(value);
}
