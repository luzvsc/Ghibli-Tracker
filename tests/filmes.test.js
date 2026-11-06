const request = require("supertest");
const app = require("../src/app");
const ghibliClient = require("../src/clients/ghibliClient");

// Isolamos o cliente externo para não fazer requisições de verdade na internet
jest.mock("../src/clients/ghibliClient");

describe("Rotas de Filmes - Busca", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve listar todos os filmes se nenhum título for informado", async () => {
    ghibliClient.listarFilmes.mockResolvedValue([
      {
        id: "1",
        titulo: "Filme A",
        diretor: "Diretor A",
        anoLancamento: "2000",
        descricao: "Ignorado na lista",
      },
    ]);

    const res = await request(app).get("/api/filmes");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toBe("Filme A");
    expect(res.body[0].descricao).toBeUndefined(); // Deve retornar apenas os dados resumidos
  });

  it("Deve filtrar filmes por título case-insensitive", async () => {
    ghibliClient.listarFilmes.mockResolvedValue([
      {
        id: "1",
        titulo: "Spirited Away",
        diretor: "Miyazaki",
        anoLancamento: "2001",
      },
      { id: "2", titulo: "Ponyo", diretor: "Miyazaki", anoLancamento: "2008" },
    ]);

    const res = await request(app).get("/api/filmes?titulo=sPiRitEd");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toBe("Spirited Away");
  });

  it("Deve repassar o erro 503 se a API externa falhar", async () => {
    const erro = new Error("Falha");
    erro.status = 503;
    erro.codigo = "API_EXTERNA_INDISPONIVEL";
    ghibliClient.listarFilmes.mockRejectedValue(erro);

    const res = await request(app).get("/api/filmes");

    expect(res.statusCode).toBe(503);
    expect(res.body.codigo).toBe("API_EXTERNA_INDISPONIVEL");
  });
});

describe("Rotas de Filmes - Detalhe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve retornar detalhes do filme por ID", async () => {
    ghibliClient.buscarFilmePorId.mockResolvedValue({
      id: "123",
      titulo: "Ponyo",
      anoLancamento: "2008",
    });

    const res = await request(app).get("/api/filmes/123");

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe("Ponyo");
  });

  it("Deve retornar 404 se o filme não existir", async () => {
    const erro = new Error("Não encontrado");
    erro.status = 404;
    erro.codigo = "FILME_NAO_ENCONTRADO";
    ghibliClient.buscarFilmePorId.mockRejectedValue(erro);

    const res = await request(app).get("/api/filmes/id-falso");

    expect(res.statusCode).toBe(404);
    expect(res.body.codigo).toBe("FILME_NAO_ENCONTRADO");
  });
});
