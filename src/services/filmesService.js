const ghibliClient = require("../clients/ghibliClient");

async function buscarFilmes(tituloDaBusca) {
  // Busca todos os filmes na API externa
  const filmes = await ghibliClient.listarFilmes();

  // Filtra se houver um termo de busca, senão retorna todos
  let filmesFiltrados = filmes;
  if (tituloDaBusca && tituloDaBusca.trim() !== "") {
    const termo = tituloDaBusca.toLowerCase().trim();
    filmesFiltrados = filmes.filter((filme) =>
      filme.titulo.toLowerCase().includes(termo),
    );
  }

  // A listagem retorna apenas os campos principais (US01 / RF01)
  return filmesFiltrados.map((filme) => ({
    id: filme.id,
    titulo: filme.titulo,
    diretor: filme.diretor,
    anoLancamento: filme.anoLancamento,
  }));
}

async function buscarFilmePorId(id) {
  return await ghibliClient.buscarFilmePorId(id);
}

module.exports = { buscarFilmes, buscarFilmePorId };
