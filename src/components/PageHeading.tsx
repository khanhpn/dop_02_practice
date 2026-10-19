import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        mb: 4,
      }}
    >
      <Box>
        <Typography className="eyebrow" color="secondary" sx={{ mb: 1 }}>
          {eyebrow}
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: "2rem", md: "2.45rem" } }}
        >
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
          {description}
        </Typography>
      </Box>
      {action}
    </Box>
  );
}
