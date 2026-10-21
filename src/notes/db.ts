import type { NoteCategory, NotesSnapshot, StudyNote } from "./types";
import { validateNotesSnapshot } from "./validation";

const DB_NAME = "dop-study-notes";
const DB_VERSION = 2;
let databasePromise: Promise<IDBDatabase> | null = null;

export function openNotesDb(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error("Trình duyệt này không hỗ trợ IndexedDB để lưu ghi chú.")); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("categories")) db.createObjectStore("categories", { keyPath: "id" });
      if (!db.objectStoreNames.contains("notes")) {
        const notes = db.createObjectStore("notes", { keyPath: "id" });
        notes.createIndex("categoryId", "categoryId");
        notes.createIndex("lessonId", "lessonId");
        notes.createIndex("updatedAt", "updatedAt");
      } else if (request.transaction) {
        const notes = request.transaction.objectStore("notes");
        const cursor = notes.openCursor();
        cursor.onsuccess = () => {
          const row = cursor.result;
          if (!row) return;
          const note = row.value as Partial<StudyNote>;
          row.update({ ...note, tags: note.tags ?? [], pinned: note.pinned ?? false, needsReview: note.needsReview ?? false });
          row.continue();
        };
      }
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => { request.result.close(); databasePromise = null; };
      resolve(request.result);
    };
    request.onerror = () => reject(request.error?.name === "VersionError" ? new Error("Kho ghi chú đã được cập nhật ở thẻ trình duyệt khác. Hãy tải lại trang này rồi thử lại.") : request.error ?? new Error("Không mở được kho ghi chú."));
    request.onblocked = () => reject(new Error("Chưa thể cập nhật kho ghi chú vì một thẻ trình duyệt khác vẫn đang sử dụng dữ liệu. Hãy đóng các thẻ dop.study khác rồi thử lại."));
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
  const tx = db.transaction(["categories", "notes"], "readwrite");
  const done = finished(tx);
  const notes = tx.objectStore("notes");
  if (note.categoryId === null) notes.put(note);
  else {
    const category = tx.objectStore("categories").get(note.categoryId);
    category.onsuccess = () => notes.put(category.result ? note : { ...note, categoryId: null });
  }
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
  return { version: 2, categories: await categories, notes: await notes };
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
