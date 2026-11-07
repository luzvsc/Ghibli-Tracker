# 🎬 Ghibli Tracker

[![Build](https://github.com/luzvsc/Ghibli-Tracker/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/luzvsc/Ghibli-Tracker/actions/workflows/ci.yml)
[![Versão](https://img.shields.io/github/v/tag/luzvsc/Ghibli-Tracker?sort=semver&label=vers%C3%A3o&color=blue)](https://github.com/luzvsc/Ghibli-Tracker/tags)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)](LICENSE)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

API REST em **Node.js + Express** que consome a **API pública do Studio Ghibli** para buscar filmes e permite salvar esses filmes em uma **watchlist pessoal**, marcando-os como assistidos e atribuindo uma nota de 1 a 5. A watchlist é persistida localmente em um arquivo JSON.

## 🎯 Problema resolvido

Fãs do Studio Ghibli costumam acompanhar o catálogo em anotações soltas, sem padronização e sem histórico de avaliações. O Ghibli Tracker centraliza essa informação: os dados dos filmes vêm da fonte oficial, e o usuário controla apenas o que importa para ele (o que já assistiu e o que achou).

## 📋 Sumário de Funcionalidades

| Funcionalidade                               | Requisito | Status          |
| -------------------------------------------- | --------- | --------------- |
| Buscar filmes por título                     | RF01      | ✅ Implementado |
| Consultar detalhes de um filme               | RF02      | ✅ Implementado |
| Adicionar filme à watchlist (sem duplicatas) | RF03      | ✅ Implementado |
| Listar a watchlist                           | RF04      | ✅ Implementado |
| Marcar como assistido                        | RF05      | ✅ Implementado |
| Avaliar com nota de 1 a 5                    | RF06      | ✅ Implementado |
| Remover filme da watchlist                   | RF07      | ✅ Implementado |
| Persistência em JSON local                   | RF08      | ✅ Implementado |
| Erros padronizados                           | RF09      | ✅ Implementado |
| Health check                                 | RF10      | ✅ Implementado |
| Estatísticas da watchlist                    | RF11      | ✅ Implementado |
| Desmarcar como assistido                     | RFP01     | 🗓️ Planejado    |
| Nota inteira de 1 a 10                       | RFP02     | 🗓️ Planejado    |
| Bloquear avaliação de filme não assistido    | RFP03     | 🗓️ Planejado    |

Detalhes e limitações conhecidas em [Requisitos](docs/requisitos.md) e [Arquitetura](docs/arquitetura.md).

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Persistência:** arquivo JSON local (`fs/promises`, escrita atômica)
- **Testes:** Jest + Supertest
- **CI:** GitHub Actions (testes em Node 18 e 20, Gitleaks e `npm audit`)
- **Fonte de dados:** [API pública do Studio Ghibli](https://ghibliapi.vercel.app/films)

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Git](https://git-scm.com/)
- Um cliente HTTP (cURL, Postman, Insomnia ou PowerShell)

## 🚀 Instalação e Execução

**1. Clone o repositório**

```bash
git clone [https://github.com/luzvsc/Ghibli-Tracker.git](https://github.com/luzvsc/Ghibli-Tracker.git)
cd Ghibli-Tracker
```

**2. Instale as dependências**

```bash
npm install
```

**3. (Opcional) Configure variáveis de ambiente**

Todas têm valor padrão, então este passo pode ser pulado. Para personalizar:

```bash
# Linux/macOS
cp .env.example .env
# Windows (PowerShell)
Copy-Item .env.example .env
```

O `npm start` **não lê o `.env`** sozinho. Para carregá-lo, use o suporte nativo do Node (18.17+ ou 20.6+):

```bash
node --env-file=.env src/server.js
```

Ou defina as variáveis direto no terminal (`PORT=4000 npm start` no Linux/macOS, `$env:PORT=4000; npm start` no PowerShell).

**4. Execute**

```bash
npm run dev    # desenvolvimento, com recarregamento automático
npm start      # execução normal
```

**5. Verifique**

```bash
curl http://localhost:3000/api/health
```

Resposta esperada: `{"status":"ok"}`

**6. Testes e cobertura**

```bash
npm test                 # testes
npm run test:coverage    # testes + cobertura (mínimo de 80% de linhas)
```

### Variáveis de Ambiente

| Variável         | Padrão                               | Descrição                                                           |
| ---------------- | ------------------------------------ | ------------------------------------------------------------------- |
| `PORT`           | `3000`                               | Porta do servidor HTTP                                              |
| `GHIBLI_API_URL` | `https://ghibliapi.vercel.app/films` | URL base da API do Studio Ghibli                                    |
| `DATA_FILE`      | `data/watchlist.json`                | Caminho do arquivo JSON da watchlist (pasta criada automaticamente) |

## 🔌 Endpoints

Especificação completa em [`docs/openapi.yaml`](docs/openapi.yaml).

| Método   | Rota                          | Descrição                                                              | Sucesso | Erros                   |
| -------- | ----------------------------- | ---------------------------------------------------------------------- | ------- | ----------------------- |
| `GET`    | `/api/health`                 | Verifica se a aplicação está ativa                                     | 200     | -                       |
| `GET`    | `/api/filmes?titulo=`         | Busca filmes por título (parcial, sem distinção de maiúsculas)         | 200     | 503                     |
| `GET`    | `/api/filmes/:id`             | Detalhes de um filme pelo ID externo                                   | 200     | 404, 503                |
| `POST`   | `/api/watchlist`              | Adiciona filme (corpo: `{"filmeId": "..."}`)                           | 201     | 400, 404, 409, 500, 503 |
| `GET`    | `/api/watchlist`              | Lista os itens da watchlist                                            | 200     | 500                     |
| `GET`    | `/api/watchlist/estatisticas` | Total, assistidos e nota média                                         | 200     | 500                     |
| `PATCH`  | `/api/watchlist/:id`          | Marca como assistido e, opcionalmente, avalia (corpo: `{"nota": 1-5}`) | 200     | 400, 404, 500           |
| `DELETE` | `/api/watchlist/:id`          | Remove item da watchlist                                               | 204     | 404, 500                |

**Exemplos (bash):**

```bash
curl "http://localhost:3000/api/filmes?titulo=totoro"

curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"filmeId": "58611129-2dbc-4a81-a72f-77ddfc1b1b49"}'

curl -X PATCH http://localhost:3000/api/watchlist/<id> \
  -H "Content-Type: application/json" \
  -d '{"nota": 5}'

curl http://localhost:3000/api/watchlist/estatisticas
```

**Formato de erro** (todas as respostas de erro):

```json
{
  "codigo": "ITEM_NAO_ENCONTRADO",
  "mensagem": "O item não foi encontrado na watchlist."
}
```

## 📚 Documentação

| Documento                                  | Conteúdo                                                             |
| ------------------------------------------ | -------------------------------------------------------------------- |
| [Índice da documentação](docs/README.md)   | Visão geral e regra de sincronização documentação ↔ código           |
| [Project Charter](docs/project-charter.md) | Justificativa, objetivos SMART, escopo, stakeholders e riscos        |
| [Requisitos](docs/requisitos.md)           | RF, RNF, regras de negócio e matriz de rastreabilidade até os testes |
| [Casos de Uso](docs/casos-de-uso.md)       | Atores e fluxos principais, alternativos e de exceção                |
| [User Stories](docs/user-stories.md)       | Histórias de usuário com critérios de aceite em BDD                  |
| [Arquitetura](docs/arquitetura.md)         | Camadas, diagramas Mermaid, modelo de dados e ADRs                   |
| [OpenAPI](docs/openapi.yaml)               | Contrato da API (Swagger/Postman)                                    |
| [CHANGELOG](CHANGELOG.md)                  | Histórico de versões                                                 |
| [CONTRIBUTING](CONTRIBUTING.md)            | Guia de contribuição                                                 |

## 🌿 Fluxo de Branches (Git Flow)

| Branch                       | Propósito                | Nasce de  | Recebe merge em      | Regra                                                                           |
| ---------------------------- | ------------------------ | --------- | -------------------- | ------------------------------------------------------------------------------- |
| `main`                       | Produção, sempre estável | -         | -                    | Nunca recebe commit direto. Só recebe `release/*` ou `hotfix/*`, sempre com tag |
| `develop`                    | Integração               | `main`    | `main` (via release) | Base de todas as features                                                       |
| `feature/issue-NN-descricao` | Uma branch por issue     | `develop` | `develop`            | PR com `Closes #NN`                                                             |
| `fix/issue-NN-descricao`     | Correção de bug          | `develop` | `develop`            | PR com `Closes #NN`                                                             |
| `release/vX.Y.Z`             | Preparação de versão     | `develop` | `main` e `develop`   | Recebe a tag anotada                                                            |
| `hotfix/descricao`           | Correção urgente         | `main`    | `main` e `develop`   | Tag de patch                                                                    |

## 📝 Convenção de Commits

Formato: `tipo(escopo): descrição (#issue)`

| Tipo       | Quando usar                         | Exemplo                                                             |
| ---------- | ----------------------------------- | ------------------------------------------------------------------- |
| `feat`     | Nova funcionalidade                 | `feat(watchlist): adicionar filme com bloqueio de duplicatas (#11)` |
| `fix`      | Correção de bug                     | `fix(storage): criar diretório de dados ao salvar (#31)`            |
| `docs`     | Documentação                        | `docs(arquitetura): adicionar diagramas Mermaid (#17)`              |
| `test`     | Testes                              | `test(ghibli): cobrir timeout de 5 segundos (#20)`                  |
| `refactor` | Refatoração sem mudar comportamento | `refactor(ghibli): extrair mapeamento de campos (#8)`               |
| `chore`    | Configuração e manutenção           | `chore(release): preparar versão 1.1.0 (#21)`                       |
| `ci`       | Integração contínua                 | `ci: adicionar workflow de testes (#16)`                            |

Commits **atômicos**: uma mudança coesa por commit, mensagem no imperativo. Regras completas em [CONTRIBUTING](CONTRIBUTING.md).

## 🏷️ Versionamento Semântico

Formato `MAJOR.MINOR.PATCH`, com **tags anotadas** (`git tag -a`).

| Versão   | Marco              | Conteúdo                                                                                                    |
| -------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `v1.0.0` | Entrega da Week_01 | Documentação, API de filmes, watchlist, estatísticas e 25 testes (tag criada retroativamente)               |
| `v1.1.0` | Week_02            | CI com gate de cobertura, segurança, arquitetura, OpenAPI, rastreabilidade até os testes e correção de bugs |

## 🗂️ Estrutura do Projeto

```
Ghibli-Tracker/
├── .github/
│   ├── workflows/ci.yml          # CI: testes, cobertura e segurança
│   ├── ISSUE_TEMPLATE/           # Templates de bug, feature e documentação
│   ├── pull_request_template.md
│   └── dependabot.yml
├── docs/                         # Documentação de planejamento e engenharia
├── src/
│   ├── app.js                    # Configuração do Express (sem listen)
│   ├── server.js                 # Inicialização do servidor HTTP
│   ├── routes/                   # Rotas
│   ├── services/                 # Regras de negócio
│   ├── repositories/             # Acesso ao arquivo JSON
│   ├── clients/                  # Cliente da API do Studio Ghibli
│   └── middlewares/              # Tratamento centralizado de erros
├── tests/                        # Testes automatizados
├── data/                         # Arquivo JSON local (ignorado pelo Git)
├── .env.example
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## 🗓️ Backlog

Issues, labels e milestones na aba [Issues](https://github.com/luzvsc/Ghibli-Tracker/issues).

## 👤 Autor

**Luz Vasconcelos** ([@luzvsc](https://github.com/luzvsc)). Projeto acadêmico de Engenharia de Software.

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
