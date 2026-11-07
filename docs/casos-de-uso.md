# Especificação de Casos de Uso: Ghibli Tracker

## 1. Atores

| Ator                         | Descrição                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Usuário**                  | Pessoa que consome a API (via cliente HTTP como cURL, Postman, Insomnia ou um futuro front-end). Representa o fã do Studio Ghibli que gerencia sua watchlist. |
| **API do Studio Ghibli**     | Ator secundário externo. Fornece o catálogo de filmes (`https://ghibliapi.vercel.app/films`).                                                                 |
| **Sistema de Armazenamento** | Ator secundário interno. Representa o arquivo `data/watchlist.json`, onde a watchlist é persistida.                                                           |

---

## 2. Lista de Casos de Uso

| ID       | Caso de Uso                           | Ator Principal | Requisitos |
| -------- | ------------------------------------- | -------------- | ---------- |
| **UC01** | Buscar filmes (e consultar detalhes)  | Usuário        | RF01, RF02 |
| **UC02** | Adicionar filme à watchlist           | Usuário        | RF03       |
| **UC03** | Marcar como assistido e avaliar       | Usuário        | RF05, RF06 |
| **UC04** | Consultar e remover item da watchlist | Usuário        | RF04, RF07 |

---

## UC01: Buscar filmes (e consultar detalhes)

- **Atores:** Usuário (principal), API do Studio Ghibli (secundário).
- **Pré-condições:** O servidor está em execução.
- **Pós-condições:** Lista de filmes ou detalhes de um filme são retornados. Nenhum dado local é alterado.

### Fluxo Principal (Busca por título)

1. O Usuário envia `GET /api/filmes?titulo=totoro`.
2. O sistema consulta a lista de filmes da API do Studio Ghibli.
3. O sistema filtra os filmes cujo título contém o termo informado, sem diferenciar maiúsculas e minúsculas.
4. O sistema retorna `200 OK` com a lista de filmes, contendo `id`, `titulo`, `diretor` e `anoLancamento`.

### Fluxos Alternativos

- **A1: Busca sem termo.** Se o parâmetro `titulo` não for informado ou estiver vazio, o sistema retorna o catálogo completo (passo 2 do fluxo principal, sem filtro).
- **A2: Nenhum resultado.** Se nenhum título corresponder ao termo, o sistema retorna `200 OK` com uma lista vazia `[]`.
- **A3: Consulta de detalhes.** O Usuário envia `GET /api/filmes/{id}`. O sistema consulta a API externa pelo ID e retorna `200 OK` com os detalhes: `id`, `titulo`, `tituloOriginal`, `descricao`, `diretor`, `produtor`, `anoLancamento`, `duracaoMinutos` e `pontuacaoRottenTomatoes`.

### Fluxos de Exceção

- **E1: API externa indisponível ou com timeout (após 5 s).** O sistema retorna `503 Service Unavailable` com o código `API_EXTERNA_INDISPONIVEL`.
- **E2: Filme inexistente (detalhe).** Se o ID informado não existir na API externa, o sistema retorna `404 Not Found` com o código `FILME_NAO_ENCONTRADO`.

---

## UC02: Adicionar filme à watchlist

- **Atores:** Usuário (principal), API do Studio Ghibli (secundário), Sistema de Armazenamento (secundário).
- **Pré-condições:** O servidor está em execução. O Usuário conhece o ID do filme (obtido via UC01).
- **Pós-condições:** Um novo item é gravado em `data/watchlist.json` com `assistido = false` e `nota = null`.

### Fluxo Principal

1. O Usuário envia `POST /api/watchlist` com o corpo `{ "filmeId": "<id>" }`.
2. O sistema valida que `filmeId` é uma string não vazia.
3. O sistema consulta o filme na API do Studio Ghibli pelo `filmeId`.
4. O sistema verifica que o filme ainda não está na watchlist (RN02).
5. O sistema cria o item copiando título, diretor e ano do filme (RN05), gera um `id` local e grava no arquivo JSON.
6. O sistema retorna `201 Created` com o item criado.

### Fluxos Alternativos

- Nenhum.

### Fluxos de Exceção

- **E1: Dados ausentes ou inválidos.** Se `filmeId` estiver ausente, vazio ou não for string, o sistema retorna `400 Bad Request` com o código `VALIDACAO_INVALIDA`.
- **E2: Filme não encontrado na API externa.** O sistema retorna `404 Not Found` com o código `FILME_NAO_ENCONTRADO`.
- **E3: Filme já existente na watchlist.** O sistema retorna `409 Conflict` com o código `FILME_JA_NA_WATCHLIST`.
- **E4: API externa indisponível.** O sistema retorna `503 Service Unavailable` com o código `API_EXTERNA_INDISPONIVEL`.

---

## UC03: Marcar como assistido e avaliar

- **Atores:** Usuário (principal).
- **Pré-condições:** O item existe na watchlist.
- **Pós-condições:** O campo `assistido` é atualizado. Se houver avaliação, o campo `nota` é atualizado. A data `atualizadoEm` é renovada.

### Fluxo Principal (Marcar como assistido)

1. O Usuário envia `PATCH /api/watchlist/{id}/assistido` com `{ "assistido": true }`.
2. O sistema valida que `assistido` é um booleano.
3. O sistema localiza o item pelo `id` e atualiza o campo `assistido`.
4. O sistema grava o arquivo JSON e retorna `200 OK` com o item atualizado.

### Fluxo Principal (Avaliar)

1. O Usuário envia `PATCH /api/watchlist/{id}/avaliacao` com `{ "nota": 5 }`.
2. O sistema valida que `nota` é um inteiro entre 1 e 5 (RN03).
3. O sistema verifica que o item está marcado como assistido (RN01).
4. O sistema atualiza o campo `nota`, grava o arquivo JSON e retorna `200 OK` com o item atualizado.

### Fluxos de Exceção

- **E1: Assistido inválido.** Se `assistido` não for booleano, o sistema retorna `400` com `VALIDACAO_INVALIDA`.
- **E2: Nota inválida.** Se `nota` não for inteiro entre 1 e 5, o sistema retorna `400` com `VALIDACAO_INVALIDA`.
- **E3: Filme não assistido.** Se o item não estiver marcado como assistido, o sistema retorna `409 Conflict` com o código `FILME_NAO_ASSISTIDO`.
- **E4: Item inexistente.** Se o `id` não existir, o sistema retorna `404 Not Found` com o código `ITEM_NAO_ENCONTRADO`.

---

## UC04: Consultar e remover item da watchlist

- **Atores:** Usuário (principal), Sistema de Armazenamento (secundário).
- **Pré-condições:** O servidor está em execução.
- **Pós-condições:** Na listagem, nenhum dado é alterado. Na remoção, o item é excluído de `data/watchlist.json`.

### Fluxo Principal (Listar)

1. O Usuário envia `GET /api/watchlist`.
2. O sistema lê o arquivo JSON e retorna `200 OK` com a lista de itens (pode ser `[]`).

### Fluxo Principal (Remover)

1. O Usuário envia `DELETE /api/watchlist/{id}`.
2. O sistema localiza o item pelo `id`, remove-o e grava o arquivo JSON.
3. O sistema retorna `204 No Content`.

### Fluxos de Exceção

- **E1: Item inexistente na remoção.** O sistema retorna `404 Not Found` com o código `ITEM_NAO_ENCONTRADO`.
- **E2: Arquivo de dados corrompido.** Se `data/watchlist.json` contiver JSON inválido, o sistema retorna `500 Internal Server Error` com o código `ERRO_ARMAZENAMENTO`, sem sobrescrever o arquivo (RNF03).

---

## Formato Padrão de Erro

Todas as respostas de erro seguem o formato abaixo (RF09):

```json
{
  "codigo": "FILME_NAO_ENCONTRADO",
  "mensagem": "Nenhum filme encontrado com o ID informado."
}
```
