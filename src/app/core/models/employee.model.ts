export interface EmployeeModel {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  joiningDate: string;
  departmentName: string;
  designationName: string;
  employmentStatusName: string;
}


export interface EmployeeRequestModel {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  joiningDate: string;
  departmentId: number;
  designationId: number;
  employmentStatusId: number;
  userId: number;
}
