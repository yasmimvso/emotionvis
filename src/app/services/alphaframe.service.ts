

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrameService {
  private baseUrl = 'https://oraculo.cin.ufpe.br/api/activities';

  constructor(private http: HttpClient) { }
  getDataRs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
