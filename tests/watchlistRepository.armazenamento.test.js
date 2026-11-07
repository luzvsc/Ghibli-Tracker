const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const repository = require("../src/repositories/watchlistRepository");

describe("Watchlist Repository - armazenamento", () => {
  let dirTemp;
  let envOriginal;

  beforeEach(async () => {
    envOriginal = process.env.DATA_FILE;
    dirTemp = await fs.mkdtemp(path.join(os.tmpdir(), "ghibli-repo-"));
  });

  afterEach(async () => {
    if (envOriginal === undefined) {
      delete process.env.DATA_FILE;
    } else {
      process.env.DATA_FILE = envOriginal;
    }
    await fs.rm(dirTemp, { recursive: true, force: true });
  });

  it("Deve criar o diretório de dados automaticamente ao salvar", async () => {
    process.env.DATA_FILE = path.join(
      dirTemp,
      "data",
      "aninhado",
      "watchlist.json",
    );
    const itens = [{ id: "1", filmeId: "filme-1" }];

    await repository.salvarTodos(itens);

    expect(await repository.lerTodos()).toEqual(itens);
  });

  it("Não deve deixar arquivo temporário após salvar", async () => {
    process.env.DATA_FILE = path.join(dirTemp, "watchlist.json");

    await repository.salvarTodos([{ id: "1" }]);

    expect(await fs.readdir(dirTemp)).toEqual(["watchlist.json"]);
  });

  it("Deve lançar ERRO_ARMAZENAMENTO quando não consegue gravar", async () => {
    const bloqueio = path.join(dirTemp, "bloqueio");
    await fs.writeFile(bloqueio, "conteudo");
    process.env.DATA_FILE = path.join(bloqueio, "watchlist.json");

    await expect(repository.salvarTodos([])).rejects.toMatchObject({
      status: 500,
      codigo: "ERRO_ARMAZENAMENTO",
    });
  });

  it("Deve repassar erros de leitura inesperados sem mascará-los", async () => {
    process.env.DATA_FILE = dirTemp;
    await expect(repository.lerTodos()).rejects.toMatchObject({
      code: "EISDIR",
    });
  });
});
