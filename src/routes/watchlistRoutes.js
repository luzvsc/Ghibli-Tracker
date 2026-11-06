const express = require("express");
const watchlistService = require("../services/watchlistService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { filmeId } = req.body;
    const novoItem = await watchlistService.adicionarFilme(filmeId);
    res.status(201).json(novoItem);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const itens = await watchlistService.listarWatchlist();
    res.status(200).json(itens);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await watchlistService.removerFilme(id);
    // Retorna 204 No Content (sem corpo de resposta, apenas indica sucesso)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nota } = req.body; // A nota vem no corpo da requisição (opcional)

    const itemAtualizado = await watchlistService.atualizarStatus(id, nota);
    res.status(200).json(itemAtualizado);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
