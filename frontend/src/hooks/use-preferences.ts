import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_PREFERENCES,
  getBrowserStorage,
  loadPreferences,
  PREFERENCES_KEY,
  writeJSON,
} from "@/lib/custlist/storage";
import type { Preferences, StorageLike } from "@/lib/custlist/types";

/** Aplica as preferências visuais no elemento <html>. */
export function applyPreferencesToDocument(prefs: Preferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", prefs.theme === "dark");
  root.setAttribute("data-accent", prefs.accent);
  root.setAttribute("data-density", prefs.density);
  root.setAttribute("data-text-size", prefs.textSize);
}

export function usePreferences(storage?: StorageLike | null) {
  const [preferences, setPreferences] = useState<Preferences>({ ...DEFAULT_PREFERENCES });
  const [saveFailed, setSaveFailed] = useState(false);
  const storageRef = useRef<StorageLike | null>(null);
  const prefsRef = useRef<Preferences>(preferences);

  useEffect(() => {
    const resolved = storage === undefined ? getBrowserStorage() : storage;
    storageRef.current = resolved;
    const result = loadPreferences(resolved);
    prefsRef.current = result.preferences;
    setPreferences(result.preferences);
    setSaveFailed(!result.ok);
  }, [storage]);

  useEffect(() => {
    applyPreferencesToDocument(preferences);
  }, [preferences]);

  const persist = useCallback((next: Preferences) => {
    prefsRef.current = next;
    setPreferences(next);
    const target = storageRef.current;
    setSaveFailed(!target || !writeJSON(target, PREFERENCES_KEY, next));
  }, []);

  const update = useCallback(
    (patch: Partial<Preferences>) => persist({ ...prefsRef.current, ...patch }),
    [persist],
  );

  const reset = useCallback(() => persist({ ...DEFAULT_PREFERENCES }), [persist]);

  return { preferences, update, reset, saveFailed };
}
