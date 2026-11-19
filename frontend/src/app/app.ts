import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Aluno } from './models/aluno.model';
import { AlunoLista } from './components/aluno-lista/aluno-lista';
import { AlunoForm } from './components/aluno-form/aluno-form';
import { AlunoService } from './services/aluno.service';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  imports: [AlunoLista, AlunoForm],
})
export class App implements OnInit {
  ngOnInit() {
    this.carregar();
  }

  private service = inject(AlunoService);
  private formulario = viewChild.required(AlunoForm);

  alunos = signal<Aluno[]>([]);
  alunoEmEdicao = signal<Aluno | null>(null);
  erro = signal('');

  carregar() {
    this.service.listar().subscribe({
      next: (lista) => {
        this.alunos.set(lista);
      },
      error: () => this.erro.set('Não foi possível carregar a lista de alunos.'),
    });
  }

  iniciarEdicao(aluno: Aluno) {
    this.alunoEmEdicao.set(aluno);
  }

  salvarAluno(aluno: Aluno) {
    const id = this.alunoEmEdicao()?.id;
    const requisicao = id ? this.service.atualizar({ ...aluno, id }) : this.service.criar(aluno);

    requisicao.subscribe({
      next: () => {
        this.erro.set('');
        this.formulario().limpar();
        this.alunoEmEdicao.set(null);
        this.carregar();
      },
      error: (e) => this.erro.set(e.error?.erro ?? 'Não foi possível salvar o aluno.'),
    });
  }

  cancelarEdicao() {
    this.alunoEmEdicao.set(null);
  }

  remover(aluno: Aluno) {
    if (!confirm(`Remover ${aluno.nome}?`)) return;
    this.service.deletar(aluno.id!).subscribe({
      next: () => {
        if (this.alunoEmEdicao()?.id === aluno.id) {
          this.alunoEmEdicao.set(null);
        }
          this.carregar();
      },
      error: () => this.erro.set('Não foi possível remover o aluno.'),
    });
  }
}
