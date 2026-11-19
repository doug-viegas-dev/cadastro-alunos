import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { Aluno } from "../types/aluno";

export async function listarAlunos(): Promise<Aluno[]> {
  const [linhas] = await pool.query<(Aluno & RowDataPacket)[]>(
    "SELECT * FROM alunos",
  );
  return linhas;
}

export async function buscarPorId(id: number): Promise<Aluno | null> {
  const [linhas] = await pool.query<(Aluno & RowDataPacket)[]>(
    "SELECT * FROM alunos WHERE id = ?",
    [id],
  );
  return linhas[0] ?? null;
}

export async function adicionarAluno(aluno: Aluno): Promise<number> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO alunos (nome, email, telefone, celular, cpf, data_nascimento) VALUES (?,?,?,?,?,?)",
    [
      aluno.nome,
      aluno.email,
      aluno.telefone || null,
      aluno.celular || null,
      aluno.cpf || null,
      aluno.data_nascimento || null,
    ],
  );

  return resultado.insertId;
}

export async function excluirAluno(id: number): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "DELETE FROM alunos WHERE id = ?",
    [id],
  );

  return resultado.affectedRows > 0;
}

export async function atualizarAluno(
  id: number,
  aluno: Aluno,
): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "UPDATE alunos SET nome = ?, email = ?, telefone = ?, celular= ?, cpf = ?, data_nascimento = ? WHERE id = ?",
    [
      aluno.nome,
      aluno.email,
      aluno.telefone || null,
      aluno.celular || null,
      aluno.cpf || null,
      aluno.data_nascimento || null,
      id,
    ],
  );

  return resultado.affectedRows > 0;
}
