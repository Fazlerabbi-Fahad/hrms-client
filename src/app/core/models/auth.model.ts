export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  statusCode: number;
  data: AuthUser;
  message: string;
  errors: string[] | null;
}

export interface AuthUser {
  userId?: number;
  id?: number;
  token: string;
  userName: string;
  roles: string[];
  expiresAt: string;
}
