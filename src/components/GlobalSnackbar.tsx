import { Snackbar } from "@archway/valet";
import { useNotificationStore } from "@/store/notificationStore";

export function GlobalSnackbar() {
  const current = useNotificationStore((s) => s.current);
  const dismiss = useNotificationStore((s) => s.dismiss);

  return (
    <Snackbar
      open={!!current}
      onClose={dismiss}
      message={current?.message}
      autoHideDuration={4000}
      sx={{
        ...(current?.type === "error" && {
          backgroundColor: "#ef5350",
        }),
        ...(current?.type === "success" && {
          backgroundColor: "#66bb6a",
        }),
      }}
    />
  );
}
