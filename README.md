# TaskFlow | Gerenciador de Tarefas Full Stack

**Português** | [English](#english)

TaskFlow é um MVP de gerenciador de tarefas com quadro Kanban em três etapas. O frontend em React consome uma API REST construída com Express, e as tarefas são armazenadas em um banco SQLite local.

## Funcionalidades
- Criar tarefas com título.
- Listar tarefas organizadas por status: a fazer, em andamento e concluído.
- Alterar o status de uma tarefa e excluí-la.
- Persistir dados em SQLite e visualizar contadores.
- Validar título e status na API e executar testes automatizados.

## Tecnologias e arquitetura
- **React + Vite:** interface de usuário e desenvolvimento frontend.
- **Node.js + Express:** servidor HTTP e endpoints REST.
- **SQLite + better-sqlite3:** armazenamento local persistente com queries parametrizadas.
- **node:test:** teste automatizado de criação, listagem, atualização e exclusão.
- **GitHub Actions:** testes do backend e build do frontend a cada push/pull request.

```text
frontend (React, porta 5173) -> API REST (Express, porta 3001) -> SQLite (tasks.db)
```

## Requisitos
Node.js **22 LTS** e npm. Use dois terminais no VS Code, ambos começando na raiz `03-taskflow`.

**Terminal 1 (backend):**
```powershell
cd backend
npm install
npm test
npm run dev
```

**Terminal 2 (frontend):**
```powershell
cd frontend
npm install
npm run build
npm run dev
```

Acesse **http://127.0.0.1:5173**. A API usa `http://127.0.0.1:3001` e a verificação de saúde fica em **http://127.0.0.1:3001/api/health**. Mantenha os dois terminais abertos.

## API REST
| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/health` | Saúde da API |
| GET | `/api/tasks` | Listar tarefas |
| POST | `/api/tasks` | Criar tarefa (`{"title":"Estudar React"}`) |
| PATCH | `/api/tasks/:id` | Atualizar status (`{"status":"doing"}`) |
| DELETE | `/api/tasks/:id` | Excluir tarefa |

## Teste manual sugerido
Crie uma tarefa, mova para **Em andamento**, depois **Concluído**; recarregue o navegador para confirmar que ela permanece salva; exclua a tarefa. Execute `npm test` na pasta `backend`.

## Segurança e limitações
Projeto para uso **local e demonstração**. Não possui login, perfis, autorização, criptografia de dados sensíveis ou deploy de produção. Não o disponibilize diretamente na internet. As consultas SQL usam parâmetros, e a API valida títulos e status; esses cuidados não substituem autenticação e autorização. O arquivo `tasks.db` é ignorado pelo Git. No estado atual, cada tarefa tem apenas título, não há edição de descrição nem arrastar-e-soltar.

## Evoluções possíveis
Autenticação, usuários, edição de descrições, filtros, testes de frontend, arrastar-e-soltar e deploy seguro com banco gerenciado.

---

## English

TaskFlow is a local full-stack Kanban task manager MVP. A **React + Vite** frontend calls an **Express REST API**, while **SQLite** stores tasks persistently.

### Features
- Create, list, update status, and delete tasks.
- Three columns: To Do, In Progress, Done; live task counters.
- Persistent storage, basic input validation, parameterized SQL queries.
- Backend automated tests and frontend build checks via GitHub Actions.

### Run locally
Requires **Node.js 22 LTS** and npm. In two terminals from the project root:

**Backend**
```bash
cd backend
npm install
npm test
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run build
npm run dev
```

Open **http://127.0.0.1:5173**. API health check: **http://127.0.0.1:3001/api/health**.

### API endpoints
`GET /api/health`, `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id`.

### Security note
**Local educational MVP only.** There is no authentication, authorization, or multi-user isolation. Do not expose the backend publicly without further hardening. Database files and installed dependencies are excluded from Git.
