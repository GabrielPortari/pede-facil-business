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

Observação: o projeto não possui script `start`; para desenvolvimento use `npm run dev`.

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
- Atualização de status de pedidos com fluxo operacional no dashboard
- Confirmação manual de pagamento para cenário de falha no gateway
- Reentrega para pedidos em `customer_declined`, com retorno para `delivered`
- Visão geral do dashboard separada por tópicos: catálogo, pedidos, financeiro e alertas
- Aba `Financeiro` com indicadores e distribuição de valores por status dos pedidos
- Status de pedidos tipados com enum e exibidos com rótulos amigáveis na interface

## Operações no dashboard

Menu operacional disponível na rota `/dashboard`:

- `Visão geral`: cards principais por tópico (catálogo, pedidos, financeiro e alertas)
- `Pedidos`: gestão operacional de pedidos com ações por status
- `Financeiro`: resumo de faturamento, ticket médio e breakdown por status
- `Produtos cadastrados`: listagem, filtros e ações de edição/exclusão
- `Promoções`: gestão de promoções ativas e produtos sem promoção
- `Informação de pedidos`: pedidos fora do fluxo operacional imediato

### Fluxo manual em falha de gateway

Quando um pedido está em `payment_pending`, a ação `Marcar como pago` solicita confirmação manual antes de enviar a mudança para `paid_awaiting_delivery`.

Use esse fluxo apenas quando o gateway de pagamento falhar e o recebimento tiver sido validado fora da plataforma.

### Fluxo de reentrega

Quando um pedido está em `customer_declined`, o painel oferece:

- `Confirmar nova entrega`: altera o status para `delivered`
- `Cancelar pedido`: altera o status para `business_cancelled`

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
- A inicialização de sessão no bootstrap atual pode depender da disponibilidade do backend para renderizar rotas protegidas.
