import { openNotesDb } from "./db";
import type { StudyNote } from "./types";

export async function migrateLegacyNotes(legacy: Record<string, string>): Promise<{ migrated: number }> {
  const entries = Object.entries(legacy).filter(([, body]) => body.trim().length > 0);
  if (entries.length === 0) return { migrated: 0 };
  const db = await openNotesDb();
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  let migrated = 0;
  const done = new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Không chuyển được ghi chú cũ."));
    tx.onabort = () => reject(tx.error ?? new Error("Không chuyển được ghi chú cũ."));
  });
  for (const [lessonId, bodyMarkdown] of entries) {
    const id = `legacy:${lessonId}`;
    const get = store.get(id);
    get.onsuccess = () => {
      if (get.result) return;
      const now = Date.now();
      const note: StudyNote = { id, categoryId: null, lessonId, title: "Ghi chú từ bài học", bodyMarkdown, createdAt: now, updatedAt: now };
      store.put(note);
      migrated++;
    };
  }
  await done;
  return { migrated };
}
