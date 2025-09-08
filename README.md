# Aplicação React (Vite + TypeScript + Tailwind v4 + shadcn/ui) para gestão e visualização de filmes, com autenticação e listagem paginada.

✅ Requisitos

Node.js 22+

npm 9+

### Backend/API disponível (https://github.com/mateuscarvalhodev/moviesback)

🚀 Instalação

# 1) Instalar dependências

```bash
npm i
```

⚙️ Configuração de ambiente

Com o back end funcionando (link do backEnd acima) Crie um arquivo .env na raiz (ou .env.local) com a URL da API:

VITE_API_URL=http://localhost:3000

▶️ Executar em desenvolvimento

```bash
npm run dev
```

Abra a URL exibida no terminal provavelmente http://localhost:5173.

🏗️ Build de produção
npm run build

### 📦 Principais funcionalidades

- Responsivo

- Tema claro/escuro com alternância por botão (persistido em sessionStorage)

- Autenticação (Login/Cadastro)

- Rotas protegidas para páginas autenticadas (Listagem/CRUD de filmes)

#### Listagem de filmes com:

- Busca por texto

- Paginação de 10 itens por página

#### Botão de filtros (modal) com:

- Duração (min/max)

- Intervalo de datas (lançamento inicial/final)

- filtro adicional :gênero

- Detalhes do filme (título, título original, descrição, orçamento, data de lançamento etc.)

- Adicionar/Editar filme:

- Se a data de lançamento for no futuro, agenda o envio automático de e-mail no dia da estreia (requer suporte do backend; ver nota abaixo)

#### 📨 Nota sobre envio de e-mail na estreia

- O agendamento do e-mail é disparado ao salvar/editar um filme futuro.

- Job/cron que consulta filmes com releaseDate = hoje

#### 🗺️ Rotas (resumo)

- POST /auth/login — formulário de e-mail/senha; redireciona se já autenticado

- POST /auth/register — nome/e-mail/senha/confirmar;

- GET /movies — listagem protegida, com busca, paginação e filtros

- POST /movies/new — adicionar filme (protegida)

- PUT /movies/:id/ — editar filme (protegida)

- GET/movies/:id — detalhes do filme

#### 🧩 Stack

- React + Vite + TypeScript

- Tailwind v4

- shadcn/ui (componentes + acessibilidade)

- lucide-react (ícones)

- React Router (rotas e proteção)

- Axios (requisições)

- Zod/React Hook Form (validação de formulários)
