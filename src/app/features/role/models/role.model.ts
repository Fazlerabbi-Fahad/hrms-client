export interface Role {
  id: number;
  roleName: string;
}

export interface RoleRequestModel  {
  id?: number;
  roleName: string;
  userId:number
}


export interface RoleApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: Role[];
  message?: string;
  errors?: string[] | null;
}
