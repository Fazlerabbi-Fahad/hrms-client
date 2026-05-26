export interface Salary {
  id: number;
  employeeName: string;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance?: number;
  effectiveFrom?: Date;
  effectiveTo: Date;
}

export interface SalaryRequestModel  {
  id?: number;
  employeeId: number;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance?: number;
  effectiveFrom?: Date;
  effectiveTo: Date;
  userId:number
}


export interface SalaryApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: Salary[];
  message?: string;
  errors?: string[] | null;
}

