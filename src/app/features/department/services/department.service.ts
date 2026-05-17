import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { Department, DepartmentRequestModel } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(HttpClient);

  getDepartments(): Observable<ApiResponse<PaginatedData<Department[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Department[]>>>(`${environment.apiUrl}/Department`);
  }

  getDepartmentById(id: number): Observable<ApiResponse<PaginatedData<Department[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Department[]>>>(`${environment.apiUrl}/Department/${id}`);
  }

  createDepartment(payload: DepartmentRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/Department`, payload);
  }

  updateDepartment(payload: DepartmentRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/Department`, payload);
  }

  deleteDepartment(payload: DepartmentRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/Department/${payload.id}`);
  }
}
