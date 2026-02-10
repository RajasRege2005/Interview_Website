export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    token_type: string;
  };
}
