import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, ButtonGroup, Stack, TextField, Typography } from "@mui/material";
import type { StudyNote, NoteSaveStatus } from "../notes/types";
import { MarkdownPreview } from "./MarkdownPreview";

export function MarkdownEditor({ note, status, onChange, onBlur }: { note: StudyNote; status: NoteSaveStatus; onChange: (note: StudyNote) => void; onBlur: () => void }) {
  const [mode, setMode] = useState<"write" | "preview" | "split">("write");
  const editor = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { setMode("write"); }, [note.id]);
  const headings = useMemo(() => {
    const result: { level: number; title: string }[] = [];
    let fence: "`" | "~" | null = null;
    for (const line of note.bodyMarkdown.split("\n")) {
      const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
      if (marker) { if (!fence) fence = marker[0] as "`" | "~"; else if (fence === marker[0]) fence = null; continue; }
      if (fence || /^\s{4}/.test(line)) continue;
      const match = /^\s{0,3}(#{1,3})\s+(.+)$/.exec(line);
      if (match) result.push({ level: match[1].length, title: match[2].trim() });
    }
    return result;
  }, [note.bodyMarkdown]);
  function insert(before: string, after = before) {
    const target = editor.current;
    if (!target) return;
    const start = target.selectionStart, end = target.selectionEnd;
    const selected = note.bodyMarkdown.slice(start, end);
    onChange({ ...note, bodyMarkdown: note.bodyMarkdown.slice(0, start) + before + (selected || "nội dung") + after + note.bodyMarkdown.slice(end) });
    requestAnimationFrame(() => { target.focus(); target.setSelectionRange(start + before.length, start + before.length + (selected || "nội dung").length); });
  }
  function handleShortcut(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.metaKey || event.ctrlKey)) return;
    if (event.key.toLowerCase() === "b") { event.preventDefault(); insert("**"); }
    if (event.key.toLowerCase() === "i") { event.preventDefault(); insert("_"); }
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
          {status === "saving" ? "Đang lưu…" : status === "saved" ? "Đã lưu trong trình duyệt này" : status === "error" ? "Chưa lưu được" : "Đang tải…"}
        </Typography>
      </Stack>
      <ButtonGroup size="small" variant="text" sx={{ mb: 1.5 }} aria-label="Chế độ soạn thảo">
        <Button onClick={() => setMode("write")} aria-pressed={mode === "write"}>Viết</Button>
        <Button onClick={() => setMode("split")} aria-pressed={mode === "split"}>Viết và xem</Button>
        <Button onClick={() => setMode("preview")} aria-pressed={mode === "preview"}>Xem trước</Button>
      </ButtonGroup>
      <Box className={`notes-editor-grid ${mode === "split" ? "is-split" : ""}`}>
        {mode !== "preview" && <textarea ref={editor} aria-label="Nội dung ghi chú Markdown" className="notes-textarea" placeholder="Viết theo cách hiểu của bạn…\n\n## Điểm dễ nhầm\n- ..." maxLength={5_000_000} value={note.bodyMarkdown} onChange={(event) => onChange({ ...note, bodyMarkdown: event.target.value })} onKeyDown={handleShortcut} onBlur={onBlur} />}
        {mode !== "write" && <Box className="notes-preview-pane">{headings.length > 2 && <Box className="notes-outline"><Typography variant="caption" fontWeight={700}>TRONG GHI CHÚ NÀY</Typography>{headings.map((heading, index) => <button key={`${heading.title}-${index}`} type="button" style={{ paddingLeft: `${(heading.level - 1) * 12}px` }} onClick={(event) => { const pane = event.currentTarget.closest(".notes-preview-pane"); pane?.querySelectorAll("h1,h2,h3")[index]?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>{heading.title}</button>)}</Box>}<MarkdownPreview value={note.bodyMarkdown} /></Box>}
      </Box>
    </Box>
  );
}
