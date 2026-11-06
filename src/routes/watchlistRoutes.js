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

module.exports = router;
