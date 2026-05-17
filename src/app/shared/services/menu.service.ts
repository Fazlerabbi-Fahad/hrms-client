

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);

  getMenus(): Observable<ApiResponse<PaginatedData<Menu[]>>> {
    return this.http.get<ApiResponse<PaginatedData<Menu[]>>>(`${environment.apiUrl}/Menu`);
  }

}
