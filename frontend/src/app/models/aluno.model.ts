export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  telefone?: string | null;
  celular?: string | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  data_criacao?: string;
}

