# 🎬 Ghibli Tracker

![Versão](https://img.shields.io/github/v/tag/luzvsc/Ghibli-Tracker?label=vers%C3%A3o&color=blue)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Build](https://github.com/luzvsc/Ghibli-Tracker/actions/workflows/ci.yml/badge.svg)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

API REST em **Node.js + Express** que consome a **API pública do Studio Ghibli** para buscar filmes e permite salvar esses filmes em uma **watchlist pessoal**, com marcação de "assistido" e avaliação de 1 a 10. A watchlist é persistida localmente em um arquivo JSON.

## 🎯 Problema resolvido

Fãs do Studio Ghibli costumam acompanhar o catálogo de filmes em anotações soltas, sem padronização e sem histórico de avaliações. O Ghibli Tracker centraliza essa informação: os dados dos filmes vêm da fonte oficial, e o usuário controla apenas o que importa para ele (o que já assistiu e o que achou).

## 📋 Sumário de Funcionalidades

| Funcionalidade                        | Requisito | Status       |
| ------------------------------------- | --------- | ------------ |
| Buscar filmes por título              | RF01      | ✅ Concluído |
| Consultar detalhes de um filme        | RF02      | ✅ Concluído |
| Adicionar filme à watchlist           | RF03      | ✅ Concluído |
| Listar a watchlist                    | RF04      | ✅ Concluído |
| Marcar/desmarcar como assistido       | RF05      | ✅ Concluído |
| Avaliar filme assistido (nota 1 a 10) | RF06      | ✅ Concluído |
| Remover filme da watchlist            | RF07      | ✅ Concluído |
| Persistência em JSON local            | RF08      | ✅ Concluído |
| Erros padronizados                    | RF09      | ✅ Concluído |
| Health check                          | RF10      | ✅ Concluído |

> Atualize esta tabela a cada merge. Troque 🗓️ por ✅ conforme as issues forem concluídas.

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Persistência:** arquivo JSON local (`fs/promises`)
- **Testes:** Jest + Supertest
- **CI:** GitHub Actions
- **Fonte de dados:** [API pública do Studio Ghibli](https://ghibliapi.vercel.app/films)

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Git](https://git-scm.com/)
- Um cliente HTTP para testes (cURL, Postman ou Insomnia)

## 🚀 Instalação e Execução

**1. Clone o repositório**

```bash
git clone https://github.com/luzvsc/Ghibli-Tracker.git
cd ghibli-tracker
```

**2. Instale as dependências**

```bash
npm install
```

**3. Execute em modo de desenvolvimento (com recarregamento automático)**

```bash
npm run dev
```

Ou, em modo de produção local:

```bash
npm start
```

**4. Verifique se a aplicação está no ar**

```bash
curl http://localhost:3000/api/health
```

Resposta esperada: `{"status":"ok"}`

**5. Execute os testes automatizados**

```bash
npm test
```

### Variáveis de Ambiente (opcionais)

Todas possuem valores padrão. Para sobrescrevê-las, defina-as no terminal antes de iniciar a aplicação.

| Variável         | Padrão                               | Descrição                            |
| ---------------- | ------------------------------------ | ------------------------------------ |
| `PORT`           | `3000`                               | Porta do servidor HTTP               |
| `GHIBLI_API_URL` | `https://ghibliapi.vercel.app/films` | URL base da API do Studio Ghibli     |
| `DATA_FILE`      | `data/watchlist.json`                | Caminho do arquivo JSON da watchlist |

## 🔌 Endpoints

| Método   | Rota                           | Descrição                                                       | Sucesso | Erros              |
| -------- | ------------------------------ | --------------------------------------------------------------- | ------- | ------------------ |
| `GET`    | `/api/health`                  | Verifica se a aplicação está ativa                              | 200     | -                  |
| `GET`    | `/api/filmes?titulo=`          | Busca filmes por título (parcial, sem distinção de maiúsculas)  | 200     | 503                |
| `GET`    | `/api/filmes/:id`              | Detalhes de um filme pelo ID externo                            | 200     | 404, 503           |
| `POST`   | `/api/watchlist`               | Adiciona filme à watchlist (corpo: `{"filmeId": "..."}`)        | 201     | 400, 404, 409, 503 |
| `GET`    | `/api/watchlist`               | Lista todos os itens da watchlist                               | 200     | 500                |
| `PATCH`  | `/api/watchlist/:id/assistido` | Marca ou desmarca como assistido (corpo: `{"assistido": true}`) | 200     | 400, 404           |
| `PATCH`  | `/api/watchlist/:id/avaliacao` | Avalia filme assistido (corpo: `{"nota": 1-10}`)                | 200     | 400, 404, 409      |
| `DELETE` | `/api/watchlist/:id`           | Remove item da watchlist                                        | 204     | 404                |

**Exemplo de uso:**

```bash
# Buscar filmes com "totoro" no título
curl "http://localhost:3000/api/filmes?titulo=totoro"

# Adicionar um filme à watchlist
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"filmeId": "<id-do-filme>"}'

# Marcar como assistido
curl -X PATCH http://localhost:3000/api/watchlist/<id>/assistido \
  -H "Content-Type: application/json" \
  -d '{"assistido": true}'

# Avaliar com nota 9
curl -X PATCH http://localhost:3000/api/watchlist/<id>/avaliacao \
  -H "Content-Type: application/json" \
  -d '{"nota": 9}'
```

## 📚 Documentação

| Documento                                  | Conteúdo                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| [Project Charter](docs/project-charter.md) | Justificativa, objetivos SMART, escopo, stakeholders e riscos                        |
| [Requisitos](docs/requisitos.md)           | Requisitos funcionais, não funcionais, regras de negócio e matriz de rastreabilidade |
| [Casos de Uso](docs/casos-de-uso.md)       | Atores, fluxos principais, alternativos e de exceção                                 |
| [User Stories](docs/user-stories.md)       | Histórias de usuário com critérios de aceite em BDD                                  |

## 🌿 Fluxo de Branches (Git Flow)

| Branch                       | Propósito                          | Nasce de  | Recebe merge em      | Regra                                                                                        |
| ---------------------------- | ---------------------------------- | --------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `main`                       | Código de produção, sempre estável | -         | -                    | Nunca recebe commit direto. Recebe merge apenas de `release/*` ou `hotfix/*`, sempre com tag |
| `develop`                    | Integração das funcionalidades     | `main`    | `main` (via release) | Base para todas as features                                                                  |
| `feature/issue-NN-descricao` | Uma branch por issue               | `develop` | `develop`            | Abre PR com `Closes #NN`                                                                     |
| `release/vX.Y.Z`             | Preparação de um marco             | `develop` | `main` e `develop`   | Recebe a tag anotada `vX.Y.Z`                                                                |
| `hotfix/descricao`           | Correção urgente em produção       | `main`    | `main` e `develop`   | Recebe tag de patch                                                                          |

**Exemplo de ciclo de uma issue:**

```bash
git switch develop
git switch -c feature/issue-08-busca-filmes
# ...commits atômicos...
git push -u origin feature/issue-08-busca-filmes
# Abrir Pull Request para develop com "Closes #8" na descrição
```

## 📝 Convenção de Commits (Conventional Commits)

Formato: `tipo(escopo): descrição (#issue)`

| Tipo       | Quando usar                              | Exemplo                                                             |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `feat`     | Nova funcionalidade                      | `feat(watchlist): adicionar filme com bloqueio de duplicatas (#11)` |
| `fix`      | Correção de bug                          | `fix(storage): tratar arquivo JSON vazio (#10)`                     |
| `docs`     | Documentação                             | `docs(rf): detalhar requisitos não funcionais (#2)`                 |
| `test`     | Testes                                   | `test(filmes): cobrir cenário de API indisponível (#7)`             |
| `refactor` | Refatoração sem mudança de comportamento | `refactor(ghibli): extrair mapeamento de campos (#8)`               |
| `chore`    | Configuração e tarefas de manutenção     | `chore(setup): configurar .gitignore (#5)`                          |
| `ci`       | Pipeline de integração contínua          | `ci: adicionar workflow de testes (#5)`                             |

**Princípios adotados:**

- **Commits atômicos:** cada commit contém uma mudança coesa e deixa o projeto em estado funcional.
- **Commits pequenos e frequentes:** preferir vários commits pequenos a um único commit grande.
- **Mensagem no imperativo** e em português, com escopo entre parênteses.

## 🏷️ Versionamento Semântico (SemVer)

Formato `MAJOR.MINOR.PATCH`. Cada marco é publicado como **tag anotada**:

```bash
git tag -a v0.1.0 -m "Release v0.1.0: documentação e setup"
git push origin v0.1.0
```

| Versão   | Marco                           | Conteúdo                                                               |
| -------- | ------------------------------- | ---------------------------------------------------------------------- |
| `v0.1.0` | Documentação e setup            | Charter, requisitos, casos de uso, user stories e estrutura do projeto |
| `v0.2.0` | Integração com a API Ghibli     | Servidor Express, cliente externo, busca e detalhes de filmes          |
| `v0.3.0` | Persistência e watchlist básica | Armazenamento em JSON, adicionar, listar e remover                     |
| `v0.4.0` | Status e avaliação              | Marcar como assistido e avaliar com nota                               |
| `v1.0.0` | Entrega final                   | README consolidado e funcionalidades completas                         |

## 🗂️ Estrutura do Projeto

```
Ghibli-Tracker/
├── docs/                      # Documentação de planejamento e engenharia
├── src/
│   ├── app.js                 # Configuração do Express (sem listen)
│   ├── server.js              # Inicialização do servidor HTTP
│   ├── routes/                # Definição das rotas
│   ├── services/              # Regras de negócio
│   ├── repositories/          # Acesso ao arquivo JSON
│   ├── clients/               # Cliente da API do Studio Ghibli
│   └── middlewares/           # Tratamento centralizado de erros
├── tests/                     # Testes automatizados
├── data/                      # Arquivo JSON local (ignorado pelo Git)
├── .github/workflows/ci.yml   # Pipeline de CI
├── .gitignore
├── package.json
└── README.md
```

## 🗓️ Acompanhamento do Backlog

As issues, labels e milestones estão na aba [Issues](https://github.com/luzvsc/Ghibli-Tracker/issues) do repositório.

## 👤 Autor

**Luz Vasconcelos**: Atividade acadêmica do projeto Controle Antimicrobiano Inteligente, Faculdade Senac PE.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
