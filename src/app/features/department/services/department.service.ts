import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import {
  Department,
  DepartmentRequestModel,
  QueryParams,
} from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(HttpClient);

  getDepartments(
    params: QueryParams,
  ): Observable<ApiResponse<PaginatedData<Department>>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber ?? 1)
      .set('pageSize', params.pageSize ?? 10);

    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiResponse<PaginatedData<Department>>>(
      `${environment.apiUrl}/Department`,
      { params: httpParams },
    );
  }
  getDepartmentById(
    id: number,
  ): Observable<ApiResponse<DepartmentRequestModel>> {
    return this.http.get<ApiResponse<DepartmentRequestModel>>(
      `${environment.apiUrl}/Department/${id}`,
    );
  }

  createDepartment(
    payload: DepartmentRequestModel,
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${environment.apiUrl}/Department`,
      payload,
    );
  }

  updateDepartment(
    id: number,
    payload: DepartmentRequestModel,
  ): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(
      `${environment.apiUrl}/Department/${id}`,
      payload,
    );
  }

  deleteDepartment(id: Number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${environment.apiUrl}/Department/${id}`,
    );
  }
}
