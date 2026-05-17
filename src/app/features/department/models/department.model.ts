export interface Department {
  id: number;
  departmentName: string;
}

export interface DepartmentRequestModel {
  id?: number;
  departmentName: string;
  userId:number
}


export interface DepartmentApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: Department[];
  message?: string;
  errors?: string[] | null;
}
