const express = require("express");
const filmesService = require("../services/filmesService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { titulo } = req.query;
    const filmes = await filmesService.buscarFilmes(titulo);
    res.status(200).json(filmes);
  } catch (error) {
    next(error); // Manda o erro para o middleware centralizado
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const filme = await filmesService.buscarFilmePorId(id);
    res.status(200).json(filme);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
