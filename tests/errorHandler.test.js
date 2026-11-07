const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const request = require("supertest");
const app = require("../src/app");
const errorHandler = require("../src/middlewares/errorHandler");

function criarResposta() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler - unidade", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("Deve preservar status, código e mensagem de erros de domínio", () => {
    const err = new Error("O item não foi encontrado na watchlist.");
    err.status = 404;
    err.codigo = "ITEM_NAO_ENCONTRADO";
    const res = criarResposta();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      codigo: "ITEM_NAO_ENCONTRADO",
      mensagem: "O item não foi encontrado na watchlist.",
    });
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("Deve priorizar a propriedade mensagem quando ela existir", () => {
    const err = new Error("texto interno");
    err.status = 409;
    err.codigo = "CONFLITO";
    err.mensagem = "Texto voltado ao cliente.";
    const res = criarResposta();

    errorHandler(err, {}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      codigo: "CONFLITO",
      mensagem: "Texto voltado ao cliente.",
    });
  });

  it("Deve responder 500 genérico e não vazar detalhes de erros inesperados", () => {
    const err = new Error("EACCES: permission denied, open '/etc/segredo'");
    const res = criarResposta();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    const corpo = res.json.mock.calls[0][0];
    expect(corpo).toEqual({
      codigo: "ERRO_INTERNO_SERVIDOR",
      mensagem: "Ocorreu um erro interno no servidor.",
    });
    expect(JSON.stringify(corpo)).not.toContain("segredo");
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe("errorHandler - integração via API", () => {
  let dirTemp;
  let envOriginal;

  beforeAll(async () => {
    envOriginal = process.env.DATA_FILE;
    dirTemp = await fs.mkdtemp(path.join(os.tmpdir(), "ghibli-erros-"));
    process.env.DATA_FILE = path.join(dirTemp, "watchlist.json");
  });

  afterAll(async () => {
    if (envOriginal === undefined) {
      delete process.env.DATA_FILE;
    } else {
      process.env.DATA_FILE = envOriginal;
    }
    await fs.rm(dirTemp, { recursive: true, force: true });
  });

  it("Deve devolver a mensagem real ao remover item inexistente", async () => {
    const res = await request(app).delete("/api/watchlist/id-inexistente");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      codigo: "ITEM_NAO_ENCONTRADO",
      mensagem: "O item não foi encontrado na watchlist.",
    });
  });

  it("Deve devolver a mensagem real ao enviar POST sem filmeId", async () => {
    const res = await request(app).post("/api/watchlist").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      codigo: "VALIDACAO_INVALIDA",
      mensagem: "O campo filmeId é obrigatório e deve ser uma string.",
    });
  });
});
