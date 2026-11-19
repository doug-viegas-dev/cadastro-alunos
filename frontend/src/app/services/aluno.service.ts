import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/alunos';

  listar(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.url);
  }

  buscarPorId(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.url}/${id}`);
  }

  criar(aluno: Aluno): Observable<Aluno> {
    return this.http.post<Aluno>(this.url, aluno);
  }

  atualizar(aluno: Aluno): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.url}/${aluno.id}`, aluno);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
