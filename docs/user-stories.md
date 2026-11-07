# User Stories: Ghibli Tracker

As histórias seguem o padrão **"Como [ator], quero [ação], para que [valor de negócio]"**. Os critérios de aceite estão no formato **BDD (Dado / Quando / Então)**.

**Ator padrão:** Usuário (fã do Studio Ghibli que consome a API).

---

## US01: Buscar filmes por título

**Como** Usuário, **quero** buscar filmes do Studio Ghibli pelo título, **para que** eu encontre rapidamente um filme do catálogo sem precisar conhecer seu ID.

**Relacionada a:** RF01, UC01 | **Issue:** #08

### Critérios de Aceite

**Cenário 1: Busca com correspondência parcial**

- **Dado** que a API do Studio Ghibli está disponível
- **Quando** eu envio `GET /api/filmes?titulo=totoro`
- **Então** recebo `200 OK` com uma lista contendo "My Neighbor Totoro"
- **E** cada item da lista contém `id`, `titulo`, `diretor` e `anoLancamento`

**Cenário 2: Busca sem diferenciar maiúsculas e minúsculas**

- **Dado** que a API do Studio Ghibli está disponível
- **Quando** eu envio `GET /api/filmes?titulo=SPIRITED`
- **Então** recebo `200 OK` com "Spirited Away" na lista

**Cenário 3: Busca sem termo retorna o catálogo completo**

- **Dado** que a API do Studio Ghibli está disponível
- **Quando** eu envio `GET /api/filmes` sem o parâmetro `titulo`
- **Então** recebo `200 OK` com todos os filmes do catálogo

**Cenário 4: Nenhum resultado**

- **Dado** que a API do Studio Ghibli está disponível
- **Quando** eu envio `GET /api/filmes?titulo=filmeinexistente`
- **Então** recebo `200 OK` com uma lista vazia `[]`

**Cenário 5: API externa indisponível**

- **Dado** que a API do Studio Ghibli não responde em até 5 segundos
- **Quando** eu envio `GET /api/filmes?titulo=totoro`
- **Então** recebo `503 Service Unavailable` com o código `API_EXTERNA_INDISPONIVEL`

---

## US02: Consultar detalhes de um filme

**Como** Usuário, **quero** ver os detalhes de um filme pelo seu ID, **para que** eu possa decidir se quero adicioná-lo à minha watchlist.

**Relacionada a:** RF02, UC01 | **Issue:** #09

### Critérios de Aceite

**Cenário 1: Filme encontrado**

- **Dado** que existe um filme com o ID "2baf70d1-42a9-4d98-9a54-9dbe03d0f1f7" na API externa
- **Quando** eu envio `GET /api/filmes/2baf70d1-42a9-4d98-9a54-9dbe03d0f1f7`
- **Então** recebo `200 OK` com `titulo`, `tituloOriginal`, `descricao`, `diretor`, `produtor`, `anoLancamento`, `duracaoMinutos` e `pontuacaoRottenTomatoes`

**Cenário 2: Filme inexistente**

- **Dado** que não existe filme com o ID informado
- **Quando** eu envio `GET /api/filmes/id-invalido`
- **Então** recebo `404 Not Found` com o código `FILME_NAO_ENCONTRADO`

---

## US03: Adicionar filme à watchlist

**Como** Usuário, **quero** adicionar um filme à minha watchlist, **para que** eu tenha uma lista dos filmes que pretendo assistir.

**Relacionada a:** RF03, UC02 | **Issue:** #11

### Critérios de Aceite

**Cenário 1: Adição bem-sucedida**

- **Dado** que o filme "Spirited Away" existe na API externa e não está na watchlist
- **Quando** eu envio `POST /api/watchlist` com `{ "filmeId": "<id-do-filme>" }`
- **Então** recebo `201 Created` com o item criado
- **E** o item possui `assistido = false`, `nota = null` e os campos `titulo`, `diretor` e `anoLancamento` copiados do filme

**Cenário 2: Filme duplicado**

- **Dado** que o filme já está na watchlist
- **Quando** eu envio `POST /api/watchlist` com o mesmo `filmeId`
- **Então** recebo `409 Conflict` com o código `FILME_JA_NA_WATCHLIST`

**Cenário 3: Corpo inválido**

- **Dado** que o corpo da requisição não contém `filmeId`
- **Quando** eu envio `POST /api/watchlist` com `{}`
- **Então** recebo `400 Bad Request` com o código `VALIDACAO_INVALIDA`

**Cenário 4: Filme inexistente**

- **Dado** que o `filmeId` não existe na API externa
- **Quando** eu envio `POST /api/watchlist` com esse `filmeId`
- **Então** recebo `404 Not Found` com o código `FILME_NAO_ENCONTRADO`

---

## US04: Visualizar minha watchlist

**Como** Usuário, **quero** listar todos os filmes da minha watchlist, **para que** eu tenha uma visão geral do que já assisti e do que falta assistir.

**Relacionada a:** RF04, UC04 | **Issue:** #12

### Critérios de Aceite

**Cenário 1: Listagem com itens**

- **Dado** que existem 2 filmes na watchlist
- **Quando** eu envio `GET /api/watchlist`
- **Então** recebo `200 OK` com um array contendo os 2 itens

**Cenário 2: Listagem vazia**

- **Dado** que a watchlist não possui itens
- **Quando** eu envio `GET /api/watchlist`
- **Então** recebo `200 OK` com `[]`

**Cenário 3: Listagem independe da API externa**

- **Dado** que a API do Studio Ghibli está indisponível
- **Quando** eu envio `GET /api/watchlist`
- **Então** recebo `200 OK` com os itens salvos localmente

---

## US05: Marcar filme como assistido

**Como** Usuário, **quero** marcar um filme como assistido, **para que** eu saiba quais filmes já vi.

**Relacionada a:** RF05, UC03 | **Issue:** #13

### Critérios de Aceite

**Cenário 1: Marcar como assistido**

- **Dado** que existe um item não assistido na watchlist
- **Quando** eu envio `PATCH /api/watchlist/{id}/assistido` com `{ "assistido": true }`
- **Então** recebo `200 OK` com `assistido = true`

**Cenário 2: Valor inválido**

- **Dado** que existe um item na watchlist
- **Quando** eu envio `PATCH /api/watchlist/{id}/assistido` com `{ "assistido": "sim" }`
- **Então** recebo `400 Bad Request` com o código `VALIDACAO_INVALIDA`

**Cenário 3: Item inexistente**

- **Dado** que não existe item com o `id` informado
- **Quando** eu envio `PATCH /api/watchlist/{id}/assistido`
- **Então** recebo `404 Not Found` com o código `ITEM_NAO_ENCONTRADO`

---

## US06: Avaliar filme assistido

**Como** Usuário, **quero** dar uma nota de 1 a 5 a um filme que assisti, **para que** eu registre minha opinião sobre ele.

**Relacionada a:** RF06, UC03 | **Issue:** #14

### Critérios de Aceite

**Cenário 1: Avaliação válida**

- **Dado** que existe um item marcado como assistido
- **Quando** eu envio `PATCH /api/watchlist/{id}/avaliacao` com `{ "nota": 5 }`
- **Então** recebo `200 OK` com `nota = 5`

**Cenário 2: Avaliação de filme não assistido é bloqueada**

- **Dado** que existe um item com `assistido = false`
- **Quando** eu envio `PATCH /api/watchlist/{id}/avaliacao` com `{ "nota": 4 }`
- **Então** recebo `409 Conflict` com o código `FILME_NAO_ASSISTIDO`

**Cenário 3: Nota fora do intervalo**

- **Dado** que existe um item marcado como assistido
- **Quando** eu envio `PATCH /api/watchlist/{id}/avaliacao` com `{ "nota": 11 }`
- **Então** recebo `400 Bad Request` com o código `VALIDACAO_INVALIDA`

**Cenário 4: Nota não inteira**

- **Dado** que existe um item marcado como assistido
- **Quando** eu envio `PATCH /api/watchlist/{id}/avaliacao` com `{ "nota": 7.5 }`
- **Então** recebo `400 Bad Request` com o código `VALIDACAO_INVALIDA`

---

## US07: Remover filme da watchlist

**Como** Usuário, **quero** remover um filme da minha watchlist, **para que** eu mantenha a lista apenas com os filmes que me interessam.

**Relacionada a:** RF07, UC04 | **Issue:** #12

### Critérios de Aceite

**Cenário 1: Remoção bem-sucedida**

- **Dado** que existe um item na watchlist
- **Quando** eu envio `DELETE /api/watchlist/{id}`
- **Então** recebo `204 No Content`
- **E** o item não aparece mais em `GET /api/watchlist`

**Cenário 2: Remoção de item inexistente**

- **Dado** que não existe item com o `id` informado
- **Quando** eu envio `DELETE /api/watchlist/{id}`
- **Então** recebo `404 Not Found` com o código `ITEM_NAO_ENCONTRADO`
