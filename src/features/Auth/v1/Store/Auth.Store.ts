import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthState, User } from "../Types/Auth.type";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuthData: (user: User, token?: string) =>
        set({
          user,
          token: token ?? null,
        }),

      clearAuthData: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
