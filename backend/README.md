# AulaExemploIA

## CustList — API de tarefas

API REST em Express para o MVP CustList. As tarefas são salvas localmente em
`data/tasks.json`, criado automaticamente na primeira execução. O Frontend continua
independente e pode operar offline usando o armazenamento do navegador.

### Executar em desenvolvimento

Requer Node.js 20.19 ou mais recente.

```bash
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

Para configurar a porta e a origem permitida, copie `.env.example` para `.env` e ajuste os valores.

### Estrutura

```text
src/
  config/       Configurações e variáveis de ambiente
  model/        Persistência local das tarefas
  service/      Regras de negócio e validação
  controller/   Tradução HTTP das respostas
  router/       Definição das rotas REST
  app.js        Montagem da aplicação Express
  server.js     Inicialização do servidor
```

### Executar

```bash
npm start
```

Abra `http://localhost:3000`.

### Rotas da API

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica a disponibilidade da API |
| `GET` | `/api/tarefas` | Lista tarefas |
| `POST` | `/api/tarefas` | Cria uma tarefa |
| `PATCH` | `/api/tarefas/:id` | Atualiza uma tarefa |
| `DELETE` | `/api/tarefas/:id` | Exclui uma tarefa |

O corpo de criação aceita `title`, `description`, `status`, `priority` e `dueDate`.

### Testes

```bash
npm test
```

### Frontend

O Frontend está em `C:\Users\joao62425746\Documents\customer-list-manager` e possui
instruções próprias no README dele. A integração com esta API será feita em uma etapa
seguinte, mantendo o fallback offline já existente.