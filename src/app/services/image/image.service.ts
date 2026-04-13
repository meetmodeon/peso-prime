import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ImageResponse } from '../model/ImageResponse';
import { ApiResponse } from '../model/ApiResponse.model';
import { handleApiResponse } from '../../core/utils/api.utils';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private API_URL = environment.apiUrl + '/image';
  private http = inject(HttpClient);

  uploadImage(formData: FormData): Observable<ImageResponse> {
    return this.http
      .post<ApiResponse<ImageResponse>>(`${this.API_URL}/upload`, formData)
      .pipe(handleApiResponse());
  }

  deleteImage(imageId: number | any): Observable<Record<string, string>> {
    return this.http
      .delete<ApiResponse<Record<string, string>>>(`${this.API_URL}/${imageId}`)
      .pipe(handleApiResponse())
  }
 
}
