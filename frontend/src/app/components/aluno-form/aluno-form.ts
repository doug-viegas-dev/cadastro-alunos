import { Component, effect, inject, input, output, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Aluno } from '../../models/aluno.model';
import {
  dataBrParaIso,
  dataBrValida,
  dataIsoParaBr,
  mascararCpf,
  mascararData,
} from '../../utils/formatadores';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

function validarData(c: AbstractControl): ValidationErrors | null {
  return !c.value || dataBrValida(c.value) ? null : { dataInvalida: true };
}

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  selector: 'app-aluno-form',
  styleUrl: './aluno-form.css',
  templateUrl: './aluno-form.html',
})
export class AlunoForm {
  private fb = inject(FormBuilder);
  private formDir = viewChild.required(FormGroupDirective);

  aluno = input<Aluno | null>(null); // aluno em edição (ou null = novo)
  alunoSalvo = output<Aluno>(); // avisa o pai: "salvaram isto"
  cancelado = output<void>(); // avisa o pai: "cancelaram"

  formAlunos = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    telefone: [''],
    celular: [''],
    cpf: [''],
    data_nascimento: ['', [Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/), validarData]],
  });

  constructor() {
    this.formAlunos.controls.cpf.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) =>
        this.formAlunos.controls.cpf.setValue(mascararCpf(v), { emitEvent: false }),
      );

    this.formAlunos.controls.data_nascimento.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) =>
        this.formAlunos.controls.data_nascimento.setValue(mascararData(v), { emitEvent: false }),
      );

    effect(() => {
      const a = this.aluno();
      if (a) {
        this.formAlunos.patchValue({
          nome: a.nome,
          email: a.email,
          telefone: a.telefone ?? '',
          celular: a.celular ?? '',
          cpf: a.cpf ?? '',
          data_nascimento: dataIsoParaBr(a.data_nascimento ?? ''),
        });
      } else {
        this.formAlunos.reset();
      }
    });
  }

  salvar() {
    if (this.formAlunos.invalid) {
      this.formAlunos.markAllAsTouched();
      return;
    }
    const v = this.formAlunos.getRawValue();
    this.alunoSalvo.emit({ ...v, data_nascimento: dataBrParaIso(v.data_nascimento) });
  }

  cancelar() {
    this.formDir().resetForm();
    this.cancelado.emit();
  }

  limpar() {
    this.formDir().resetForm();
  }
}
