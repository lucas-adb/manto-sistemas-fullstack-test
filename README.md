# Manto Sistemas Fullstack Test

Este projeto é um monorepo que contém uma aplicação fullstack, dividida em duas partes: **backend** e **frontend**.

## Screenshots
![Tela de Login](/screenshots/manto-print-1.png)
![Tela de tarefas](/screenshots/manto-print-2.png)
![Filtros](/screenshots/manto-print-3.png)

## Estrutura do Projeto

- **backend**: Contém a lógica do servidor, incluindo rotas e middleware.
- **frontend**: Contém a interface do usuário, construída com React.

## Stack
- **database**: MySQL.
- **backend**: Node, JWT, TypeScript, Vitest e Prisma.
- **frontend**: Vite, React, Antd Design, TypeScript, Tailwind e Zustand.

## Configuração

### MySQL (Container Local)
1. Crie o container com `docker compose up -d` no diretório `backend`.

### Backend

1. Navegue até o diretório `backend`.
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   npm run dev
   ```

### Frontend

1. Navegue até o diretório `frontend`.
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie a aplicação:
   ```
   npm start
   ```

## Testes

Para executar os testes, você pode rodar o seguinte comando no diretório do backend. Ele criará um banco local para testes:

```
test:with-db
```

## Licença

Este projeto está licenciado sob a Licença ISC.