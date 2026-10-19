import { Box, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import type { Diagram } from "../content/types";
export function FlowDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <Box
      component="figure"
      sx={{
        m: 0,
        p: 3,
        my: 3,
        bgcolor: "action.hover",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
      aria-label={diagram.title}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {diagram.title}
      </Typography>
      <Box
        component="ol"
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 1,
          listStyle: "none",
          p: 0,
          m: 0,
          flexWrap: "wrap",
        }}
      >
        {diagram.steps.map((step, i) => (
          <Box
            component="li"
            key={i}
            sx={{
              display: "flex",
              flex: 1,
              minWidth: 140,
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "100%",
              }}
            >
              <Typography
                className="eyebrow"
                color="secondary"
                sx={{ mb: 0.5 }}
              >
                0{i + 1}
              </Typography>
              <Typography variant="h4">{step.label}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {step.detail}
              </Typography>
            </Box>
            {i < diagram.steps.length - 1 && (
              <ArrowForwardRounded
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
            )}
          </Box>
        ))}
      </Box>
      <Typography
        component="figcaption"
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {diagram.caption}
      </Typography>
    </Box>
  );
}
