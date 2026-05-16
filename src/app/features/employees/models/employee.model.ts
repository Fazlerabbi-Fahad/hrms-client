export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joiningDate: string;
  departmentName: string;
  designationName: string;
  employmentStatusName: string;
}

export interface EmployeeApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: Employee[];
  message?: string;
  errors?: string[] | null;
}
