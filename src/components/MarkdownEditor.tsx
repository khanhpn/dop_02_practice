import { useRef, useState } from "react";
import { Box, Button, ButtonGroup, Stack, TextField, Typography } from "@mui/material";
import type { StudyNote, NoteSaveStatus } from "../notes/types";
import { MarkdownPreview } from "./MarkdownPreview";

export function MarkdownEditor({ note, status, onChange, onBlur }: { note: StudyNote; status: NoteSaveStatus; onChange: (note: StudyNote) => void; onBlur: () => void }) {
  const [mode, setMode] = useState<"write" | "preview" | "split">("split");
  const editor = useRef<HTMLTextAreaElement>(null);
  function insert(before: string, after = before) {
    const target = editor.current;
    if (!target) return;
    const start = target.selectionStart, end = target.selectionEnd;
    const selected = note.bodyMarkdown.slice(start, end);
    onChange({ ...note, bodyMarkdown: note.bodyMarkdown.slice(0, start) + before + (selected || "nội dung") + after + note.bodyMarkdown.slice(end) });
    requestAnimationFrame(() => { target.focus(); target.setSelectionRange(start + before.length, start + before.length + (selected || "nội dung").length); });
  }
  return (
    <Box className="notes-editor-shell">
      <TextField fullWidth variant="standard" placeholder="Tiêu đề ghi chú" aria-label="Tiêu đề ghi chú" value={note.title} onChange={(event) => onChange({ ...note, title: event.target.value })} onBlur={onBlur} slotProps={{ htmlInput: { maxLength: 300 } }} sx={{ mb: 2, "& input": { fontSize: 24, fontWeight: 700, lineHeight: 1.4 } }} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
        <ButtonGroup size="small" variant="outlined" aria-label="Định dạng Markdown">
          <Button onClick={() => insert("## ", "")}>Tiêu đề</Button>
          <Button onClick={() => insert("**")}>Đậm</Button>
          <Button onClick={() => insert("- ", "")}>Danh sách</Button>
          <Button onClick={() => insert("`")}>Mã</Button>
          <Button onClick={() => insert("[", "](https://)")}>Liên kết</Button>
        </ButtonGroup>
        <Typography variant="caption" color={status === "error" ? "error" : "text.secondary"} role="status">
          {status === "saving" ? "Đang lưu…" : status === "saved" ? "Đã lưu trên trình duyệt" : status === "error" ? "Chưa lưu được" : "Đang tải…"}
        </Typography>
      </Stack>
      <ButtonGroup size="small" variant="text" sx={{ mb: 1.5 }} aria-label="Chế độ soạn thảo">
        <Button onClick={() => setMode("write")} aria-pressed={mode === "write"}>Viết</Button>
        <Button onClick={() => setMode("split")} aria-pressed={mode === "split"}>Song song</Button>
        <Button onClick={() => setMode("preview")} aria-pressed={mode === "preview"}>Xem trước</Button>
      </ButtonGroup>
      <Box className={`notes-editor-grid ${mode === "split" ? "is-split" : ""}`}>
        {mode !== "preview" && <textarea ref={editor} aria-label="Nội dung ghi chú Markdown" className="notes-textarea" placeholder="Viết theo cách hiểu của bạn…\n\n## Điểm dễ nhầm\n- ..." value={note.bodyMarkdown} onChange={(event) => onChange({ ...note, bodyMarkdown: event.target.value })} onBlur={onBlur} />}
        {mode !== "write" && <Box className="notes-preview-pane"><MarkdownPreview value={note.bodyMarkdown} /></Box>}
      </Box>
    </Box>
  );
}
