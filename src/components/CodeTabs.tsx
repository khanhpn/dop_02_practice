import { useState } from "react";
import { Box, Button, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import type { CodeExample } from "../content/types";
export function CodeTabs({ example }: { example: CodeExample }) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        tab === 0 ? example.cloudformation : example.terraform,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <Box
      sx={{
        my: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1 }}
      >
        <Typography variant="h4">{example.title}</Typography>
        <Chip
          size="small"
          variant="outlined"
          label={example.deployable ? "Mẫu cấu hình đầy đủ" : "Đoạn mã minh hoạ"}
        />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setCopied(false);
          }}
          aria-label="Công cụ khai báo hạ tầng bằng mã"
        >
          <Tab label="CloudFormation" />
          <Tab label="Terraform" />
        </Tabs>
        <Button size="small" startIcon={<ContentCopyRounded />} onClick={copy}>
          {copied ? "Đã sao chép" : "Sao chép"}
        </Button>
      </Stack>
      <Box component="pre" className="code-block" tabIndex={0}>
        <code>{tab === 0 ? example.cloudformation : example.terraform}</code>
      </Box>
      <Typography variant="body2" sx={{ p: 2 }}>
        {example.explanation}
      </Typography>
    </Box>
  );
}
