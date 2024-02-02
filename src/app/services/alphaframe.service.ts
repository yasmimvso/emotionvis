

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrameService {
  private baseUrl = 'https://oraculo.cin.ufpe.br/api/activities'; // Substitua pela URL do seu servidor

  constructor(private http: HttpClient) { }

  // Esse código só retorna os dados que estão em alphaction
  // pra frame precisa colocar o restante, além disso a lógica é diferente por ter um slider

  getDataRs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
