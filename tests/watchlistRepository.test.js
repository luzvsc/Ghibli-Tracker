const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const watchlistRepository = require("../src/repositories/watchlistRepository");

describe("Watchlist Repository", () => {
  let tempDir;
  let tempFile;

  beforeAll(async () => {
    // Cria uma pasta temporária no sistema operacional para rodar os testes
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "ghibli-tests-"));
    tempFile = path.join(tempDir, "watchlist.json");

    // Apontamos a variável de ambiente para o arquivo temporário
    process.env.DATA_FILE = tempFile;
  });

  afterAll(async () => {
    // Limpa a pasta temporária após os testes
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  afterEach(async () => {
    // Apaga o arquivo após cada teste para garantir isolamento
    await fs.rm(tempFile, { force: true }).catch(() => {});
  });

  it("Deve retornar array vazio se o arquivo não existir", async () => {
    const itens = await watchlistRepository.lerTodos();
    expect(itens).toEqual([]);
  });

  it("Deve salvar e ler itens corretamente", async () => {
    const watchlistDeTeste = [{ id: "1", titulo: "Totoro" }];

    await watchlistRepository.salvarTodos(watchlistDeTeste);

    const itens = await watchlistRepository.lerTodos();
    expect(itens).toEqual(watchlistDeTeste);
  });

  it("Deve lançar ERRO_ARMAZENAMENTO se o JSON estiver corrompido", async () => {
    // Forçando a criação de um JSON quebrado
    await fs.writeFile(tempFile, "{ json_quebrado, ]", "utf-8");

    await expect(watchlistRepository.lerTodos()).rejects.toMatchObject({
      codigo: "ERRO_ARMAZENAMENTO",
    });
  });

  it("Deve repassar erros desconhecidos na leitura do arquivo", async () => {
    // Força um erro de permissão (EACCES) que não é ENOENT nem SyntaxError
    const erroPermissao = new Error("Sem permissão");
    erroPermissao.code = "EACCES";
    jest.spyOn(fs, "readFile").mockRejectedValueOnce(erroPermissao);

    await expect(watchlistRepository.lerTodos()).rejects.toThrow(
      "Sem permissão",
    );
  });

  it("Deve lançar ERRO_ARMAZENAMENTO se a gravação do arquivo falhar", async () => {
    // Força uma falha na escrita atômica
    jest.spyOn(fs, "writeFile").mockRejectedValueOnce(new Error("Disco cheio"));

    await expect(
      watchlistRepository.salvarTodos([{ id: "1" }]),
    ).rejects.toMatchObject({
      codigo: "ERRO_ARMAZENAMENTO",
      status: 500,
    });
  });
});
