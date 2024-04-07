import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthEntity {
  accessToken: string;
  id: string;
  email: string;
  role: string;
}
interface UserState {
  accessToken: string | null;
  id: string | null;
  email: string | null;
  role: string | null;
  setUser: (auth: AuthEntity) => void;
  clearUser: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      id: null,
      email: null,
      role: null,
      setUser: (auth) => set({ ...auth }),
      clearUser: () =>
        set({ accessToken: null, id: null, email: null, role: null }),
    }),
    {
      name: 'user-auth', // unique name for the local storage record
      getStorage: () => localStorage,
    },
  ),
);
