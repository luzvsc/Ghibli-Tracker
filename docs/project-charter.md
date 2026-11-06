# Project Charter: Ghibli Tracker

| Campo                         | Valor                                            |
| ----------------------------- | ------------------------------------------------ |
| **Projeto**                   | Ghibli Tracker                                   |
| **Versão do documento**       | 1.0                                              |
| **Tipo de projeto**           | Acadêmico                                        |
| **Tech Lead / Desenvolvedor** | Luz Vasconcelos                                  |
| **Duração prevista**          | 1 semana (ciclo único, com entregas versionadas) |
| **Status**                    | Em execução                                      |

---

## 1. Justificativa

O Studio Ghibli possui um catálogo extenso de longas-metragens, e fãs costumam querer organizar quais filmes já assistiram, quais pretendem assistir e quais avaliaram. Hoje, esse controle é feito de forma manual (anotações, planilhas ou listas em aplicativos genéricos), o que exige digitar os dados de cada filme e não oferece um histórico estruturado.

O Ghibli Tracker resolve esse problema consumindo a **API pública do Studio Ghibli** para obter os dados oficiais dos filmes e permitindo ao usuário montar uma **watchlist local** com status de "assistido" e nota. Como o catálogo vem de uma fonte externa, o usuário não precisa cadastrar manualmente título, diretor ou ano de lançamento.

Do ponto de vista acadêmico, o projeto foi escolhido por ter escopo enxuto e realista para uma semana, com requisitos claros, integração com um serviço externo e persistência simples, o que permite exercitar especificação, rastreabilidade e fluxo de versionamento profissional.

## 2. Visão do Produto

> Para **fãs do Studio Ghibli** que desejam **organizar e avaliar os filmes que pretendem ou já assistiram**, o **Ghibli Tracker** é uma **API REST** que **busca filmes no catálogo oficial e mantém uma watchlist pessoal persistida localmente**. Diferente de anotações manuais, ele **preenche automaticamente os dados dos filmes** a partir da API do Studio Ghibli.

## 3. Objetivos SMART

| ID        | Objetivo                                         | Específico                                                      | Mensurável                                                                  | Atingível                           | Relevante                    | Temporal                         |
| --------- | ------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------- | ---------------------------- | -------------------------------- |
| **OBJ01** | Entregar a documentação de planejamento          | Charter, RF/RNF, casos de uso e user stories na pasta `docs/`   | 4 documentos publicados e aprovados por checklist                           | Sim, com base no enunciado          | Base para o backlog          | Dia 1 (v0.1.0)                   |
| **OBJ02** | Integrar a API pública do Studio Ghibli          | Endpoints de busca e detalhe de filmes consumindo a API externa | 2 endpoints de filmes respondendo 200/404/503 corretamente                  | Sim, API pública e sem autenticação | Núcleo do produto            | Dia 3 (v0.2.0)                   |
| **OBJ03** | Implementar a watchlist com persistência em JSON | CRUD da watchlist, com dados gravados em `data/watchlist.json`  | 5 endpoints de watchlist implementados e persistindo entre reinicializações | Sim, arquivo local                  | Diferencial do produto       | Dia 5 (v0.3.0 e v0.4.0)          |
| **OBJ04** | Garantir qualidade mínima do código              | Testes automatizados dos fluxos principais                      | Cobertura ≥ 70% e 100% dos testes passando no CI                            | Sim, Jest + Supertest               | Exigido para rastreabilidade | Contínuo, validado no fechamento |
| **OBJ05** | Garantir rastreabilidade do processo             | Issues, branches, commits e tags vinculados                     | 15 issues concluídas, 15 PRs com `Closes #N`, tags anotadas v0.1.0 a v1.0.0 | Sim                                 | Critério da atividade        | Até a entrega                    |

## 4. Escopo Preliminar

### 4.1 Dentro do escopo (v1.0.0)

- Busca de filmes por título na API do Studio Ghibli.
- Consulta de detalhes de um filme pelo seu ID externo.
- Adição de um filme à watchlist local.
- Listagem e remoção de itens da watchlist.
- Marcação de filme como assistido ou não assistido.
- Avaliação de filme assistido com nota de 1 a 10.
- Persistência da watchlist em arquivo JSON local.
- Tratamento padronizado de erros e endpoint de health check.
- Testes automatizados e pipeline mínimo de CI (GitHub Actions).
- README, documentação e versionamento semântico com tags anotadas.

### 4.2 Fora do escopo (expressamente excluído)

- Autenticação, cadastro de usuários e múltiplos perfis.
- Banco de dados relacional ou NoSQL (a persistência é apenas em arquivo JSON).
- Interface gráfica (front-end, aplicativo mobile ou web).
- Deploy em nuvem ou containerização.
- Cache ou sincronização periódica com a API do Studio Ghibli.
- Sistema de recomendação ou estatísticas avançadas.
- Edição dos dados dos filmes (a fonte da verdade é a API externa).
- Exportação, importação ou compartilhamento de watchlists.
- Internacionalização e testes end-to-end com navegador.

## 5. Stakeholders e Público-Alvo

| Stakeholder                                   | Papel                                     | Interesse                                                               | Influência               |
| --------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- | ------------------------ |
| **Luz Vasconcelos**                           | Tech Lead, Desenvolvedor e Product Owner  | Entregar o projeto com qualidade e rastreabilidade                      | Alta                     |
| **Fabio Chicout**                             | Avaliador                                 | Verificar o domínio de especificação, backlog, Git Flow, commits e tags | Alta                     |
| **Fãs do Studio Ghibli**                      | Público-alvo final                        | Organizar filmes a assistir e registrar avaliações                      | Média                    |
| **Studio Ghibli API (mantenedores externos)** | Fornecedor de dados (dependência externa) | Disponibilidade e estabilidade da API pública                           | Baixa (fora de controle) |

**Público-alvo primário:** fãs do Studio Ghibli e desenvolvedores que queiram consumir uma API REST simples de watchlist.

## 6. Premissas, Restrições e Riscos

### Premissas

- A API pública do Studio Ghibli (`https://ghibliapi.vercel.app`) estará disponível e sem exigência de autenticação durante o desenvolvimento.
- O ambiente de desenvolvimento possui Node.js 18 ou superior.

### Restrições

- Prazo de uma semana.
- Persistência limitada a arquivo local `.json`.
- Projeto individual.

### Riscos

| ID  | Risco                             | Probabilidade | Impacto | Mitigação                                                                          |
| --- | --------------------------------- | ------------- | ------- | ---------------------------------------------------------------------------------- |
| R01 | Indisponibilidade da API externa  | Média         | Alto    | Timeout de 5s, resposta 503 padronizada e testes com API simulada                  |
| R02 | Corrupção do arquivo JSON         | Baixa         | Alto    | Escrita atômica (arquivo temporário + renomeação) e não sobrescrever JSON inválido |
| R03 | Escopo crescer além do prazo      | Média         | Médio   | Escopo congelado neste documento; itens extras vão para o backlog futuro           |
| R04 | Mudança no formato da API externa | Baixa         | Médio   | Mapeamento centralizado em um único módulo cliente                                 |

## 7. Marcos e Versionamento

| Versão | Marco                                  | Issues associadas |
| ------ | -------------------------------------- | ----------------- |
| v0.1.0 | Documentação e setup                   | #01 a #05         |
| v0.2.0 | Servidor e integração com a API Ghibli | #06 a #09         |
| v0.3.0 | Persistência e watchlist básica        | #10 a #12         |
| v0.4.0 | Status assistido e avaliação           | #13 a #14         |
| v1.0.0 | Entrega final e README consolidado     | #15               |

## 8. Critérios de Sucesso

1. Todos os RFs listados em `requisitos.md` implementados e rastreados a uma issue.
2. Todos os critérios de aceite das user stories verificados.
3. Testes automatizados passando no CI.
4. Tags anotadas publicadas para cada marco.
5. README sincronizado com o estado real do projeto.
