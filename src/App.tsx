import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import MenuRounded from "@mui/icons-material/MenuRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import {
  HashRouter,
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useStudy, StudyProvider } from "./core/StudyContext";
import { makeTheme } from "./theme";
import { domains, lessons, EXAM_GUIDE } from "./content";
import { Dashboard } from "./pages/Dashboard";
import { Curriculum } from "./pages/Curriculum";
import { LessonPage } from "./pages/LessonPage";
import { Practice } from "./pages/Practice";
import { Plan } from "./pages/Plan";
import { Settings } from "./pages/Settings";
import { CapstoneLab } from "./pages/CapstoneLab";
const navigation = [
  { to: "/", label: "Tổng quan", icon: DashboardOutlined },
  { to: "/curriculum", label: "Lộ trình kiến thức", icon: MenuBookOutlined },
  { to: "/practice", label: "Luyện tập & thi thử", icon: FactCheckOutlined },
  { to: "/plan", label: "Kế hoạch của tôi", icon: CalendarMonthOutlined },
];
function Shell() {
  const { state, update, error, dismissError } = useStudy();
  const theme = useMemo(
    () => makeTheme(state.settings.theme),
    [state.settings.theme],
  );
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    setMobileOpen(false);
    if (!location.pathname.startsWith("/lesson/"))
      window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  const current =
    navigation.find((n) => n.to === location.pathname)?.label ??
    (location.pathname.startsWith("/lesson/")
      ? "Bài học"
      : location.pathname === "/settings"
        ? "Cài đặt"
        : "Study workspace");
  const sidebar = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#132d2d",
        color: "#c4d3cc",
        p: 2.5,
      }}
    >
      <Box
        component={RouterLink}
        to="/"
        className="brand plain-link"
        sx={{
          display: "flex",
          gap: 1.3,
          alignItems: "center",
          py: 1,
          mb: 4,
          color: "#fff",
        }}
      >
        <Box
          sx={{
            width: 37,
            height: 40,
            display: "grid",
            placeItems: "center",
            bgcolor: "#f6b96c",
            color: "#173b34",
            borderRadius: "10px",
          }}
        >
          <BoltRounded sx={{ fontSize: 30 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 750,
              fontSize: 21,
              letterSpacing: "-.6px",
              lineHeight: 1.3,
            }}
          >
            dop<span style={{ color: "#f0b56e" }}>.</span>study
          </Typography>
          <Typography sx={{ fontSize: 9, letterSpacing: 2, color: "#90b0a5" }}>
            LEARN. BUILD. CERTIFY.
          </Typography>
        </Box>
      </Box>
      <Typography className="nav-section">KHÔNG GIAN HỌC</Typography>
      <List disablePadding sx={{ mb: 3 }}>
        {navigation.map(({ to, label, icon: Icon }) => (
          <ListItemButton
            component={RouterLink}
            to={to}
            key={to}
            selected={location.pathname === to}
            className="sidebar-link"
          >
            <ListItemIcon>
              <Icon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontSize: 12.5, fontWeight: 550 }}
            />
            {to === "/practice" && <Box className="tiny-badge">QUIZ</Box>}
          </ListItemButton>
        ))}
      </List>
      <Typography className="nav-section">EXAM DOMAINS</Typography>
      <List disablePadding>
        {domains.map((d) => (
          <ListItemButton
            component={RouterLink}
            to={`/curriculum?domain=${d.id}`}
            key={d.id}
            className="sidebar-link"
            selected={
              location.pathname === "/curriculum" &&
              location.search === `?domain=${d.id}`
            }
          >
            <ListItemIcon>
              <span className="domain-dot" style={{ background: d.color }} />
            </ListItemIcon>
            <ListItemText
              primary={d.title.replace(
                "Configuration Management & IaC",
                "Configuration & IaC",
              )}
              primaryTypographyProps={{ fontSize: 11.5, fontWeight: 500 }}
            />
            <Typography sx={{ fontSize: 10, opacity: 0.55 }}>
              {d.weight}%
            </Typography>
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flex: 1, minHeight: 24 }} />
      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: "#ffffff07",
          border: "1px solid #ffffff0b",
          mb: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 11, color: "#a3bcb2" }}>
            HÀNH TRÌNH CỦA BẠN
          </Typography>
          <BoltRounded sx={{ fontSize: 16, color: "#f3bd7c" }} />
        </Stack>
        <Typography sx={{ fontSize: 23, color: "#fff", fontWeight: 650 }}>
          {state.completed.length}
          <Box
            component="span"
            sx={{ fontSize: 12, color: "#9db6ab", fontWeight: 400 }}
          >
            {" "}
            / 72 bài học
          </Box>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, (state.completed.length / 72) * 100)}
          sx={{
            height: 4,
            borderRadius: 2,
            mt: 1.5,
            bgcolor: "#ffffff12",
            "& .MuiLinearProgress-bar": { bgcolor: "#f3b368" },
          }}
        />
        <Typography sx={{ fontSize: 10, color: "#8fac9f", mt: 1.3 }}>
          Từng bước nhỏ. Kiến thức vững.
        </Typography>
      </Box>
      <ListItemButton
        component={RouterLink}
        to="/settings"
        className="sidebar-link"
        selected={location.pathname === "/settings"}
      >
        <ListItemIcon>
          <SettingsOutlined sx={{ fontSize: 19 }} />
        </ListItemIcon>
        <ListItemText
          primary="Cài đặt & dữ liệu"
          primaryTypographyProps={{ fontSize: 12 }}
        />
      </ListItemButton>
      <Button
        href={EXAM_GUIDE}
        target="_blank"
        rel="noreferrer"
        endIcon={<ArrowOutwardRounded sx={{ fontSize: 13 }} />}
        sx={{ color: "#8fa89e", fontSize: 10, mt: 1 }}
      >
        AWS Exam Guide chính thức
      </Button>
    </Box>
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Box
          component="nav"
          aria-label="Điều hướng chính"
          sx={{ width: { lg: 252 }, flexShrink: 0 }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": { width: 252, border: 0 },
            }}
          >
            {sidebar}
          </Drawer>
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            sx={{
              display: { lg: "none" },
              "& .MuiDrawer-paper": { width: 270 },
            }}
          >
            {sidebar}
          </Drawer>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="header"
            sx={{
              height: 78,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, md: 4.5 },
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                aria-label="Mở menu"
                sx={{ display: { lg: "none" } }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuRounded />
              </IconButton>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Workspace
              </Typography>
              <ChevronRightRounded
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  display: { xs: "none", sm: "block" },
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 650 }}>
                {current}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                label="DOP-C02 · 10.2026"
                variant="outlined"
                size="small"
                sx={{
                  display: { xs: "none", md: "flex" },
                  color: "text.secondary",
                }}
              />
              <Tooltip
                title={
                  state.settings.theme === "light"
                    ? "Chuyển giao diện tối"
                    : "Chuyển giao diện sáng"
                }
              >
                <IconButton
                  aria-label="Đổi giao diện sáng tối"
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      settings: {
                        ...s.settings,
                        theme: s.settings.theme === "light" ? "dark" : "light",
                      },
                    }))
                  }
                >
                  {state.settings.theme === "light" ? (
                    <DarkModeOutlined sx={{ fontSize: 20 }} />
                  ) : (
                    <LightModeOutlined sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </Tooltip>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#e9efdf",
                  color: "#52623f",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                K
              </Avatar>
            </Stack>
          </Box>
          <Box
            component="main"
            id="main-content"
            sx={{ p: { xs: 2, sm: 3, md: 4.5 }, maxWidth: 1600, mx: "auto" }}
          >
            {error && (
              <Alert severity="warning" onClose={dismissError} sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/lab/observability" element={<CapstoneLab />} />
              <Route
                path="*"
                element={
                  <Box sx={{ py: 8, textAlign: "center" }}>
                    <Typography variant="h2">Không tìm thấy trang</Typography>
                    <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
                      Về tổng quan
                    </Button>
                  </Box>
                }
              />
            </Routes>
            <Box
              component="footer"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                pt: 4,
                mt: 4,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                dop.study · Học để hiểu, thực hành để nhớ.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lessons.length}/72 bài · Dữ liệu học lưu trên trình duyệt này
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default function App() {
  return (
    <HashRouter>
      <StudyProvider>
        <Shell />
      </StudyProvider>
    </HashRouter>
  );
}
