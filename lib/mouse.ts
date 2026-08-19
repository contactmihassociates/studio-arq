import { create } from "zustand";

interface MouseStore {
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  label: string;
  setMouse: (x: number, y: number, rawX: number, rawY: number) => void;
  setLabel: (label: string) => void;
}

export const useMouse = create<MouseStore>((set) => ({
  x: 0.5,
  y: 0.5,
  rawX: 0,
  rawY: 0,
  label: "",
  setMouse: (x, y, rawX, rawY) => set({ x, y, rawX, rawY }),
  setLabel: (label) => set({ label }),
}));
