import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { EmploymentStatus, EmploymentStatusRequestModel } from '../model/employment-status.model';

@Injectable({
  providedIn: 'root',
})
export class EmploymentStatusService {
  private readonly http = inject(HttpClient);

  getEmploymentStatuses(): Observable<ApiResponse<PaginatedData<EmploymentStatus[]>>> {
    return this.http.get<ApiResponse<PaginatedData<EmploymentStatus[]>>>(`${environment.apiUrl}/EmploymentStatus`);
  }

  getEmploymentStatusById(id: number): Observable<ApiResponse<PaginatedData<EmploymentStatus[]>>> {
    return this.http.get<ApiResponse<PaginatedData<EmploymentStatus[]>>>(`${environment.apiUrl}/EmploymentStatus/${id}`);
  }

  createEmploymentStatus(payload: EmploymentStatusRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/EmploymentStatus`, payload);
  }

  updateEmploymentStatus(payload: EmploymentStatusRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/EmploymentStatus`, payload);
  }

  deleteEmploymentStatus(payload: EmploymentStatusRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/EmploymentStatus/${payload.id}`);
  }
}
