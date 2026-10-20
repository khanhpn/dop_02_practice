import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, Stack, Typography } from "@mui/material";
import NoteAltOutlined from "@mui/icons-material/NoteAltOutlined";
import { Link as RouterLink } from "react-router-dom";
import { listNotes } from "../notes/db";
import { migrateLegacyNotes } from "../notes/migrate";
import type { StudyNote } from "../notes/types";

export function LessonNotesSummary({ lessonId, legacy }: { lessonId: string; legacy: Record<string, string> }) {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        await migrateLegacyNotes(legacy);
        const all = await listNotes();
        if (active) { setNotes(all.filter((note) => note.lessonId === lessonId)); setError(""); }
      } catch (cause) { if (active) setError((cause as Error).message); }
    })();
    return () => { active = false; };
  }, [lessonId, legacy]);
  return <Card sx={{ p: 3 }}>
    <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}><NoteAltOutlined color="primary" /><Typography variant="h4">Ghi chú của bạn cho bài này</Typography></Stack>
    {error && <Alert severity="error" sx={{ mb: 2 }}>Chưa mở được ghi chú: {error}. Ghi chú cũ vẫn còn trong dữ liệu tiến độ.</Alert>}
    {notes.length ? <Stack spacing={1} sx={{ mb: 2 }}>{notes.slice(0, 3).map((note) => <Box key={note.id} sx={{ borderLeft: "3px solid", borderColor: "primary.main", pl: 1.5 }}><Typography fontWeight={650}>{note.title || "Ghi chú chưa đặt tên"}</Typography><Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.bodyMarkdown || "Chưa có nội dung"}</Typography></Box>)}</Stack> : <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Chưa có ghi chú cho bài này. Ghi lại điểm dễ nhầm bằng cách hiểu của bạn để lần ôn sau tìm lại nhanh hơn.</Typography>}
    <Button component={RouterLink} to={`/notes?lesson=${encodeURIComponent(lessonId)}`} variant="contained">{notes.length ? `Mở ${notes.length} ghi chú` : "Viết ghi chú cho bài này"}</Button>
  </Card>;
}
