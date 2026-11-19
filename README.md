# Cadastro de Alunos

O projeto é um CRUD de aluno em que o usuário cadastra, consulta, edita e remove alunos por uma tela só, e os dados ficam salvos em um banco MySQL para continuarem lá depois de fechar e abrir o navegador.

O projeto tem duas partes que rodam separadas, o backend em `backend/` (Node.js com Express e TypeScript, uma API REST que devolve JSON) e o frontend em `frontend/` (Angular com TypeScript e Angular Material). O frontend nunca fala com o banco, ele pede tudo para a API e a API é quem executa os comandos SQL, escritos à mão com o pacote `mysql2`, sem ORM.

## O que precisa estar instalado

- Node.js 22 ou mais novo
- MySQL

## Como rodar

### 1. Banco de dados

Entre no MySQL como administrador e crie o banco e um usuário para o projeto, trocando `sua_senha` por uma senha de sua escolha:

```sql
CREATE DATABASE alunos;
CREATE USER 'alunos'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON alunos.* TO 'alunos'@'localhost';
```

Depois crie a tabela com o arquivo `backend/schema.sql`:

```bash
mysql -u alunos -p alunos < backend/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Copie o `.env.example` para `.env` e preencha `DB_PASSWORD` com a senha que você criou no passo anterior. As credenciais ficam no `.env` e não no código, para a senha do banco não ficar escrita nos fontes.

```bash
npm run dev
```

A API sobe em `http://localhost:3000`. Para conferir que está funcionando, abra `http://localhost:3000/alunos` no navegador e a resposta deve ser uma lista em JSON, vazia se ainda não houver alunos.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

Abra `http://localhost:4200`. O backend precisa estar ligado antes, pois a lista é carregada da API assim que a página abre, e ele só aceita requisições vindas dessa porta (CORS).

## Rotas da API

| Método | Rota | O que faz | Resposta |
|---|---|---|---|
| GET | `/alunos` | lista todos os alunos | 200 |
| GET | `/alunos/:id` | busca um aluno | 200 ou 404 |
| POST | `/alunos` | cadastra e devolve o aluno criado | 201, 400 ou 409 |
| PUT | `/alunos/:id` | atualiza o aluno | 200, 400, 404 ou 409 |
| DELETE | `/alunos/:id` | remove o aluno | 204 ou 404 |

Os erros voltam como `{ "erro": "mensagem" }`. O 400 é de validação (nome e e-mail obrigatórios, e-mail em formato válido) e o 409 é de e-mail ou CPF que já estão cadastrados.

## Como o projeto está organizado

```
backend/src/
  routes/        define as rotas e qual função atende cada uma
  controllers/   recebe a requisição, valida e responde com o status certo
  repositories/  guarda os comandos SQL
  validators/    regras de validação do aluno
  db.ts          conexão com o MySQL (pool)

frontend/src/app/
  models/        o formato de um Aluno
  services/      AlunoService, a única parte que chama a API
  components/    aluno-form (formulário) e aluno-lista (tabela)
  pipes/         mostram CPF e data formatados na tabela
  utils/         funções das máscaras e da conversão de data
  app.ts         guarda o estado e liga o formulário, a lista e o service
```

O `app` é quem decide o que fazer, o formulário e a lista só mostram os dados e avisam o que o usuário fez.

## Detalhes que vale saber

- O CPF e a data de nascimento têm máscara enquanto a pessoa digita. O CPF é salvo com a máscara (`123.456.789-09`), que cabe nos 14 caracteres da coluna.
- A data aparece como `dd/mm/aaaa` na tela, mas vai para a API como `aaaa-mm-dd`, que é o formato que o MySQL aceita. A conversão acontece no formulário.
- Data impossível, como 31/02, é recusada no formulário antes de chegar na API.
- O e-mail e o CPF são únicos no banco, então cadastrar o mesmo valor duas vezes mostra a mensagem "Aluno já cadastrado".
