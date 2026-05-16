import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthState, User } from "../Types/Auth.type";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuthData: (user: User) =>
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
