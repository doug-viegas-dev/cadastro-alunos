import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Aluno } from '../../models/aluno.model';
import { CpfPipe } from '../../pipes/cpf-pipe';
import { DataBrPipe } from '../../pipes/data-br-pipe';

@Component({
  imports: [MatTableModule, MatButtonModule, MatIconModule, CpfPipe, DataBrPipe],
  selector: 'app-aluno-lista',
  styleUrl: './aluno-lista.css',
  templateUrl: './aluno-lista.html',
})
export class AlunoLista {
  alunos = input.required<Aluno[]>();
  iniciarEdicao = output<Aluno>();
  remover = output<Aluno>();
  colunas = ['nome', 'email', 'celular', 'telefone', 'cpf', 'data_nascimento', 'acoes'];
}
