import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;

  email: string;
  role: string;

}

interface AuthState {
  // token: string | null;
  user: User | null;

  setAuthData: (user: User) => void;
  clearAuthData: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuthData: (user) =>
        set({
          user,
        }),

      clearAuthData: () =>
        set({
        
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
