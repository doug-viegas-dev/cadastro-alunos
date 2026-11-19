import { Aluno } from "../types/aluno";

export function validarAluno(aluno: Aluno): string | null {
  if (!aluno.nome?.trim()) {
    return "Nome é obrigatório";
  }
  if (aluno.nome.trim().length > 255) {
    return "Nome deve ter no máximo 255 caracteres";
  }
  return (validarEmail(aluno));
}

function validarEmail(aluno: Aluno): string | null {
  const molde = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!aluno.email?.trim()) {
    return "E-mail é obrigatório";
  }
  if (aluno.email.length > 255) {
    return "E-mail deve ter no máximo 255 caracteres";
  }

  if (!molde.test(aluno.email)) {
    return "E-mail inválido"
  }
  return null;
}


