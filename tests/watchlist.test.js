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

describe("Rotas da Watchlist - GET e DELETE", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve listar a watchlist corretamente (200)", async () => {
    const mockWatchlist = [{ id: "1", titulo: "Totoro" }];
    watchlistRepository.lerTodos.mockResolvedValue(mockWatchlist);

    const res = await request(app).get("/api/watchlist");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toBe("Totoro");
  });

  it("Deve remover um item da watchlist com sucesso (204)", async () => {
    // Simula que a watchlist tem o item
    watchlistRepository.lerTodos.mockResolvedValue([{ id: "uuid-123" }]);
    watchlistRepository.salvarTodos.mockResolvedValue();

    const res = await request(app).delete("/api/watchlist/uuid-123");

    expect(res.statusCode).toBe(204);
    // O código 204 garante que o corpo (body) é vazio
    expect(res.body).toEqual({});
  });

  it("Deve retornar 404 ao tentar remover item inexistente", async () => {
    // Simula que a watchlist está vazia
    watchlistRepository.lerTodos.mockResolvedValue([]);

    const res = await request(app).delete("/api/watchlist/id-falso");

    expect(res.statusCode).toBe(404);
    expect(res.body.codigo).toBe("ITEM_NAO_ENCONTRADO");
  });
});

describe("Rotas da Watchlist - PATCH (Atualizar Status)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve marcar o filme como assistido e atribuir nota com sucesso (200)", async () => {
    const mockWatchlist = [
      {
        id: "uuid-123",
        titulo: "Ponyo",
        assistido: false,
        nota: null,
      },
    ];

    watchlistRepository.lerTodos.mockResolvedValue(mockWatchlist);
    watchlistRepository.salvarTodos.mockResolvedValue();

    const res = await request(app)
      .patch("/api/watchlist/uuid-123")
      .send({ nota: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.assistido).toBe(true);
    expect(res.body.nota).toBe(5);
    expect(res.body.atualizadoEm).toBeDefined();
  });

  it("Deve retornar 400 se a nota for inválida", async () => {
    watchlistRepository.lerTodos.mockResolvedValue([{ id: "uuid-123" }]);

    const res = await request(app)
      .patch("/api/watchlist/uuid-123")
      .send({ nota: 10 }); // Nota fora do limite (1 a 5)

    expect(res.statusCode).toBe(400);
    expect(res.body.codigo).toBe("NOTA_INVALIDA");
  });

  it("Deve retornar 404 ao tentar atualizar item inexistente", async () => {
    watchlistRepository.lerTodos.mockResolvedValue([]);

    const res = await request(app)
      .patch("/api/watchlist/id-falso")
      .send({ nota: 4 });

    expect(res.statusCode).toBe(404);
    expect(res.body.codigo).toBe("ITEM_NAO_ENCONTRADO");
  });
});
