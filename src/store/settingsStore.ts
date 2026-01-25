import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  author: string;
  copyright: string;
  title: string;
  description: string;
  previewMode: boolean;
  showGrid: boolean;
  showFog: boolean;
  wireframe: boolean;
  projectPath: string;
  setAuthor: (author: string) => void;
  setCopyright: (copyright: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPreviewMode: (previewMode: boolean) => void;
  togglePreviewMode: () => void;
  toggleShowGrid: () => void;
  toggleShowFog: () => void;
  toggleWireframe: () => void;
  setProjectPath: (path: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      author: "",
      copyright: "",
      title: "",
      description: "",
      previewMode: false,
      showGrid: true,
      showFog: true,
      wireframe: false,
      projectPath: "",
      setAuthor: (author) => set({ author }),
      setCopyright: (copyright) => set({ copyright }),
      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      togglePreviewMode: () =>
        set((state) => ({ previewMode: !state.previewMode })),
      toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleShowFog: () => set((state) => ({ showFog: !state.showFog })),
      toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
      setProjectPath: (path) => set({ projectPath: path }),
    }),
    {
      name: "rehkuh-settings",
    },
  ),
);
