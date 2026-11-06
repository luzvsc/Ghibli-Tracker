const crypto = require("crypto");
const ghibliClient = require("../clients/ghibliClient");
const watchlistRepository = require("../repositories/watchlistRepository");

async function adicionarFilme(filmeId) {
  // 1. Validação básica (400)
  if (!filmeId || typeof filmeId !== "string") {
    const err = new Error(
      "O campo filmeId é obrigatório e deve ser uma string.",
    );
    err.status = 400;
    err.codigo = "VALIDACAO_INVALIDA";
    throw err;
  }

  // 2. Verifica se o filme já existe na watchlist (409 - RN02)
  const itensSalvos = await watchlistRepository.lerTodos();
  const jaExiste = itensSalvos.find((item) => item.filmeId === filmeId);
  if (jaExiste) {
    const err = new Error("Este filme já foi adicionado à sua watchlist.");
    err.status = 409;
    err.codigo = "FILME_JA_NA_WATCHLIST";
    throw err;
  }

  // 3. Busca os detalhes na API do Studio Ghibli (404 ou 503 são disparados pelo cliente)
  const filmeExterno = await ghibliClient.buscarFilmePorId(filmeId);

  // 4. Monta o objeto local copiando os dados principais (RN05)
  const agora = new Date().toISOString();
  const novoItem = {
    id: crypto.randomUUID(),
    filmeId: filmeExterno.id,
    titulo: filmeExterno.titulo,
    diretor: filmeExterno.diretor,
    anoLancamento: filmeExterno.anoLancamento,
    assistido: false,
    nota: null,
    adicionadoEm: agora,
    atualizadoEm: agora,
  };

  // 5. Salva no JSON local
  itensSalvos.push(novoItem);
  await watchlistRepository.salvarTodos(itensSalvos);

  return novoItem;
}

// Listar todos os filmes
async function listarWatchlist() {
  return await watchlistRepository.lerTodos();
}

// Remove um item
async function removerFilme(id) {
  const itensSalvos = await watchlistRepository.lerTodos();
  const index = itensSalvos.findIndex((item) => item.id === id);

  // Se o findIndex retornar -1, significa que o ID não existe na lista
  if (index === -1) {
    const err = new Error("O item não foi encontrado na watchlist.");
    err.status = 404;
    err.codigo = "ITEM_NAO_ENCONTRADO";
    throw err;
  }

  // Remove 1 elemento a partir da posição encontrada
  itensSalvos.splice(index, 1);

  // Salva a lista atualizada
  await watchlistRepository.salvarTodos(itensSalvos);
}

module.exports = { adicionarFilme, listarWatchlist, removerFilme };
