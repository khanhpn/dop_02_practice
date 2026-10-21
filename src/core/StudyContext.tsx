import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { StudyState } from "./types";
import {
  emptyState,
  parseBackup,
  serializeBackup,
  STORAGE_KEY,
} from "./storage";
interface StudyContextValue {
  state: StudyState;
  update: (fn: (state: StudyState) => StudyState) => void;
  replace: (state: StudyState) => void;
  replacePersisted: (state: StudyState) => void;
  error: string;
  dismissError: () => void;
}
const StudyContext = createContext<StudyContextValue | null>(null);
function initialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return {
      state: raw ? parseBackup(raw) : emptyState(),
      error: "",
      canSave: true,
    };
  } catch {
    return {
      state: emptyState(),
      error:
        "Không đọc được dữ liệu đã lưu trong trình duyệt. Bạn vẫn có thể học trong phiên hiện tại. Trước khi nhập bản sao lưu khác, hãy giữ một bản dữ liệu cũ nếu còn truy cập được.",
      canSave: false,
    };
  }
}
export function StudyProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(initialState);
  const [state, setState] = useState(initial.state);
  const [error, setError] = useState(initial.error);
  const canSave = useRef(initial.canSave);
  useEffect(() => {
    if (!canSave.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, serializeBackup(state));
    } catch {
      setError(
        "Trình duyệt không lưu được dữ liệu do hết dung lượng hoặc chức năng lưu trữ bị chặn. Tiến độ vẫn còn trong phiên hiện tại; hãy xuất bản sao lưu trước khi đóng trang.",
      );
    }
  }, [state]);
  const update = useCallback(
    (fn: (s: StudyState) => StudyState) => setState(fn),
    [],
  );
  const replace = useCallback((s: StudyState) => {
    canSave.current = true;
    setState(s);
    setError("");
  }, []);
  const replacePersisted = useCallback((s: StudyState) => {
    localStorage.setItem(STORAGE_KEY, serializeBackup(s));
    canSave.current = true;
    setState(s);
    setError("");
  }, []);
  // Count focused study time; background tabs do not inflate the total.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        setState((s) => ({ ...s, studyMinutes: s.studyMinutes + 1 }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  return (
    <StudyContext.Provider
      value={{
        state,
        update,
        replace,
        replacePersisted,
        error,
        dismissError: () => setError(""),
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}
export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error("StudyProvider is required");
  return value;
}
