import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import FormatBoldRounded from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRounded from "@mui/icons-material/FormatItalicRounded";
import StrikethroughSRounded from "@mui/icons-material/StrikethroughSRounded";
import FormatListBulletedRounded from "@mui/icons-material/FormatListBulletedRounded";
import FormatListNumberedRounded from "@mui/icons-material/FormatListNumberedRounded";
import CheckBoxOutlined from "@mui/icons-material/CheckBoxOutlined";
import FormatQuoteRounded from "@mui/icons-material/FormatQuoteRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import DataObjectRounded from "@mui/icons-material/DataObjectRounded";
import LinkRounded from "@mui/icons-material/LinkRounded";
import TableChartOutlined from "@mui/icons-material/TableChartOutlined";
import HorizontalRuleRounded from "@mui/icons-material/HorizontalRuleRounded";
import EditNoteRounded from "@mui/icons-material/EditNoteRounded";
import ViewColumnOutlined from "@mui/icons-material/ViewColumnOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import type { StudyNote, NoteSaveStatus } from "../notes/types";
import { MarkdownPreview } from "./MarkdownPreview";

type EditorMode = "write" | "preview" | "split";

export function MarkdownEditor({ note, status, onChange, onBlur }: { note: StudyNote; status: NoteSaveStatus; onChange: (note: StudyNote) => void; onBlur: () => void }) {
  const [mode, setMode] = useState<EditorMode>("write");
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

  function selection() {
    const start = editor.current?.selectionStart ?? note.bodyMarkdown.length;
    return { start, end: editor.current?.selectionEnd ?? start };
  }
  function commit(start: number, end: number, replacement: string, selectStart: number, selectEnd: number) {
    const bodyMarkdown = note.bodyMarkdown.slice(0, start) + replacement + note.bodyMarkdown.slice(end);
    if (bodyMarkdown.length > 5_000_000) return;
    onChange({ ...note, bodyMarkdown });
    setMode((current) => current === "preview" ? "write" : current);
    requestAnimationFrame(() => {
      editor.current?.focus();
      editor.current?.setSelectionRange(selectStart, selectEnd);
    });
  }
  function wrap(before: string, after: string, placeholder: string) {
    const { start, end } = selection();
    const value = note.bodyMarkdown.slice(start, end) || placeholder;
    commit(start, end, before + value + after, start + before.length, start + before.length + value.length);
  }
  function heading(level: 1 | 2) {
    const { start } = selection();
    const text = note.bodyMarkdown;
    const lineStart = start === 0 ? 0 : text.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = text.indexOf("\n", start);
    const end = lineEnd === -1 ? text.length : lineEnd;
    const line = text.slice(lineStart, end);
    const existing = /^#{1,6}\s+/.exec(line)?.[0] ?? "";
    const value = line.slice(existing.length) || "Tiêu đề";
    const prefix = `${"#".repeat(level)} `;
    commit(lineStart, end, prefix + value, lineStart + prefix.length, lineStart + prefix.length + value.length);
  }
  function lines(marker: (index: number) => string, placeholder: string) {
    const { start, end } = selection();
    const text = note.bodyMarkdown;
    const lineStart = start === 0 ? 0 : text.lastIndexOf("\n", start - 1) + 1;
    const endLine = text.indexOf("\n", Math.max(start, end - 1));
    const lineEnd = endLine === -1 ? text.length : endLine;
    const original = text.slice(lineStart, lineEnd) || placeholder;
    const replacement = original.split("\n").map((line, index) => marker(index) + line).join("\n");
    commit(lineStart, lineEnd, replacement, lineStart + marker(0).length, lineStart + replacement.length);
  }
  function block(before: string, after: string, placeholder: string) {
    const { start, end } = selection();
    const text = note.bodyMarkdown;
    const lead = start > 0 && text[start - 1] !== "\n" ? "\n" : "";
    const tail = end < text.length && text[end] !== "\n" ? "\n" : "";
    const value = text.slice(start, end) || placeholder;
    const replacement = lead + before + value + after + tail;
    commit(start, end, replacement, start + lead.length + before.length, start + lead.length + before.length + value.length);
  }
  function handleShortcut(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    if (key === "b") { event.preventDefault(); wrap("**", "**", "nội dung"); }
    if (key === "i") { event.preventDefault(); wrap("*", "*", "nội dung"); }
    if (key === "k") { event.preventDefault(); wrap("[", "](https://)", "liên kết"); }
  }
  const controls = [
    { label: "Tiêu đề cấp 1", icon: <strong>H1</strong>, run: () => heading(1) },
    { label: "Tiêu đề cấp 2", icon: <strong>H2</strong>, run: () => heading(2) },
    { label: "In đậm", icon: <FormatBoldRounded />, run: () => wrap("**", "**", "nội dung") },
    { label: "In nghiêng", icon: <FormatItalicRounded />, run: () => wrap("*", "*", "nội dung") },
    { label: "Gạch ngang chữ", icon: <StrikethroughSRounded />, run: () => wrap("~~", "~~", "nội dung") },
    { label: "Danh sách gạch đầu dòng", icon: <FormatListBulletedRounded />, run: () => lines(() => "- ", "Mục mới") },
    { label: "Danh sách đánh số", icon: <FormatListNumberedRounded />, run: () => lines((index) => `${index + 1}. `, "Mục mới") },
    { label: "Danh sách việc cần làm", icon: <CheckBoxOutlined />, run: () => lines(() => "- [ ] ", "Việc cần làm") },
    { label: "Trích dẫn", icon: <FormatQuoteRounded />, run: () => lines(() => "> ", "Nội dung trích dẫn") },
    { label: "Mã trong văn bản", icon: <CodeRounded />, run: () => wrap("`", "`", "mã") },
    { label: "Khối mã", icon: <DataObjectRounded />, run: () => block("```\n", "\n```", "mã hoặc lệnh") },
    { label: "Liên kết", icon: <LinkRounded />, run: () => wrap("[", "](https://)", "liên kết") },
    { label: "Bảng", icon: <TableChartOutlined />, run: () => block("| Cột 1 | Cột 2 |\n| --- | --- |\n| ", " | Giá trị |", "Nội dung") },
    { label: "Đường phân cách", icon: <HorizontalRuleRounded />, run: () => block("\n---\n", "", "") },
  ];

  return (
    <Box className="notes-editor-shell">
      <Stack className="notes-editor-heading" direction="row" alignItems="center" gap={2}>
        <TextField fullWidth variant="standard" placeholder="Tiêu đề ghi chú" aria-label="Tiêu đề ghi chú" value={note.title} onChange={(event) => onChange({ ...note, title: event.target.value })} onBlur={onBlur} slotProps={{ htmlInput: { maxLength: 300 } }} sx={{ minWidth: 0, flex: 1, "& input": { fontSize: 22, fontWeight: 700, lineHeight: 1.35 } }} />
        <Typography variant="caption" color={status === "error" ? "error" : "text.secondary"} role="status" sx={{ flexShrink: 0 }}>
          {status === "saving" ? "Đang lưu…" : status === "saved" ? "Đã lưu trong trình duyệt này" : status === "error" ? "Chưa lưu được" : "Đang tải…"}
        </Typography>
      </Stack>
      <Box className="notes-editor-toolbar">
        <Box className="notes-format-actions" role="toolbar" aria-label="Định dạng Markdown">
          {controls.map((control) => <Tooltip key={control.label} title={control.label} arrow><IconButton size="small" aria-label={control.label} onClick={control.run}>{control.icon}</IconButton></Tooltip>)}
        </Box>
        <Box className="notes-view-actions" role="group" aria-label="Chế độ soạn thảo">
          <Tooltip title="Viết" arrow><IconButton size="small" aria-label="Viết" aria-pressed={mode === "write"} onClick={() => setMode("write")}><EditNoteRounded /></IconButton></Tooltip>
          <Tooltip title="Viết và xem" arrow><IconButton size="small" aria-label="Viết và xem" aria-pressed={mode === "split"} onClick={() => setMode("split")}><ViewColumnOutlined /></IconButton></Tooltip>
          <Tooltip title="Xem trước" arrow><IconButton size="small" aria-label="Xem trước" aria-pressed={mode === "preview"} onClick={() => setMode("preview")}><VisibilityOutlined /></IconButton></Tooltip>
        </Box>
      </Box>
      <Box className={`notes-editor-grid ${mode === "split" ? "is-split" : ""}`}>
        {mode !== "preview" && <textarea ref={editor} aria-label="Nội dung ghi chú Markdown" className="notes-textarea" placeholder={"Viết theo cách hiểu của bạn…\n\n## Điểm dễ nhầm\n- ..."} maxLength={5_000_000} value={note.bodyMarkdown} onChange={(event) => onChange({ ...note, bodyMarkdown: event.target.value })} onKeyDown={handleShortcut} onBlur={onBlur} />}
        {mode !== "write" && <Box className="notes-preview-pane">{headings.length > 2 && <Box className="notes-outline"><Typography variant="caption" fontWeight={700}>TRONG GHI CHÚ NÀY</Typography>{headings.map((item, index) => <button key={`${item.title}-${index}`} type="button" style={{ paddingLeft: `${(item.level - 1) * 12}px` }} onClick={(event) => { const pane = event.currentTarget.closest(".notes-preview-pane"); pane?.querySelectorAll("h1,h2,h3")[index]?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>{item.title}</button>)}</Box>}<MarkdownPreview value={note.bodyMarkdown} /></Box>}
      </Box>
    </Box>
  );
}
