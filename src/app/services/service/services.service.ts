import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ServiceRequest, ServiceResponse } from '../model/Services.model';
import { ApiResponse } from '../model/ApiResponse.model';
import { PageResponse } from '../User/user.service';
import { handleApiResponse } from '../../core/utils/api.utils';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Add Service
  addService(request: ServiceRequest): Observable<ServiceResponse> {
    return this.http
      .post<ApiResponse<ServiceResponse>>(`${this.baseUrl}/service/addService`, request)
      .pipe(handleApiResponse());
  }

  // Get By ID
  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http
      .get<ApiResponse<ServiceResponse>>(`${this.baseUrl}/service/getServiceById/${id}`)
      .pipe(handleApiResponse());
  }

  // Get All (with search + pagination)
  getAllService(
    search?: string,
    page: number = 0,
    size: number = 10,
  ): Observable<PageResponse<ServiceResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<
        ApiResponse<PageResponse<ServiceResponse>>
      >(`${this.baseUrl}/public/service/getAllService`, { params })
      .pipe(handleApiResponse());
  }

  //  Update
  updateServiceById(
    id: number,
    request: ServiceRequest,
  ): Observable<ServiceResponse> {
    return this.http
      .put<
        ApiResponse<ServiceResponse>
      >(`${this.baseUrl}/service/updateServiceById/${id}`, request)
      .pipe(handleApiResponse());
  }

  //  Delete
  deleteServiceById(id: number): Observable<Record<string, string>> {
    return this.http
      .delete<
        ApiResponse<Record<string, string>>
      >(`${this.baseUrl}/service/deleteServiceById/${id}`)
      .pipe(handleApiResponse());
  }
}
