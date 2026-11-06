const request = require("supertest");
const app = require("../src/app");

describe("Testes de Configuração do Servidor e Erros", () => {
  it("Deve retornar 200 e status ok no endpoint de health check", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("Deve retornar 404 e código ROTA_NAO_ENCONTRADA para rota inexistente", async () => {
    const res = await request(app).get("/rota-inexistente-123");
    expect(res.statusCode).toBe(404);
    expect(res.body.codigo).toBe("ROTA_NAO_ENCONTRADA");
  });

  it("Deve retornar 400 para JSON malformado no corpo da requisição", async () => {
    const res = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send('{ "campo": "faltando fechar aspas }'); // JSON quebrado intencionalmente

    expect(res.statusCode).toBe(400);
    expect(res.body.codigo).toBe("JSON_MALFORMADO");
  });
});
