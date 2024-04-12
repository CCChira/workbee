import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {persist} from "zustand/esm/middleware";
interface Drawer {
  open: boolean;
}

interface DrawerState {
  drawer: Drawer;
  toggleDrawer: () => void;
  setDrawer: (status: boolean) => void;
}

export const useDrawerStore = create<DrawerState>()(
  devtools(
      set => ({
        drawer: {
          open: false
        },
        toggleDrawer: () => set(state => ({...state, drawer:{open: !state.drawer.open}})),
        setDrawer: (status: boolean) => set(state => ({...state, drawer:{open: status}})),
      })
  )
)