import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { Employee } from '../models/employee.model';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { EmployeeRequestModel } from '../../../core/models/employee.model';
import { QueryParams } from '../../department/models/department.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees(params:QueryParams): Observable<ApiResponse<PaginatedData<Employee>>> {
     let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber ?? 1)
      .set('pageSize', params.pageSize ?? 10);

    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<ApiResponse<PaginatedData<Employee>>>(`${environment.apiUrl}/Employee`, { params: httpParams });
  }
  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${environment.apiUrl}/Employee/${id}`);
  }

  getEmployeeForEditById(id: number): Observable<ApiResponse<EmployeeRequestModel>> {
    return this.http.get<ApiResponse<EmployeeRequestModel>>(`${environment.apiUrl}/Employee/${id}`);
  }

  createEmployee(payload: EmployeeRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/Employee`, payload);
  }

  updateEmployee(id: number, payload: EmployeeRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/Employee/${id}`, payload);
  }

  deleteEmployee(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/Employee/${id}`);
  }
}
