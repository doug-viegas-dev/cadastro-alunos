import { Pipe, PipeTransform } from '@angular/core';
import { mascararCpf } from '../utils/formatadores';

@Pipe({ name: 'cpf' })
export class CpfPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return valor ? mascararCpf(valor) : '';
  }
}
