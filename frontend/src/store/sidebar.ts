import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SideBarState {
  active: string;
  changeIcon: (alias: string) => void;
}
export const useSideBarStore = create<SideBarState>()(
  devtools((set) => ({
    active: 'Home',
    changeIcon: (alias: string) => set((state) => ({ ...state, active: alias })),
  })),
);
