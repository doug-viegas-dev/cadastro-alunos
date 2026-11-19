import { Request, Response } from "express";
import {
  adicionarAluno,
  listarAlunos,
  excluirAluno,
  atualizarAluno,
  buscarPorId as buscarPorIdRepository,
} from "../repositories/alunos.repository";
import { validarAluno } from "../validators/aluno.validator";
import { Aluno } from "../types/aluno";

export async function listar(req: Request, res: Response) {
  const alunos = await listarAlunos();
  res.json(alunos);
}

export async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "Id inválido!" });
  }

  const aluno = await buscarPorIdRepository(id);

  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }

  res.json(aluno);
}

export async function criarAluno(req: Request, res: Response) {
  const aluno = (req.body ?? {}) as Aluno;
  const erroValidacao = validarAluno(aluno);

  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const id = await adicionarAluno(aluno);
    const alunoCriado = await buscarPorIdRepository(id);
    res.status(201).json(alunoCriado);
  } catch (erro: any) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Aluno já cadastrado" });
    }
    throw erro;
  }
}

export async function removerAluno(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "Id inválido!" });
  }

  const aluno = await excluirAluno(id);
  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  res.status(204).send();
}

export async function editarAluno(req: Request, res: Response) {
  const aluno = (req.body ?? {}) as Aluno;
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "Id inválido!" });
  }

  const erroValidacao = validarAluno(aluno);

  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const editado = await atualizarAluno(id, aluno);
    if (!editado) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    return res.status(200).json({ id, ...aluno });
  } catch (erro: any) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Aluno já cadastrado" });
    }
    throw erro;
  }
}
