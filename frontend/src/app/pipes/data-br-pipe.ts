import { Pipe, PipeTransform } from '@angular/core';
import { dataIsoParaBr } from '../utils/formatadores';

@Pipe({ name: 'dataBr' })
export class DataBrPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return valor ? dataIsoParaBr(valor) : '';
  }
}