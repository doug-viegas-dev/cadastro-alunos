import { Router } from "express";
import { criarAluno, editarAluno, listar, removerAluno, buscarPorId } from "../controllers/alunos.controller";

const router = Router();


router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criarAluno);
router.delete("/:id", removerAluno);
router.put("/:id", editarAluno);

export default router;
