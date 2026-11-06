const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const filmesRoutes = require("./routes/filmesRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/filmes", filmesRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    codigo: "ROTA_NAO_ENCONTRADA",
    mensagem: "A rota solicitada não existe nesta API.",
  });
});

app.use(errorHandler);

module.exports = app;
