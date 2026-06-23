export type JWTPayload = {
  username: string;
  role: "admin" | "operator";
  exp: number;
};

export type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  role: JWTPayload["role"] | null;
  isExpired: boolean;
};
