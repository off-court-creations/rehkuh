import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useInitialTheme, Surface, Stack, Typography } from "@archway/valet";

const page = <T extends { default: React.ComponentType }>(
  p: () => Promise<T>,
) => lazy(() => p().then((m) => ({ default: m.default })));

const EditorPage = page(() => import("@/pages/editor/Editor"));

export function App() {
  useInitialTheme(
    {
      fonts: {
        heading: "Kumbh Sans",
        body: "Inter",
        mono: "JetBrains Mono",
        button: "Kumbh Sans",
      },
    },
    ["Kumbh Sans", "JetBrains Mono", "Inter"],
  );

  const Fallback = (
    <Surface>
      <Stack sx={{ padding: "2rem", alignItems: "center" }}>
        <Typography variant="subtitle">Loading…</Typography>
      </Stack>
    </Surface>
  );

  return (
    <Suspense fallback={Fallback}>
      <Routes>
        <Route path="/" element={<EditorPage />} />
      </Routes>
    </Suspense>
  );
}
