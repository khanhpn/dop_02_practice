import { useCallback, useEffect, useRef, useState } from "react";
import { deleteCategoryAndUncategorize, deleteNote, listCategories, listNotes, putCategory, putNote, replaceNotesSnapshot } from "./db";
import type { NoteCategory, NoteSaveStatus, NotesSnapshot, StudyNote } from "./types";

export function useNotes() {
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [status, setStatus] = useState<NoteSaveStatus>("loading");
  const [error, setError] = useState("");
  const pending = useRef(new Map<string, StudyNote>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const revision = useRef(0);

  const reload = useCallback(async () => {
    const startedAt = revision.current;
    try {
      const [nextCategories, nextNotes] = await Promise.all([listCategories(), listNotes()]);
      setCategories(nextCategories);
      // Loading/migration can finish after the user has started a draft.
      const drafts = pending.current;
      if (revision.current === startedAt) {
        setNotes([...nextNotes.filter((note) => !drafts.has(note.id)), ...drafts.values()]);
        if (drafts.size === 0) { setStatus("saved"); setError(""); }
      }
    } catch (cause) {
      setStatus("error");
      setError(`Không mở được kho ghi chú: ${(cause as Error).message}`);
    }
  }, []);
  useEffect(() => { void reload(); }, [reload]);

  const flush = useCallback((): Promise<void> => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (pending.current.size === 0) return queue.current;
    queue.current = queue.current.catch(() => undefined).then(async () => {
      const batch = [...pending.current.values()];
      for (const note of batch) {
        await putNote(note);
        if (pending.current.get(note.id) === note) pending.current.delete(note.id);
      }
      if (pending.current.size === 0) { setStatus("saved"); setError(""); }
    }).catch((cause: unknown) => {
      setStatus("error");
      setError(`Chưa lưu được ghi chú. Bản nháp vẫn còn trong tab này: ${(cause as Error).message}`);
      throw cause;
    });
    return queue.current;
  }, []);

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") void flush().catch(() => undefined); };
    document.addEventListener("visibilitychange", onHide);
    return () => { document.removeEventListener("visibilitychange", onHide); if (timer.current) clearTimeout(timer.current); void flush().catch(() => undefined); };
  }, [flush]);

  const updateNote = useCallback((note: StudyNote) => {
    revision.current += 1;
    const next = { ...note, updatedAt: Date.now() };
    setNotes((current) => current.some((item) => item.id === next.id) ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
    pending.current.set(next.id, next);
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void flush().catch(() => undefined); }, 500);
  }, [flush]);

  const createNote = useCallback((lessonId: string | null = null, categoryId: string | null = null) => {
    const now = Date.now();
    const note: StudyNote = { id: crypto.randomUUID(), categoryId, lessonId, title: "", bodyMarkdown: "", createdAt: now, updatedAt: now };
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
    pending.current.delete(id);
    setNotes((current) => current.filter((note) => note.id !== id));
  }, [flush]);

  const replaceAll = useCallback(async (snapshot: NotesSnapshot) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    await queue.current.catch(() => undefined);
    await replaceNotesSnapshot(snapshot);
    pending.current.clear();
    await reload();
  }, [reload]);

  return { categories, notes, status, error, createCategory, renameCategory, removeCategory, createNote, updateNote, removeNote, flush, reload, replaceAll };
}
