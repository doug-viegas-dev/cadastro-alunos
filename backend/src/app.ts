import express from "express";
import cors from "cors";
import alunosRoutes from "./routes/alunos.routes";

const app = express();

app.use(cors({ origin: "http://localhost:4200"}));
app.use(express.json());
app.use("/alunos", alunosRoutes);

export default app;