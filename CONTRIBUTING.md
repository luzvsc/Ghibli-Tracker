# Contribuindo para o Ghibli Tracker

Obrigado por investir seu tempo contribuindo para o nosso projeto!

## Fluxo de Trabalho (Git Flow)

1. Nunca faça commits diretos na `main` ou `develop`.
2. Crie uma branch a partir da `develop` para a sua issue: `git checkout -b feature/issue-XX-descricao`.
3. Escreva código e crie testes com cobertura.
4. Faça commits seguindo o padrão **Conventional Commits** (ex: `feat(api): adicionar rota X`).
5. Abra um Pull Request para a `develop`.

## Regras de Qualidade

- O código deve manter a cobertura de testes acima de 80%. O GitHub Actions bloqueará PRs que quebrarem essa regra.
- Nenhuma dependência não aprovada deve ser adicionada ao `package.json`.
