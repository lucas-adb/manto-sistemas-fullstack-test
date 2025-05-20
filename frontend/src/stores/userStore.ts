import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserStore } from '../types/user';

const userStore = create(
  persist<UserStore>(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
    }),
    {
      name: 'user-manto',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default userStore;
