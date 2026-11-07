# Especificação de Requisitos: Ghibli Tracker

Este documento lista os Requisitos Funcionais (RF) e Não Funcionais (RNF) do Ghibli Tracker, além das Regras de Negócio (RN) e da matriz de rastreabilidade com casos de uso, user stories, issues e **testes automatizados**.

## 1. Requisitos Funcionais

| ID     | Requisito                                                                                                                                                                                             | Prioridade |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [RF01] | O sistema deve permitir buscar filmes por título na API do Studio Ghibli. A busca deve ser case-insensitive e por correspondência parcial. Sem o parâmetro titulo, deve retornar o catálogo completo. | Alta       |
| [RF02] | O sistema deve permitir consultar os detalhes de um filme pelo seu identificador (ID) externo.                                                                                                        | Alta       |
| [RF03] | O sistema deve permitir adicionar um filme à watchlist local a partir do seu ID externo.                                                                                                              | Alta       |
| [RF04] | O sistema deve permitir listar todos os itens da watchlist.                                                                                                                                           | Alta       |
| [RF05] | O sistema deve permitir marcar e desmarcar um item da watchlist como assistido.                                                                                                                       | Alta       |
| [RF06] | O sistema deve permitir atribuir uma nota inteira de 1 a 5 a um item marcado como assistido.                                                                                                          | Alta       |
| [RF07] | O sistema deve permitir remover um item da watchlist.                                                                                                                                                 | Média      |
| [RF08] | O sistema deve persistir a watchlist em um arquivo JSON local, criando o arquivo automaticamente caso não exista.                                                                                     | Alta       |
| [RF09] | O sistema deve retornar erros padronizados em JSON, com código e mensagem, para validação (400), recurso não encontrado (404), conflito (409) e falha da API externa (503).                           | Alta       |
| [RF10] | O sistema deve disponibilizar um endpoint de health check (`GET /api/health`) que informe que a aplicação está em execução.                                                                           | Baixa      |

## 2. Requisitos Não Funcionais

| ID      | Categoria        | Requisito                                                                                                   |
| ------- | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| [RNF01] | Desempenho       | As operações locais devem responder em até 200 ms (percentil 95) para uma watchlist de até 500 itens.       |
| [RNF02] | Resiliência      | Uma falha na API externa não deve derrubar o servidor. A chamada deve ter timeout de 5s e resultar em 503.  |
| [RNF03] | Persistência     | Os dados devem ser gravados em arquivo JSON atômico (.tmp -> renomeação).                                   |
| [RNF04] | Portabilidade    | A aplicação deve executar em Node.js 18+ nos sistemas Windows, Linux e macOS.                               |
| [RNF05] | Segurança        | Entradas devem ser validadas. Segredos e configurações por variáveis de ambiente.                           |
| [RNF06] | Usabilidade (DX) | Respostas JSON consistentes, em português, com código de erro explícito.                                    |
| [RNF07] | Testabilidade    | Fluxos principais cobertos por testes (Jest + Supertest), com **cobertura de linhas ≥ 80%** aferida via CI. |
| [RNF08] | Manutenibilidade | Arquitetura em camadas (routes, services, repositories, clients).                                           |
| [RNF09] | Versionamento    | Uso de Git Flow, Conventional Commits e SemVer com tags anotadas.                                           |
| [RNF10] | Documentação     | O README e a pasta docs/ devem estar sincronizados com o código vivo.                                       |

## 3. Regras de Negócio

| ID   | Regra                                                                                                            |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| RN01 | Só é possível avaliar (atribuir nota a) um filme que esteja marcado como assistido. Caso contrário, retorna 409. |
| RN02 | Um mesmo filme não pode ser adicionado duas vezes à watchlist. Caso contrário, retorna 409.                      |
| RN03 | A nota deve ser um número inteiro entre **1 e 5**.                                                               |
| RN04 | Ao desmarcar um filme como assistido, a nota é removida, pois a avaliação depende de ter sido assistido.         |
| RN05 | Ao adicionar um filme, título, diretor e ano são copiados como snapshot para independência de rede na listagem.  |

## 4. Matriz de Rastreabilidade

| Requisito | Caso de Uso | User Story        | Issue | Teste Automatizado (Cobertura)                        |
| --------- | ----------- | ----------------- | ----- | ----------------------------------------------------- |
| RF01      | UC01        | US01              | #08   | `tests/filmes.test.js`                                |
| RF02      | UC01        | US02              | #09   | `tests/filmes.test.js` e `tests/ghibliClient.test.js` |
| RF03      | UC02        | US03              | #11   | `tests/watchlist.test.js`                             |
| RF04      | UC04        | US04              | #12   | `tests/watchlist.test.js`                             |
| RF05      | UC03        | US05              | #13   | `tests/watchlist.test.js`                             |
| RF06      | UC03        | US06              | #13   | `tests/watchlist.test.js`                             |
| RF07      | UC04        | US07              | #12   | `tests/watchlist.test.js`                             |
| RF08      | Transversal | Suporte a US03-07 | #10   | `tests/watchlistRepository.test.js`                   |
| RF09      | Transversal | Suporte a US      | #06   | Validado em todos os testes e `errorHandler.js`       |
| RF10      | Transversal | Operacional       | #06   | `tests/server.test.js`                                |
| RNF02     | Transversal | Falha externa     | #07   | `tests/ghibliClient.test.js` (mocks de falha)         |
| RNF07     | Transversal | Gate de Qualidade | DoD   | `.github/workflows/ci.yml` (Bloqueio PR < 80%)        |
