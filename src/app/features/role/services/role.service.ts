import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';
import { Role, RoleRequestModel } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpClient);

  getRoles(): Observable<ApiResponse<PaginatedData<Role[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Role[]>>>(`${environment.apiUrl}/Role`);
  }

  getRoleById(id: number): Observable<ApiResponse<PaginatedData<Role[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Role[]>>>(`${environment.apiUrl}/Role/${id}`);
  }

  createRole(payload: RoleRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/Role`, payload);
  }

  updateRole(payload: RoleRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/Role`, payload);
  }

  deleteRole(payload: RoleRequestModel): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/Role/${payload.id}`);
  }
}
