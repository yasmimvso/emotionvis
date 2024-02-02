
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroundingService {

  private baseUrl = 'https://oraculo.cin.ufpe.br/api/grouding';

  constructor(private http: HttpClient) { }

  getDataGt():Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}

