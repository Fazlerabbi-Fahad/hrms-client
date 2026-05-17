import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { Salary, SalaryRequestModel } from '../models/salary.model';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private readonly http = inject(HttpClient);

  getSalaries(): Observable<ApiResponse<PaginatedData<Salary[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Salary[]>>>(`${environment.apiUrl}/Salary`);
  }

  getSalaryById(id: number): Observable<ApiResponse<PaginatedData<Salary[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Salary[]>>>(`${environment.apiUrl}/Salary/${id}`);
  }

  createSalary(payload: SalaryRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/Salary`, payload);
  }

  updateSalary(payload: SalaryRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/Salary`, payload);
  }

  deleteSalary(payload: SalaryRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/Salary/${payload.id}`);
  }
}
