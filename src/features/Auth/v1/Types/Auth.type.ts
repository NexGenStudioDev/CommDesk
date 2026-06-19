export interface User {
  _id: string;

  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;

  setAuthData: (user: User, token?: string) => void;
  clearAuthData: () => void;
}
