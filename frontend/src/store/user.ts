import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { Roles } from '@/utils/types.ts';
export interface User {
  accessToken: string;
  id: string;
  email: string;
  role: Roles;
  loggedIn: boolean;
}
type UserState = {
  user: User;
  setUser: (user: User) => void;
  logoutUser: () => void;
};
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: {
          accessToken: '',
          id: '',
          email: '',
          role: Roles.UNASSIGNED,
          loggedIn: false,
        },
        setUser: (user: Omit<User, 'loggedIn'>) =>
          set((state) => ({
            ...state,
            user: {
              ...user,
              loggedIn: true,
            },
          })),
        logoutUser: () =>
          set((state) => ({
            ...state,
            user: { accessToken: '', id: '', email: '', role: Roles.UNASSIGNED, loggedIn: false },
          })),
      }),
      { name: 'user-storage' },
    ),
  ),
);
