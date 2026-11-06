const BASE_URL =
  process.env.GHIBLI_API_URL || "https://ghibliapi.vercel.app/films";

function mapearFilme(filmeExt) {
  return {
    id: filmeExt.id,
    titulo: filmeExt.title,
    tituloOriginal: filmeExt.original_title,
    descricao: filmeExt.description,
    diretor: filmeExt.director,
    produtor: filmeExt.producer,
    anoLancamento: filmeExt.release_date,
    duracaoMinutos: filmeExt.running_time,
    pontuacaoRottenTomatoes: filmeExt.rt_score,
  };
}

// Envolve o fetch para garantir que não passe de 5 segundos (RNF02)
async function fetchComTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    const err = new Error(
      "A API do Studio Ghibli demorou a responder ou está fora do ar.",
    );
    err.status = 503;
    err.codigo = "API_EXTERNA_INDISPONIVEL";
    throw err;
  }
}

async function listarFilmes() {
  const response = await fetchComTimeout(BASE_URL);
  if (!response.ok) {
    const err = new Error("Falha ao comunicar com a API do Studio Ghibli.");
    err.status = 503;
    err.codigo = "API_EXTERNA_INDISPONIVEL";
    throw err;
  }
  const data = await response.json();
  return data.map(mapearFilme);
}

async function buscarFilmePorId(id) {
  const response = await fetchComTimeout(`${BASE_URL}/${id}`);

  if (response.status === 404) {
    const err = new Error("Nenhum filme encontrado com o ID informado.");
    err.status = 404;
    err.codigo = "FILME_NAO_ENCONTRADO";
    throw err;
  }

  if (!response.ok) {
    const err = new Error("Falha ao comunicar com a API do Studio Ghibli.");
    err.status = 503;
    err.codigo = "API_EXTERNA_INDISPONIVEL";
    throw err;
  }

  const data = await response.json();
  return mapearFilme(data);
}

module.exports = { listarFilmes, buscarFilmePorId };
