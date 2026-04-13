import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../User/user.service';
import { ClientRequest, ClientResponse } from '../model/Client.model';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse.model';
import { handleApiResponse } from '../../core/utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // ✅ BASE URL
  private readonly BASE_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // =========================
  // ✅ GET ALL CLIENTS
  // =========================
  getAll(search?:string,page = 0, size = 10): Observable<PageResponse<ClientResponse>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

     if(search && search.trim() !== ''){
      params.set('search',search.trim());
    }

    return this.http
      .get<ApiResponse<PageResponse<ClientResponse>>>(
        `${this.BASE_URL}/public/client/getAllClient`,
        { params }
      )
      .pipe(handleApiResponse());
  }

  // =========================
  // ✅ GET CLIENT BY ID
  // =========================
  getById(id: number): Observable<ClientResponse> {
    return this.http
      .get<ApiResponse<ClientResponse>>(
        `${this.BASE_URL}/client/getClientById/${id}`
      )
      .pipe(handleApiResponse());
  }

  // =========================
  // ✅ ADD CLIENT
  // =========================
  add(request: ClientRequest): Observable<ClientResponse> {
    return this.http
      .post<ApiResponse<ClientResponse>>(
        `${this.BASE_URL}/client/addClient`,
        request
      )
      .pipe(handleApiResponse());
  }

  // =========================
  // ✅ UPDATE CLIENT
  // =========================
  update(id: number, request: ClientRequest): Observable<ClientResponse> {
    return this.http
      .put<ApiResponse<ClientResponse>>(
        `${this.BASE_URL}/client/updateClientById/${id}`,
        request
      )
      .pipe(handleApiResponse());
  }

  // =========================
  // ✅ DELETE CLIENT
  // =========================
  delete(id: number): Observable<Record<string, string>> {
    return this.http
      .delete<ApiResponse<Record<string, string>>>(
        `${this.BASE_URL}/client/deleteClientById/${id}`
      )
      .pipe(handleApiResponse());
  }
}
