# CustList

Aplicação pessoal de gerenciamento de tarefas, centralizada neste workspace.

## Estrutura

```text
frontend/  Aplicação React/TanStack/Vite existente
backend/   API REST em Node.js e Express
docs/      Especificações do projeto
prompts/   Prompts utilizados no desenvolvimento
```

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Instalação

```bash
npm run install:all
```

Instalações independentes também continuam disponíveis:

```bash
npm install --prefix frontend
npm install --prefix backend
```

## Desenvolvimento

Frontend:

```bash
npm run dev:frontend
```

Backend:

```bash
npm run dev:backend
```

Copie `backend/.env.example` para `backend/.env` para personalizar porta e origem
permitida do Frontend.

## Compilação e testes

```bash
npm run build
npm run test:all
npm run lint
```

Testes separadamente:

```bash
npm run test:frontend
npm run test:backend
```
