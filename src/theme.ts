import { createTheme } from "@mui/material/styles";
export const makeTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "light" ? "#235b50" : "#8ad5ba" },
      secondary: { main: "#cb7738" },
      background: {
        default: mode === "light" ? "#f6f7f9" : "#101d20",
        paper: mode === "light" ? "#ffffff" : "#19292d",
      },
      text: {
        primary: mode === "light" ? "#233231" : "#e8f0ec",
        secondary: mode === "light" ? "#5b6c66" : "#a2b5af",
      },
      divider: mode === "light" ? "#e9eeeb" : "#30433e",
    },
    typography: {
      fontFamily:
        '"Be Vietnam Pro", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 14,
      h1: { fontSize: "2.7rem", fontWeight: 750, letterSpacing: "-1.4px" },
      h2: { fontSize: "1.85rem", fontWeight: 750, letterSpacing: "-.75px" },
      h3: { fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-.3px" },
      h4: { fontSize: "1rem", fontWeight: 700 },
      body1: { lineHeight: 1.85 },
      body2: { lineHeight: 1.75 },
      button: { textTransform: "none", fontWeight: 650 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10, padding: "10px 20px" } },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: {
            borderColor: mode === "light" ? "#e6ece8" : "#30433e",
            boxShadow: "0 3px 12px #163d2c03",
          },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, fontSize: 11 } } },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 48 },
          indicator: { height: 3, borderRadius: 4 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 650, minHeight: 48 },
        },
      },
      MuiTextField: { defaultProps: { size: "small" } },
      MuiTooltip: { defaultProps: { arrow: true } },
    },
  });
