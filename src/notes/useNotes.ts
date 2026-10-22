import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { deleteCategoryAndUncategorize, deleteNote, listCategories, listNotes, putCategory, putNote, replaceNotesSnapshot } from "./db";
import type { NoteCategory, NoteSaveStatus, NotesSnapshot, StudyNote } from "./types";

const DRAFT_PREFIX = "dop-study-notes:pending-v2:";

function readDrafts(): Map<string, StudyNote> {
  const drafts = new Map<string, StudyNote>();
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(DRAFT_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const note: unknown = JSON.parse(raw);
        if (note !== null && typeof note === "object" &&
          "id" in note && typeof note.id === "string" && key === DRAFT_PREFIX + note.id &&
          "title" in note && typeof note.title === "string" &&
          "bodyMarkdown" in note && typeof note.bodyMarkdown === "string" &&
          "updatedAt" in note && typeof note.updatedAt === "number" &&
          "tags" in note && Array.isArray(note.tags)) drafts.set(note.id, note as StudyNote);
      } catch { /* Leave unreadable entries untouched for manual recovery. */ }
    }
  } catch {
    // IndexedDB may still be available when localStorage is blocked.
  }
  return drafts;
}

function writeDraft(note: StudyNote) {
  const key = DRAFT_PREFIX + note.id;
  const existing = localStorage.getItem(key);
  if (existing) {
    try { JSON.parse(existing); }
    catch { throw new Error("Bản nháp cũ không đọc được; dữ liệu gốc chưa bị ghi đè."); }
  }
  localStorage.setItem(key, JSON.stringify(note));
}

function clearDraft(note: StudyNote) {
  const key = DRAFT_PREFIX + note.id;
  if (localStorage.getItem(key) === JSON.stringify(note)) localStorage.removeItem(key);
}

function clearAllDrafts() {
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(DRAFT_PREFIX)) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
}

function useNotesStore() {
  const [initialDrafts] = useState(readDrafts);
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([...initialDrafts.values()]);
  const [status, setStatus] = useState<NoteSaveStatus>("loading");
  const [error, setError] = useState("");
  const pending = useRef(initialDrafts);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const revision = useRef(0);
  const reloadEpoch = useRef(0);
  const deletedIds = useRef(new Set<string>());

  const reload = useCallback(async () => {
    const startedAt = revision.current;
    const epoch = ++reloadEpoch.current;
    try {
      const [nextCategories, nextNotes] = await Promise.all([listCategories(), listNotes()]);
      if (epoch !== reloadEpoch.current) return;
      setCategories(nextCategories);
      // An IndexedDB read may complete after the user edits or deletes a note.
      setNotes((current) => {
        const merged = new Map(nextNotes.filter((note) => !deletedIds.current.has(note.id)).map((note) => [note.id, note]));
        if (revision.current !== startedAt) current.forEach((note) => merged.set(note.id, note));
        pending.current.forEach((note) => merged.set(note.id, note));
        return [...merged.values()];
      });
      if (pending.current.size === 0) { setStatus("saved"); setError(""); }
    } catch (cause) {
      setStatus("error");
      setError(`Không mở được kho ghi chú: ${(cause as Error).message}`);
    }
  }, []);
  const flush = useCallback((): Promise<void> => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (pending.current.size === 0) return queue.current;
    queue.current = queue.current.catch(() => undefined).then(async () => {
      const batch = [...pending.current.values()];
      let journalError: unknown;
      for (const note of batch) {
        await putNote(note);
        if (pending.current.get(note.id) === note) {
          try { clearDraft(note); }
          catch (cause) { journalError = cause; }
          pending.current.delete(note.id);
        }
      }
      if (journalError) throw journalError;
      if (pending.current.size === 0) { setStatus("saved"); setError(""); }
    }).catch((cause: unknown) => {
      setStatus("error");
      setError(`Chưa hoàn tất việc lưu ghi chú. Hãy xuất JSON trước khi tải lại hoặc đóng trang. Chi tiết: ${(cause as Error).message}`);
      throw cause;
    });
    return queue.current;
  }, []);

  useEffect(() => {
    void reload().then(() => {
      if (pending.current.size > 0) void flush().catch(() => undefined);
    });
  }, [reload, flush]);

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") void flush().catch(() => undefined); };
    document.addEventListener("visibilitychange", onHide);
    return () => { document.removeEventListener("visibilitychange", onHide); if (timer.current) clearTimeout(timer.current); void flush().catch(() => undefined); };
  }, [flush]);

  const updateNote = useCallback((note: StudyNote) => {
    revision.current += 1;
    deletedIds.current.delete(note.id);
    const next = { ...note, updatedAt: Date.now() };
    setNotes((current) => current.some((item) => item.id === next.id) ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
    pending.current.set(next.id, next);
    try {
      writeDraft(next);
      setStatus("saving");
      setError("");
    } catch (cause) {
      setStatus("error");
      setError(`Chưa lưu được bản nháp dự phòng. Nội dung đang sửa vẫn còn trên trang này. Hãy xuất JSON trước khi tải lại hoặc đóng trang. Chi tiết: ${(cause as Error).message}`);
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void flush().catch(() => undefined); }, 500);
  }, [flush]);

  const createNote = useCallback((lessonId: string | null = null, categoryId: string | null = null) => {
    const now = Date.now();
    const note: StudyNote = { id: crypto.randomUUID(), categoryId, lessonId, title: "", bodyMarkdown: "", tags: [], pinned: false, needsReview: false, createdAt: now, updatedAt: now };
    updateNote(note);
    return note;
  }, [updateNote]);

  const createCategory = useCallback(async (name: string) => {
    const now = Date.now();
    const category: NoteCategory = { id: crypto.randomUUID(), name: name.trim(), createdAt: now, updatedAt: now };
    await putCategory(category);
    setCategories((current) => [...current, category]);
    return category;
  }, []);
  const renameCategory = useCallback(async (category: NoteCategory, name: string) => {
    const next = { ...category, name: name.trim(), updatedAt: Date.now() };
    await putCategory(next);
    setCategories((current) => current.map((item) => item.id === next.id ? next : item));
  }, []);
  const removeCategory = useCallback(async (id: string) => {
    await flush();
    await deleteCategoryAndUncategorize(id);
    setCategories((current) => current.filter((item) => item.id !== id));
    setNotes((current) => current.map((note) => note.categoryId === id ? { ...note, categoryId: null } : note));
  }, [flush]);
  const removeNote = useCallback(async (id: string) => {
    await flush();
    await deleteNote(id);
    revision.current += 1;
    deletedIds.current.add(id);
    pending.current.delete(id);
    setNotes((current) => current.filter((note) => note.id !== id));
  }, [flush]);

  const replaceAll = useCallback(async (snapshot: NotesSnapshot) => {
    reloadEpoch.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    await flush();
    // A stale journal must not revive notes that an imported snapshot replaces.
    clearAllDrafts();
    await replaceNotesSnapshot(snapshot);
    pending.current.clear();
    deletedIds.current.clear();
    await reload();
  }, [flush, reload]);

  return { categories, notes, status, error, createCategory, renameCategory, removeCategory, createNote, updateNote, removeNote, flush, reload, replaceAll };
}

const NotesContext = createContext<ReturnType<typeof useNotesStore> | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const store = useNotesStore();
  return createElement(NotesContext.Provider, { value: store }, children);
}

export function useNotes() {
  const store = useContext(NotesContext);
  if (!store) throw new Error("useNotes phải được dùng trong NotesProvider.");
  return store;
}
