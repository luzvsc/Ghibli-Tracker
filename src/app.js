const express = require("express");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware nativo do Express para entender JSON no corpo das requisições
app.use(express.json());

// Endpoint de Health Check (RF10)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Rota 404 para caminhos que não existem
app.use((req, res, next) => {
  res.status(404).json({
    codigo: "ROTA_NAO_ENCONTRADA",
    mensagem: "A rota solicitada não existe nesta API.",
  });
});

// Middleware de tratamento de erros (deve ser OBRIGATORIAMENTE o último middleware)
app.use(errorHandler);

module.exports = app;
