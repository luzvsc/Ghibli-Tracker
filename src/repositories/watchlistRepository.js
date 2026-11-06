const fs = require("fs/promises");
const path = require("path");

// Transformamos a constante em uma função para ler a variável em tempo real
function getArquivoDados() {
  return (
    process.env.DATA_FILE ||
    path.join(__dirname, "..", "..", "data", "watchlist.json")
  );
}

async function lerTodos() {
  try {
    const conteudo = await fs.readFile(getArquivoDados(), "utf-8");
    return JSON.parse(conteudo);
  } catch (error) {
    // Se o arquivo não existir, retornamos uma lista vazia
    if (error.code === "ENOENT") {
      return [];
    }

    // Se o arquivo existir mas o JSON estiver quebrado (corrompido)
    if (error instanceof SyntaxError) {
      const err = new Error("O arquivo de dados da watchlist está corrompido.");
      err.status = 500;
      err.codigo = "ERRO_ARMAZENAMENTO";
      throw err;
    }

    throw error;
  }
}

async function salvarTodos(itens) {
  const arquivo = getArquivoDados();
  const tempFile = `${arquivo}.tmp`;
  const dadosFormatoJson = JSON.stringify(itens, null, 2);

  try {
    // Escrita atômica usando o caminho em tempo real
    await fs.writeFile(tempFile, dadosFormatoJson, "utf-8");
    await fs.rename(tempFile, arquivo);
  } catch (error) {
    const err = new Error("Falha ao gravar os dados na watchlist.");
    err.status = 500;
    err.codigo = "ERRO_ARMAZENAMENTO";
    throw err;
  }
}

module.exports = { lerTodos, salvarTodos };
