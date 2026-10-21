import { parseNotesJson, MAX_NOTES_FILE_BYTES } from "./validation";
import type { NotesSnapshot } from "./types";

export function downloadJson(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadNotesJson(snapshot: NotesSnapshot): void {
  const date = new Date().toISOString().slice(0, 10);
  const text = JSON.stringify(snapshot, null, 2);
  parseNotesJson(text);
  downloadJson(text, `dop-study-notes-${date}.json`);
}

export async function readNotesFile(file: File): Promise<NotesSnapshot> {
  if (file.size > MAX_NOTES_FILE_BYTES) throw new Error("Tệp ghi chú vượt quá 50 MB. Dữ liệu hiện tại chưa bị thay đổi.");
  return parseNotesJson(await file.text());
}
