const request = require("supertest");
const app = require("../src/app");
const ghibliClient = require("../src/clients/ghibliClient");
const watchlistRepository = require("../src/repositories/watchlistRepository");

jest.mock("../src/clients/ghibliClient");
jest.mock("../src/repositories/watchlistRepository");

describe("Rotas da Watchlist - POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve adicionar um filme com sucesso e retornar 201", async () => {
    watchlistRepository.lerTodos.mockResolvedValue([]); // Watchlist vazia
    watchlistRepository.salvarTodos.mockResolvedValue(); // Simula gravação ok

    ghibliClient.buscarFilmePorId.mockResolvedValue({
      id: "abc-123",
      titulo: "Spirited Away",
      diretor: "Hayao Miyazaki",
      anoLancamento: "2001",
    });

    const res = await request(app)
      .post("/api/watchlist")
      .send({ filmeId: "abc-123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.titulo).toBe("Spirited Away");
    expect(res.body.assistido).toBe(false);
    expect(res.body.nota).toBeNull();
    expect(res.body.id).toBeDefined();
  });

  it("Deve retornar 409 se o filme já estiver na watchlist", async () => {
    // Simula que a watchlist já tem o filme
    watchlistRepository.lerTodos.mockResolvedValue([{ filmeId: "abc-123" }]);

    const res = await request(app)
      .post("/api/watchlist")
      .send({ filmeId: "abc-123" });

    expect(res.statusCode).toBe(409);
    expect(res.body.codigo).toBe("FILME_JA_NA_WATCHLIST");
  });

  it("Deve retornar 400 se enviar sem filmeId", async () => {
    const res = await request(app).post("/api/watchlist").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.codigo).toBe("VALIDACAO_INVALIDA");
  });
});
