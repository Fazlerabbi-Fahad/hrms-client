import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { Designation, DesignationRequestModel } from '../models/designation.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private readonly http = inject(HttpClient);

  getDesignations(): Observable<ApiResponse<PaginatedData<Designation[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Designation[]>>>(`${environment.apiUrl}/Designation`);
  }

  getDesignationById(id: number): Observable<ApiResponse<PaginatedData<Designation[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Designation[]>>>(`${environment.apiUrl}/Designation/${id}`);
  }

  createDesignation(payload: DesignationRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/Designation`, payload);
  }

  updateDesignation(payload: DesignationRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/Designation`, payload);
  }

  deleteDesignation(payload: DesignationRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/Designation/${payload.id}`);
  }
}
