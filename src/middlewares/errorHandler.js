function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      codigo: "JSON_MALFORMADO",
      mensagem: "O corpo da requisição contém JSON inválido.",
    });
  }

  const status = err.status || 500;
  const codigo = err.codigo || "ERRO_INTERNO_SERVIDOR";

  const erroDeDominio = Boolean(err.codigo);
  if (!erroDeDominio) {
    console.error("[errorHandler] Erro inesperado:", err);
  }

  const mensagem = erroDeDominio
    ? err.mensagem || err.message
    : "Ocorreu um erro interno no servidor.";

  res.status(status).json({ codigo, mensagem });
}

module.exports = errorHandler;
