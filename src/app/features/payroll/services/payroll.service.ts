import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PagedResult, PayrollQueryParams, PayrollReport, PayrollRequest, PayrollResponse } from '../model/payroll.model';
import { environment } from '../../../../environments/environments';
@Injectable({ providedIn: 'root' })
export class PayrollService {
  constructor(private http: HttpClient) {}

  getAll(params: PayrollQueryParams):
    Observable<ApiResponse<PagedResult<PayrollResponse>>> {
    let httpParams = new HttpParams();

    if (params.pageNumber)
      httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params.pageSize)
      httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.employeeId)
      httpParams = httpParams.set('employeeId', params.employeeId);
    if (params.month)
      httpParams = httpParams.set('month', params.month);
    if (params.year)
      httpParams = httpParams.set('year', params.year);
    if (params.paymentStatusId)
      httpParams = httpParams.set('paymentStatusId', params.paymentStatusId);

    return this.http.get<ApiResponse<PagedResult<PayrollResponse>>>(
     `${environment.apiUrl}/Payroll`, { params: httpParams }
    );
  }

  getById(id: number): Observable<ApiResponse<PayrollResponse>> {
    return this.http.get<ApiResponse<PayrollResponse>>(
      `${environment.apiUrl}/Payroll/${id}`
    );
  }

  processPayroll(request: PayrollRequest):
    Observable<ApiResponse<PayrollResponse>> {
    return this.http.post<ApiResponse<PayrollResponse>>(
      `${environment.apiUrl}/Payroll/process`, request
    );
  }

  markAsPaid(id: number): Observable<ApiResponse<PayrollResponse>> {
    return this.http.put<ApiResponse<PayrollResponse>>(
      `${environment.apiUrl}/Payroll/${id}/mark-paid`, {}
    );
  }

  getMonthlyReport(month: number, year: number):
    Observable<ApiResponse<PayrollReport>> {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year);
    return this.http.get<ApiResponse<PayrollReport>>(
      `${environment.apiUrl}/Payroll/report`, { params }
    );
  }
}
