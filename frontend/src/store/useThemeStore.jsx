import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (newTheme) => set({ theme: newTheme }), // 🎯 fixed placement
    }),
    {
      name: "theme-preference",
      storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({ theme: state.theme }),
    }
  )
);
