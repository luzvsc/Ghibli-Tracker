const {
  listarFilmes,
  buscarFilmePorId,
} = require("../src/clients/ghibliClient");

// Simulador (mock) do fetch global para os testes
global.fetch = jest.fn();

describe("Cliente da API Ghibli", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("Deve listar e traduzir os campos dos filmes", async () => {
    // Simulando a resposta de sucesso da API
    const mockResponse = [
      { id: "123", title: "My Neighbor Totoro", release_date: "1988" },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const filmes = await listarFilmes();
    expect(filmes).toHaveLength(1);
    expect(filmes[0].titulo).toBe("My Neighbor Totoro");
    expect(filmes[0].anoLancamento).toBe("1988");
  });

  it("Deve lançar erro 404 com código FILME_NAO_ENCONTRADO ao buscar ID inexistente", async () => {
    // Simulando a resposta 404 da API
    fetch.mockResolvedValueOnce({ status: 404, ok: false });

    await expect(buscarFilmePorId("id-falso")).rejects.toMatchObject({
      status: 404,
      codigo: "FILME_NAO_ENCONTRADO",
    });
  });

  it("Deve lançar erro 503 com código API_EXTERNA_INDISPONIVEL em caso de falha de rede", async () => {
    // Simulando cabo de rede desconectado ou timeout
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(listarFilmes()).rejects.toMatchObject({
      status: 503,
      codigo: "API_EXTERNA_INDISPONIVEL",
    });
  });

  it("Deve lançar API_EXTERNA_INDISPONIVEL se a listagem falhar (status não ok)", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(ghibliClient.listarFilmes()).rejects.toMatchObject({
      codigo: "API_EXTERNA_INDISPONIVEL",
      status: 503,
    });
  });

  it("Deve lançar API_EXTERNA_INDISPONIVEL se a busca por ID falhar com status não ok (exceto 404)", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(
      ghibliClient.buscarFilmePorId("id-falso"),
    ).rejects.toMatchObject({
      codigo: "API_EXTERNA_INDISPONIVEL",
      status: 503,
    });
  });
});
