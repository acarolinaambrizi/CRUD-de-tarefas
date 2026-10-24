# Meu To Do — Gerenciador de Tarefas

Aplicação web de lista de tarefas com **cadastro e login de usuários**: cada pessoa acessa só as próprias tarefas e pode **criar, listar, editar e excluir** itens.

🔗 **Acesse o app:** [to-do-final-phi.vercel.app](https://to-do-final-phi.vercel.app)

Projeto desenvolvido na disciplina de **Inteligência Artificial** do curso de Análise e Desenvolvimento de Sistemas (UNILAVRAS), com o objetivo de explorar o desenvolvimento de software assistido por IA.

## Funcionalidades

- Cadastro de conta, login e recuperação de senha
- Tarefas vinculadas a cada usuário
- CRUD completo: criar, listar, editar e excluir tarefas

## Tecnologias

- [Next.js](https://nextjs.org) (React) com TypeScript
- Tailwind CSS e componentes [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com): banco de dados e autenticação
- [Vercel](https://vercel.com): hospedagem

## Como foi feito

O código foi gerado com apoio do **Dyad**, uma ferramenta de desenvolvimento com IA. Meu papel foi:

- definir os requisitos e as funcionalidades da aplicação;
- escrever e refinar os comandos (prompts) dados à IA;
- configurar o banco de dados e a autenticação no Supabase;
- publicar a aplicação na Vercel;
- testar o funcionamento e pedir correções até chegar à versão final.

O arquivo `AI_RULES.md` contém as regras usadas para orientar a IA durante o desenvolvimento.

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) e um projeto no Supabase.

```bash
git clone https://github.com/acarolinaambrizi/CRUD-de-tarefas.git
cd CRUD-de-tarefas
pnpm install
```

Crie um arquivo `.env.local` na raiz com as chaves do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

Depois rode `pnpm dev` e acesse `http://localhost:3000`.

## O que aprendi

- Estrutura de um projeto Next.js e organização de componentes
- Autenticação de usuários e banco de dados com Supabase
- Publicação (deploy) de uma aplicação web na Vercel
- Como orientar uma ferramenta de IA e revisar o código que ela produz

## Autora

**Ana Carolina Ambrizi** · [LinkedIn](https://linkedin.com/in/ana-carolina-ambrizi)
