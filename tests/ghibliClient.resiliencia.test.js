const ghibliClient = require("../src/clients/ghibliClient");

describe("Cliente da API Ghibli - resiliência e erros", () => {
  const fetchOriginal = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = fetchOriginal;
    jest.useRealTimers();
  });

  it("Deve abortar a requisição e lançar 503 após 5 segundos sem resposta", async () => {
    jest.useFakeTimers();
    global.fetch.mockImplementation(
      (url, { signal }) =>
        new Promise((resolve, reject) => {
          signal.addEventListener("abort", () => reject(new Error("abortado")));
        }),
    );

    const resultado = ghibliClient.listarFilmes();
    const verificacao = expect(resultado).rejects.toMatchObject({
      status: 503,
      codigo: "API_EXTERNA_INDISPONIVEL",
    });

    await jest.advanceTimersByTimeAsync(5000);
    await verificacao;

    expect(global.fetch.mock.calls[0][1].signal.aborted).toBe(true);
  });
});
