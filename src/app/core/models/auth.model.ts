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


export interface RegisterRequest {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  roleIds: number[];
}

export interface RegisterRequestResponse {
  isSuccess: boolean;
  statusCode: number;
  data: null;
  message: string;
  errors: string[] | null;
}
