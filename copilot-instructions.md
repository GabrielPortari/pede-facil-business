---
name: pede-facil
description: Diretrizes para assistência técnica durante o desenvolvimento do Pede Fácil — cobertura conjunta do front-end e back-end para os modos Cliente e Empresa. Use este prompt para dúvidas, melhorias, snippets e exemplos práticos.
---

Gere Snippets, não aplique as alterações sem antes confirmar. Sempre pergunte se deseja aplicar as mudanças sugeridas. Se a resposta for negativa, apenas forneça o código atualizado sem aplicá-lo. Se a resposta for positiva, aplique as mudanças sugeridas no código.

---

Contexto do Sistema

- Objetivo: aplicativo de pedidos com foco em retirada no balcão (pickup), simplificando o fluxo para pequenos bares e cafeterias.
- Modos: Cliente (app mobile) e Empresa (web/tablet para gestão do negócio).

Tecnologias recomendadas

- Back-end: NestJS + TypeScript, Firebase Admin SDK (Firestore + Storage), Swagger.
- Banco: Firebase Firestore (document store), uso de transações para consistência de estoque.
- Autenticação: Firebase Authentication (ID tokens) + JWT/middleware quando necessário.
- Front-end Cliente: React Native (Expo ou bare) com React Navigation, Axios/React Query, TypeScript.
- Front-end Empresa: React (web) com TypeScript, Redux Toolkit / React Query, components responsivos para tablets.
- Extras: Firebase Storage (upload de imagens), gateway de pagamento (Stripe/Pagar.me/Cielo para cartão + Pix), FCM para notificações push.

Esquema de Cores do Projeto (usar em todo o sistema)

- Primária 01 (teal): `#46B8BE`
- Primária 02 (azul marca): `#39A7D7`
- Primária 03 (teal claro): `#6DCFB2`
- Primária escura (títulos/ações): `#0F4E72`
- Secundária escura (apoio): `#35556A`

- Neutro 01 (texto principal): `#0F172A`
- Neutro 02 (texto secundário): `#3E647A`
- Neutro 03 (bordas suaves): `#B7DBE7`
- Neutro 04 (fundo claro): `#F1F9FF`
- Branco: `#FFFFFF`

- Sucesso: `#16A34A`
- Alerta: `#F59E0B`
- Erro: `#DC2626`
- Info: `#0284C7`

Gradiente oficial da marca

- Principal: `linear-gradient(180deg, #6DCFB2 0%, #46B8BE 52%, #39A7D7 100%)`
- Destaque/CTA: `linear-gradient(135deg, #46B8BE 0%, #39A7D7 100%)`

Regras de aplicação

- Priorizar as cores primárias para botões principais, links ativos, highlights e elementos de marca.
- Usar neutros para texto, bordas, superfícies e estados padrão.
- Manter contraste mínimo AA (texto escuro em fundo claro e texto branco em fundo primário escuro).
- Evitar criar novas cores fora desta paleta; para variações, usar opacidade da própria cor base.
- Em componentes novos (cliente e empresa), seguir este esquema antes de propor qualquer exceção visual.

Funcionalidades principais (ambos os lados)

- Fluxo de pedido: `payment_pending` -> `paid_awaiting_pickup` -> `picked_up` -> `customer_confirmed`.
- Autenticação e roles: `USER` e `BUSINESS` (e `ADMIN`). Endpoints protegidos por guards; verificação de ownership para operações por id.
- Produtos: CRUD, imagem via Storage, controle de estoque e promoções com estoque promocional opcional.
- Promoções: ativar/desativar, preço com desconto e estoque promocional.
- Pedidos: criação (cliente), listagem/filtragem por business (empresa), atualizações de status, histórico.
- Pagamentos: integração com gateway (captura/autorizar), webhooks para confirmar pagamentos e atualizar status.
- Notificações: FCM para notificar cliente e estabelecimento sobre mudanças de status.

Back-end — diretrizes e endpoints (exemplos)

- Autenticação: `/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/refresh`.
- Business: `GET /business/me`, `PATCH /business/me`, `GET /business/:id`, `PATCH /business/:id`, `DELETE /business/:id`.
- Products: `POST /business/:businessId/products` (aceitar multipart/form-data para imagem), `GET /business/:businessId/products`, `PATCH /business/:businessId/products/:productId`, `DELETE /business/:businessId/products/:productId`.
- Promotions: `POST /business/:businessId/promotions`, `PATCH /...`, `GET /business/:id/promotions`.
- Orders: `POST /orders`, `GET /orders?businessId=...`, `PATCH /orders/:id/status`.

Boas práticas back-end

- Validar e sanitizar todos os DTOs (class-validator/class-transformer). Use DTOs claros para requests/responses.
- Usar transações do Firestore para operações de pedido/estoque.
- Guardas: `RolesGuard`, `BusinessOwnerGuard` para garantir ownership quando necessário.
- Storage: salvar imagens em base64 em Firebase Storage e persistir `imageUrl` no Firestore; gerar URLs assinadas quando necessário.
- Testes: unitários com Jest e e2e com Supertest; adicionar exemplos de fixtures para Firestore (emulação/local) quando possível.

Front-end — diretrizes (Cliente e Empresa)

- Cliente (React Native): telas centrais — descoberta/loja, cardápio, carrinho, checkout (pagamento), status do pedido (com listeners/refresh), histórico.
- Empresa (React web/tablet): tela de login inicial e evolução incremental para CRUD de produtos com upload de imagem, gerenciamento de promoções e perfil do negócio.
- Comunicação: usar `Authorization: Bearer <idToken>` em cabeçalhos; para uploads usar `multipart/form-data` com `FormData`.
- Realtime: usar listeners do Firestore para atualizações em tempo real ou WebSocket para o fluxo de pedidos.

Integração de imagens

- Fluxo recomendado: front envia `multipart/form-data` para endpoint de produto; back recebe arquivo, envia para Firebase Storage (pasta `businesses/{businessId}/products/{uuid}.jpg`), obtém `imageUrl` pública ou assinada e salva no documento do produto.

Pagamentos e webhooks

- Implementar endpoints para webhooks do gateway (ex: `/webhook/payments`) que validem assinatura e atualizem `Order.status` com segurança.

Devops / CI

- Scripts úteis: `npm run start:dev`, `npm run build`, `npm test`, `npm run lint`, `npm run format`.
- Recomendo CI com GitHub Actions para lint, build e testes; deploy automatizado para staging/production (Cloud Run, Vercel/Netlify para front-end, Firebase Hosting + Cloud Functions se relevante).

Contribuição e estilo

- Padronizar com Prettier/ESLint; usar `class-validator` nos DTOs; adicionar exemplos de chamadas (cURL/Axios) na documentação do README.

Notas finais

- Este documento deve servir como referência para ambos os projetos (frontend e backend). Quando pedir exemplos ou snippets, especifique o modo (`client` ou `business`) e a stack alvo (`react-native`, `react-web`, `nestjs`).
