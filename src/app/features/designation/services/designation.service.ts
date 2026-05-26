import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import {
  Designation,
  DesignationRequestModel,
} from '../models/designation.model';
import { QueryParams } from '../../department/models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private readonly http = inject(HttpClient);

  getDesignations(
    params: QueryParams,
  ): Observable<ApiResponse<PaginatedData<Designation>>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber ?? 1)
      .set('pageSize', params.pageSize ?? 10);

    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<ApiResponse<PaginatedData<Designation>>>(
      `${environment.apiUrl}/Designation`,
      { params: httpParams },
    );
  }

  getDesignationById(id: number): Observable<ApiResponse<Designation>> {
    return this.http.get<ApiResponse<Designation>>(
      `${environment.apiUrl}/Designation/${id}`,
    );
  }

  createDesignation(
    payload: DesignationRequestModel,
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${environment.apiUrl}/Designation`,
      payload,
    );
  }

  updateDesignation(
    id: number,
    payload: DesignationRequestModel,
  ): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(
      `${environment.apiUrl}/Designation/${id}`,
      payload,
    );
  }

  deleteDesignation(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${environment.apiUrl}/Designation/${id}`,
    );
  }
}
