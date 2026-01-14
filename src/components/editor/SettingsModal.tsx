import { Stack, Typography, Button, Box } from "@archway/valet";
import { useSettingsStore } from "@/store/settingsStore";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const author = useSettingsStore((s) => s.author);
  const copyright = useSettingsStore((s) => s.copyright);
  const setAuthor = useSettingsStore((s) => s.setAuthor);
  const setCopyright = useSettingsStore((s) => s.setCopyright);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "rgba(26, 26, 46, 0.98)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
          padding: "24px",
          minWidth: "320px",
          maxWidth: "400px",
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Typography
          variant="h3"
          sx={{ marginBottom: "16px", fontSize: "18px" }}
        >
          Settings
        </Typography>

        <Stack gap={2}>
          <Stack gap={0.5}>
            <Typography variant="body" sx={{ fontSize: "12px", opacity: 0.7 }}>
              Author Name
            </Typography>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                height: "32px",
                fontSize: "13px",
                padding: "0 8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "inherit",
                boxSizing: "border-box",
              }}
            />
            <Typography variant="body" sx={{ fontSize: "11px", opacity: 0.5 }}>
              Included in exported TSP files
            </Typography>
          </Stack>

          <Stack gap={0.5}>
            <Typography variant="body" sx={{ fontSize: "12px", opacity: 0.7 }}>
              Copyright
            </Typography>
            <input
              type="text"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="e.g. CC BY 4.0 or All Rights Reserved"
              style={{
                width: "100%",
                height: "32px",
                fontSize: "13px",
                padding: "0 8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "inherit",
                boxSizing: "border-box",
              }}
            />
            <Typography variant="body" sx={{ fontSize: "11px", opacity: 0.5 }}>
              Included in exported TSP files
            </Typography>
          </Stack>

          <Stack direction="row" gap={1} sx={{ marginTop: "8px" }}>
            <Button size="sm" variant="filled" onClick={onClose}>
              Done
            </Button>
          </Stack>
        </Stack>
      </Box>
    </div>
  );
}
