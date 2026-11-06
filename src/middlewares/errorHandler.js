function errorHandler(err, req, res, next) {
  // Captura erro de JSON malformado (ex: o usuário mandou um JSON quebrado no POST)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      codigo: "JSON_MALFORMADO",
      mensagem: "O corpo da requisição contém JSON inválido.",
    });
  }

  // Se o erro já vier com status e código definidos pelas nossas regras de negócio, usamos.
  // Senão, é um erro inesperado (500).
  const status = err.status || 500;
  const codigo = err.codigo || "ERRO_INTERNO_SERVIDOR";
  const mensagem = err.mensagem || "Ocorreu um erro interno no servidor.";

  res.status(status).json({ codigo, mensagem });
}

module.exports = errorHandler;
