import type { NoteCategory, NotesSnapshot, StudyNote } from "./types";
import { validateNotesSnapshot } from "./validation";

const DB_NAME = "dop-study-notes";
const DB_VERSION = 1;
let databasePromise: Promise<IDBDatabase> | null = null;

export function openNotesDb(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error("Trình duyệt không hỗ trợ IndexedDB.")); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("categories")) db.createObjectStore("categories", { keyPath: "id" });
      if (!db.objectStoreNames.contains("notes")) {
        const notes = db.createObjectStore("notes", { keyPath: "id" });
        notes.createIndex("categoryId", "categoryId");
        notes.createIndex("lessonId", "lessonId");
        notes.createIndex("updatedAt", "updatedAt");
      }
    };
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    request.onerror = () => reject(request.error ?? new Error("Không mở được kho ghi chú."));
    request.onblocked = () => reject(new Error("Kho ghi chú đang được mở ở tab khác. Hãy đóng tab cũ rồi thử lại."));
  }).catch((error: unknown) => { databasePromise = null; throw error; });
  return databasePromise;
}

function finished(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("Không lưu được ghi chú."));
    transaction.onerror = () => reject(transaction.error ?? new Error("Không lưu được ghi chú."));
  });
}

function result<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Không đọc được ghi chú."));
  });
}

export async function listCategories(): Promise<NoteCategory[]> {
  const db = await openNotesDb();
  return result(db.transaction("categories", "readonly").objectStore("categories").getAll() as IDBRequest<NoteCategory[]>);
}
export async function listNotes(): Promise<StudyNote[]> {
  const db = await openNotesDb();
  return result(db.transaction("notes", "readonly").objectStore("notes").getAll() as IDBRequest<StudyNote[]>);
}
export async function putCategory(category: NoteCategory): Promise<void> {
  const db = await openNotesDb();
  const tx = db.transaction("categories", "readwrite");
  const done = finished(tx);
  tx.objectStore("categories").put(category);
  await done;
}
export async function putNote(note: StudyNote): Promise<void> {
  const db = await openNotesDb();
  const tx = db.transaction("notes", "readwrite");
  const done = finished(tx);
  tx.objectStore("notes").put(note);
  await done;
}
export async function deleteNote(id: string): Promise<void> {
  const db = await openNotesDb();
  const tx = db.transaction("notes", "readwrite");
  const done = finished(tx);
  tx.objectStore("notes").delete(id);
  await done;
}
export async function deleteCategoryAndUncategorize(id: string): Promise<void> {
  const db = await openNotesDb();
  const tx = db.transaction(["categories", "notes"], "readwrite");
  const done = finished(tx);
  tx.objectStore("categories").delete(id);
  const notes = tx.objectStore("notes");
  const cursor = notes.index("categoryId").openCursor(IDBKeyRange.only(id));
  cursor.onsuccess = () => {
    const item = cursor.result;
    if (!item) return;
    item.update({ ...item.value, categoryId: null, updatedAt: Date.now() });
    item.continue();
  };
  await done;
}
export async function readNotesSnapshot(): Promise<NotesSnapshot> {
  const db = await openNotesDb();
  const tx = db.transaction(["categories", "notes"], "readonly");
  const categories = result(tx.objectStore("categories").getAll() as IDBRequest<NoteCategory[]>);
  const notes = result(tx.objectStore("notes").getAll() as IDBRequest<StudyNote[]>);
  return { version: 1, categories: await categories, notes: await notes };
}
export async function replaceNotesSnapshot(snapshot: NotesSnapshot): Promise<void> {
  const safe = validateNotesSnapshot(snapshot);
  const db = await openNotesDb();
  const tx = db.transaction(["categories", "notes"], "readwrite");
  const done = finished(tx);
  const categories = tx.objectStore("categories");
  const notes = tx.objectStore("notes");
  categories.clear(); notes.clear();
  safe.categories.forEach((category) => categories.put(category));
  safe.notes.forEach((note) => notes.put(note));
  await done;
}
