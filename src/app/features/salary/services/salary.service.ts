import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { Salary, SalaryRequestModel } from '../models/salary.model';
import { QueryParams } from '../../department/models/department.model';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private readonly http = inject(HttpClient);

  getSalaries(
    params: QueryParams,
  ): Observable<ApiResponse<PaginatedData<Salary>>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber ?? 1)
      .set('pageSize', params.pageSize ?? 10);

    return this.http.get<ApiResponse<PaginatedData<Salary>>>(
      `${environment.apiUrl}/Salary`,
      { params: httpParams },
    );
  }

  getSalaryById(id: number): Observable<ApiResponse<Salary>> {
    return this.http.get<ApiResponse<Salary>>(
      `${environment.apiUrl}/Salary/${id}`,
    );
  }

  createSalary(payload: SalaryRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${environment.apiUrl}/Salary`,
      payload,
    );
  }

  updateSalary(
    id: number,
    payload: SalaryRequestModel,
  ): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(
      `${environment.apiUrl}/Salary/${id}`,
      payload,
    );
  }

  deleteSalary(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${environment.apiUrl}/Salary/${id}`,
    );
  }
}
