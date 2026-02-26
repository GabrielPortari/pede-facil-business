# Pede Fácil Business (React + Vite)

Base inicial para aplicação React com arquitetura orientada a features.

## Como rodar

```bash
npm install
npm run dev
```

## Comandos úteis

```bash
npm run build
npm run preview
npm run lint
```

## Estrutura recomendada

```text
src/
	features/
		auth/
			pages/
	shared/
		lib/
		ui/
	App.tsx
	main.tsx
```

## Padrão aplicado

- `features`: regras e telas por domínio de negócio.
- `shared/ui`: componentes reutilizáveis entre features.
- `shared/lib`: utilitários puros (formatação, helpers).
- `services`: comunicação com API e fontes de dados.
- `hooks`: orquestração de estado e fluxo da feature (quando necessário).
