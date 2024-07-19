// store.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  'phone number': string;
}

interface StoreState {
  isUserLoggedin: boolean;
  setIsLogin: (value: boolean) => void;
  allUsers: User[];
  addUser: (user: User) => void;
}

const useStore = create<StoreState>((set) => ({
  isUserLoggedin: false,
  setIsLogin: (value: boolean) => set({ isUserLoggedin: value }),
  allUsers: [],
  addUser: (user: User) =>
    set((state) => ({ allUsers: [...state.allUsers, user] }))
}));

export default useStore;
