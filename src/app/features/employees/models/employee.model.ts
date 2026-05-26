export interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  joiningDate: string;
  dateOfBirth: string;
  departmentName: string;
  designationName: string;
  employmentStatusName: string;
}

export interface EmployeeRequestModel {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  joiningDate: string;
  dateOfBirth: string;
  departmentId: number;
  designationId: number;
  employmentStatusId: number;
  userId: number;
}

export interface EmployeeApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: Employee[];
  message?: string;
  errors?: string[] | null;
}
