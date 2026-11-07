# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- Workflow de CI no GitHub Actions: testes em Node 18 e 20 com gate de 80% de cobertura de linhas.
- Varredura de segredos (Gitleaks) e auditoria de dependências (`npm audit`) no CI.
- Configuração do Dependabot para npm e GitHub Actions.
- Documentação de arquitetura (`docs/arquitetura.md`) com diagramas Mermaid e ADRs.
- Especificação OpenAPI 3.0 (`docs/openapi.yaml`).
- Índice da documentação com regra de sincronização (`docs/README.md`).
- Matriz de rastreabilidade ligando requisitos aos testes automatizados.
- Templates de issue e de pull request, `CONTRIBUTING.md` e `.env.example`.
- Arquivo `LICENSE` (MIT).
- 14 novos testes automatizados (total de 39).

### Changed

- Documentação (requisitos, casos de uso, user stories, charter e README) sincronizada com o comportamento real da API.
- Licença do `package.json` alterada de ISC para MIT, coerente com o README.
- README: autoria e comando de clone corrigidos, endpoints e variáveis de ambiente atualizados.

### Fixed

- O diretório de dados é criado automaticamente na primeira gravação da watchlist (antes, o primeiro `POST` falhava em um clone limpo).
- Erros de domínio passam a devolver a mensagem real em vez da mensagem genérica de erro interno.

## [1.0.0] - 2026-11-06

### Added

- Busca de filmes por título e consulta de detalhes, consumindo a API do Studio Ghibli com timeout de 5 s.
- Watchlist local: adicionar (sem duplicatas), listar, marcar como assistido com nota opcional e remover.
- Estatísticas da watchlist (total, assistidos e nota média).
- Persistência em arquivo JSON com escrita atômica.
- Erros padronizados em JSON e endpoint `GET /api/health`.
- Documentação de planejamento: charter, requisitos, casos de uso e user stories.
- 25 testes automatizados com Jest e Supertest.

[Unreleased]: https://github.com/luzvsc/Ghibli-Tracker/compare/v1.0.0...develop
[1.0.0]: https://github.com/luzvsc/Ghibli-Tracker/releases/tag/v1.0.0
