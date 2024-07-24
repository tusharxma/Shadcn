// store.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
}

interface StoreState {
  isUserLoggedin: boolean;
  setIsLogin: (value: boolean) => void;
  openModel: string;
  // userId :  number;
  setOpenModel: (value: string) => void;
}

const useStore = create<StoreState>((set) => ({
  isUserLoggedin: false,
  setIsLogin: (value: boolean) => set({ isUserLoggedin: value }),
  openModel: '',
  // userId: 0,
  setOpenModel: (value: string) => set({ openModel: value })
}));

export default useStore;
