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
        "Không đọc được dữ liệu đã lưu. Bạn vẫn có thể học trong phiên này. Hãy giữ bản backup trước khi nhập dữ liệu mới.",
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
        "Trình duyệt không lưu được dữ liệu (bộ nhớ đầy hoặc đang chặn storage). Hãy export backup; tiến độ hiện vẫn còn trong phiên này.",
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
