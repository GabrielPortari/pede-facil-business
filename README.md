# Pede Fácil Business

Frontend da área de negócios da plataforma Pede Fácil, construído com React, TypeScript e Vite.

## Stack

- React 19
- TypeScript
- React Router
- Vite
- ESLint

## Pré-requisitos

- Node.js 20+
- npm 10+
- API backend rodando localmente em `http://localhost:3000`

## Como executar

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Scripts disponíveis

```bash
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run preview  # preview da build
npm run lint     # validação de lint
```

## Proxy de API (Vite)

As chamadas iniciadas com `/api` são proxied para `http://localhost:3000`, com remoção do prefixo `/api`.

Exemplo:

- Frontend chama: `/api/auth/login`
- Backend recebe: `/auth/login`

## Rotas principais

- `/`: landing page pública
- `/login`: autenticação do negócio
- `/esqueci-minha-senha`: recuperação de senha
- `/registre-se`: cadastro de negócio
- `/dashboard`: painel operacional (rota protegida)
- `/perfil`: perfil do negócio (rota protegida)

## Funcionalidades implementadas

- Autenticação com sessão persistida em `localStorage`
- Refresh de token com renovação automática de sessão
- Logout e proteção de rotas privadas
- CRUD de produtos do negócio
- Gestão de promoções
- Operação de pedidos com filtros por status e limite
- Status de pedidos tipados com enum e exibidos com rótulos amigáveis na interface

## Estrutura do projeto

```text
src/
	features/
		auth/
			components/
			hooks/
			pages/
			services/
			types/
		dashboard/
			components/
			hooks/
			pages/
			services/
			types/
		home/
			components/
			hooks/
			pages/
		public/
			pages/
	shared/
		constants/
		lib/
		state/
		ui/
	App.tsx
	main.tsx
```

## Convenções de arquitetura

- `features/*`: módulos por domínio de negócio (UI, regra e integração)
- `hooks`: controle de estado, carregamento e fluxo de tela
- `services`: chamadas HTTP para API
- `types`: contratos e tipos compartilhados da feature
- `shared/lib`: utilitários e camada base de request
- `shared/state`: sessão/autenticação global

## Endpoints utilizados

Alguns endpoints já mapeados no frontend:

- `POST /auth/login`
- `POST /auth/refresh-auth`
- `POST /auth/signup/business`
- `POST /auth/recover-password`
- `GET /business/me`
- `GET /business/me/orders`
- Endpoints de produtos e promoções por negócio

## Observações

- Não há suíte de testes automatizados configurada neste momento.
- O lint deve ser executado antes de abrir PR para manter o padrão do código.
