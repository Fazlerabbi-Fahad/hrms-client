export interface PayrollResponse {
  id: number;
  employeeId: number;
  empCode: string;
  employeeName: string;
  department: string;
  month: number;
  year: number;
  monthName: string;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  bonus: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: string;
  paymentDate: string | null;
  createdAt: string;
}

export interface PayrollRequest {
  employeeId: number;
  month: number;
  year: number;
}

export interface PayrollReport {
  month: number;
  year: number;
  monthName: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  pendingCount: number;
  paidCount: number;
}

export interface PayrollQueryParams {
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
  month?: number;
  year?: number;
  paymentStatusId?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
  message: string;
  errors: string[] | null;
}
