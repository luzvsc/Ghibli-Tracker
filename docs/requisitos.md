# Especificação de Requisitos: Ghibli Tracker

Este documento lista os **Requisitos Funcionais (RF)** e **Não Funcionais (RNF)** do Ghibli Tracker, além das **Regras de Negócio (RN)** e da **matriz de rastreabilidade** com casos de uso, user stories e issues.

---

## 1. Requisitos Funcionais

| ID         | Requisito                                                                                                                                                                                                               | Prioridade |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **[RF01]** | O sistema deve permitir **buscar filmes por título** na API do Studio Ghibli. A busca deve ser case-insensitive e por correspondência parcial (substring). Sem o parâmetro `titulo`, deve retornar o catálogo completo. | Alta       |
| **[RF02]** | O sistema deve permitir **consultar os detalhes de um filme** pelo seu identificador (ID) externo.                                                                                                                      | Alta       |
| **[RF03]** | O sistema deve permitir **adicionar um filme à watchlist** local a partir do seu ID externo.                                                                                                                            | Alta       |
| **[RF04]** | O sistema deve permitir **listar todos os itens da watchlist**.                                                                                                                                                         | Alta       |
| **[RF05]** | O sistema deve permitir **marcar e desmarcar um item da watchlist como assistido**.                                                                                                                                     | Alta       |
| **[RF06]** | O sistema deve permitir **atribuir uma nota inteira de 1 a 10** a um item marcado como assistido.                                                                                                                       | Alta       |
| **[RF07]** | O sistema deve permitir **remover um item da watchlist**.                                                                                                                                                               | Média      |
| **[RF08]** | O sistema deve **persistir a watchlist** em um arquivo JSON local, criando o arquivo automaticamente caso não exista.                                                                                                   | Alta       |
| **[RF09]** | O sistema deve **retornar erros padronizados** em JSON, com código e mensagem, para validação (400), recurso não encontrado (404), conflito (409) e falha da API externa (503).                                         | Alta       |
| **[RF10]** | O sistema deve disponibilizar um **endpoint de health check** (`GET /api/health`) que informe que a aplicação está em execução.                                                                                         | Baixa      |

---

## 2. Requisitos Não Funcionais

| ID          | Categoria                       | Requisito                                                                                                                                                                                                                                              |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[RNF01]** | Desempenho                      | As operações locais (listar, adicionar, remover, atualizar) devem responder em até **200 ms** (percentil 95) para uma watchlist de até 500 itens, sem contar a latência da API externa.                                                                |
| **[RNF02]** | Resiliência                     | Uma falha ou lentidão na API externa **não deve derrubar o servidor**. A chamada externa deve ter **timeout de 5 segundos** e falhas devem resultar em resposta 503 (RF09).                                                                            |
| **[RNF03]** | Persistência                    | Os dados devem ser gravados em **arquivo JSON**. A gravação deve ser **atômica** (escrita em arquivo temporário seguida de renomeação). Se o JSON existente estiver corrompido, o sistema **não deve sobrescrevê-lo** e deve retornar erro controlado. |
| **[RNF04]** | Portabilidade                   | A aplicação deve executar em **Node.js 18+** nos sistemas Windows, Linux e macOS, sem dependência de serviços externos de infraestrutura.                                                                                                              |
| **[RNF05]** | Segurança                       | Todas as entradas do usuário devem ser **validadas**. Stack traces e detalhes internos **não devem ser expostos** nas respostas. Segredos e configurações devem vir de **variáveis de ambiente**, nunca do código versionado.                          |
| **[RNF06]** | Usabilidade (DX)                | As respostas devem seguir um **formato JSON consistente** e os nomes dos campos devem ser claros e em português. Erros devem indicar o código e uma mensagem compreensível.                                                                            |
| **[RNF07]** | Testabilidade                   | Os fluxos principais devem ser cobertos por **testes automatizados** (Jest + Supertest), com **cobertura de linhas ≥ 70%**. Os testes **não devem depender de rede**: a API externa deve ser simulada.                                                 |
| **[RNF08]** | Manutenibilidade                | O código deve ser organizado em **camadas** (rotas, serviços, repositório de dados e cliente externo), com responsabilidades separadas.                                                                                                                |
| **[RNF09]** | Versionamento e Rastreabilidade | O projeto deve seguir **Git Flow**, **Conventional Commits**, **Versionamento Semântico** com tags anotadas, e **Pull Requests** referenciando issues (`Closes #N`).                                                                                   |
| **[RNF10]** | Documentação                    | O README e os documentos da pasta `docs/` devem permanecer **sincronizados** com a implementação e com o estado das issues.                                                                                                                            |

---

## 3. Regras de Negócio

| ID       | Regra                                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RN01** | Só é possível avaliar (atribuir nota a) um filme que esteja marcado como **assistido**. Caso contrário, a operação retorna 409.                                                          |
| **RN02** | Um mesmo filme (mesmo ID externo) **não pode ser adicionado duas vezes** à watchlist. Caso contrário, a operação retorna 409.                                                            |
| **RN03** | A nota deve ser um **número inteiro entre 1 e 10**.                                                                                                                                      |
| **RN04** | Ao desmarcar um filme como assistido, a **nota é removida** (volta para `null`), pois a avaliação depende de o filme ter sido assistido.                                                 |
| **RN05** | Ao adicionar um filme, **título, diretor e ano de lançamento são copiados** para a watchlist (snapshot). Isso permite listar a watchlist sem depender da disponibilidade da API externa. |

---

## 4. Matriz de Rastreabilidade

| Requisito | Caso de Uso | User Story                 | Issue                                 |
| --------- | ----------- | -------------------------- | ------------------------------------- |
| RF01      | UC01        | US01                       | #08                                   |
| RF02      | UC01        | US02                       | #09                                   |
| RF03      | UC02        | US03                       | #11                                   |
| RF04      | UC04        | US04                       | #12                                   |
| RF05      | UC03        | US05                       | #13                                   |
| RF06      | UC03        | US06                       | #14                                   |
| RF07      | UC04        | US07                       | #12                                   |
| RF08      | Transversal | Suporte a US03 a US07      | #10                                   |
| RF09      | Transversal | Suporte a todas as US      | #06                                   |
| RF10      | Transversal | Suporte operacional        | #06                                   |
| RNF02     | Transversal | Suporte a US01 e US02      | #07                                   |
| RNF07     | Transversal | Verificação de todas as US | Definition of Done de todas as issues |
| RNF09     | Transversal | Processo de entrega        | #05 e #15                             |
