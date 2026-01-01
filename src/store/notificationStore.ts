import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

interface NotificationState {
  current: Notification | null;
  show: (notification: Omit<Notification, "id">) => void;
  dismiss: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  current: null,
  show: (notification) =>
    set({
      current: {
        ...notification,
        id: crypto.randomUUID(),
      },
    }),
  dismiss: () => set({ current: null }),
}));

export const showError = (message: string) =>
  useNotificationStore.getState().show({ message, type: "error" });

export const showSuccess = (message: string) =>
  useNotificationStore.getState().show({ message, type: "success" });

export const showInfo = (message: string) =>
  useNotificationStore.getState().show({ message, type: "info" });
