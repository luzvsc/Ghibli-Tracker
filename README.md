# 🎬 Ghibli Tracker

![Versão](https://img.shields.io/github/v/tag/luzvsc/Ghibli-Tracker?label=vers%C3%A3o&color=blue)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Build](https://github.com/luzvsc/Ghibli-Tracker/actions/workflows/ci.yml/badge.svg)
![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-success)

API REST em **Node.js + Express** que consome a **API pública do Studio Ghibli** para buscar filmes e permite salvar esses filmes em uma **watchlist pessoal**, com marcação de "assistido" e avaliação de 1 a 5. A watchlist é persistida localmente em um arquivo JSON.

## 🎯 Problema resolvido

Fãs do Studio Ghibli costumam acompanhar o catálogo de filmes em anotações soltas, sem padronização e sem histórico de avaliações. O Ghibli Tracker centraliza essa informação: os dados dos filmes vêm da fonte oficial, e o usuário controla apenas o que importa para ele (o que já assistiu e o que achou).

## 📋 Sumário de Funcionalidades

| Funcionalidade                       | Requisito | Status       |
| ------------------------------------ | --------- | ------------ |
| Buscar filmes por título             | RF01      | ✅ Concluído |
| Consultar detalhes de um filme       | RF02      | ✅ Concluído |
| Adicionar filme à watchlist          | RF03      | ✅ Concluído |
| Listar a watchlist                   | RF04      | ✅ Concluído |
| Marcar/desmarcar como assistido      | RF05      | ✅ Concluído |
| Avaliar filme assistido (nota 1 a 5) | RF06      | ✅ Concluído |
| Remover filme da watchlist           | RF07      | ✅ Concluído |
| Persistência em JSON local           | RF08      | ✅ Concluído |
| Erros padronizados                   | RF09      | ✅ Concluído |
| Health check                         | RF10      | ✅ Concluído |

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Persistência:** arquivo JSON local (`fs/promises`)
- **Testes:** Jest + Supertest (Cobertura > 80%)
- **CI:** GitHub Actions
- **Fonte de dados:** [API pública do Studio Ghibli](https://ghibliapi.vercel.app/films)

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Git](https://git-scm.com/)
- Um cliente HTTP para testes (cURL, Postman ou Insomnia)

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

**3. Execute em modo de desenvolvimento (com recarregamento automático)**

```bash
npm run dev
```

**4. Verifique se a aplicação está no ar**

```bash
curl http://localhost:3000/api/health
```

**5. Execute os testes automatizados**

```bash
npm test
```

### Variáveis de Ambiente (opcionais)

| Variável         | Padrão                               | Descrição                            |
| ---------------- | ------------------------------------ | ------------------------------------ |
| `PORT`           | `3000`                               | Porta do servidor HTTP               |
| `GHIBLI_API_URL` | `https://ghibliapi.vercel.app/films` | URL base da API do Studio Ghibli     |
| `DATA_FILE`      | `data/watchlist.json`                | Caminho do arquivo JSON da watchlist |

## 🔌 Endpoints

| Método   | Rota                          | Descrição                                                        | Sucesso | Erros              |
| -------- | ----------------------------- | ---------------------------------------------------------------- | ------- | ------------------ |
| `GET`    | `/api/health`                 | Verifica se a aplicação está ativa                               | 200     | -                  |
| `GET`    | `/api/filmes?titulo=`         | Busca filmes por título (parcial, sem distinção de maiúsculas)   | 200     | 503                |
| `GET`    | `/api/filmes/:id`             | Detalhes de um filme pelo ID externo                             | 200     | 404, 503           |
| `POST`   | `/api/watchlist`              | Adiciona filme à watchlist (corpo: `{"filmeId": "..."}`)         | 201     | 400, 404, 409, 503 |
| `GET`    | `/api/watchlist`              | Lista todos os itens da watchlist                                | 200     | 500                |
| `PATCH`  | `/api/watchlist/:id`          | Atualiza status para assistido e recebe nota opcional (1 a 5)    | 200     | 400, 404           |
| `DELETE` | `/api/watchlist/:id`          | Remove item da watchlist                                         | 204     | 404                |
| `GET`    | `/api/watchlist/estatisticas` | Resumo estatístico da watchlist (total, assistidos e nota média) | 200     | 500                |

**Exemplo de uso:**

```bash
# Adicionar um filme à watchlist
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"filmeId": "<id-do-filme>"}'

# Marcar como assistido e avaliar com nota 5
curl -X PATCH http://localhost:3000/api/watchlist/<id> \
  -H "Content-Type: application/json" \
  -d '{"nota": 5}'
```

## 📚 Documentação

Consulte a pasta `docs/` para acessar o Project Charter, Requisitos, Casos de Uso, User Stories e o Documento de Arquitetura (em breve). O fluxo de Git e padronizações seguem as metodologias de Git Flow, Conventional Commits e SemVer.

## 👤 Autor

**Luz Vasconcelos** - Desenvolvimento de Software.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
