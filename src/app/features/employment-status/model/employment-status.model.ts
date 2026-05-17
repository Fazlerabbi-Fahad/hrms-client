export interface EmploymentStatus {
  id: number;
  statusName: string;
}

export interface EmploymentStatusRequestModel {
  id?: number;
  statusName: string;
  userId:number
}

export interface EmploymentStatusApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: EmploymentStatus[];
  message?: string;
  errors?: string[] | null;
}
