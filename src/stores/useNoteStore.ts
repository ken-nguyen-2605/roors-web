// stores/useNoteStore.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Quantities = Record<number, number>;

type NoteState = {
  quantities: Quantities;
  setQuantity: (id: number, qty: number) => void;
  reset: () => void;
  totalItems: () => number;
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      quantities: {},

      setQuantity: (id, qty) =>
        set((s) => {
          const next = { ...s.quantities };
          if (qty <= 0) delete next[id];   // 👈 auto-remove at 0
          else next[id] = qty;
          return { quantities: next };
        }),

      reset: () => set({ quantities: {} }),

      totalItems: () =>
        Object.values(get().quantities).reduce((a, b) => a + b, 0),
    }),
    {
      name: "note-storage",                         // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ quantities: state.quantities }), // persist only what you need
      version: 1,
    }
  )
);
