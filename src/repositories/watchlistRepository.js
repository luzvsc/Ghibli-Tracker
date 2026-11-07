const fs = require("fs/promises");
const path = require("path");

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
    if (error.code === "ENOENT") {
      return [];
    }
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
    // Garante que a pasta exista antes de gravar (RF08)
    await fs.mkdir(path.dirname(arquivo), { recursive: true });

    await fs.writeFile(tempFile, dadosFormatoJson, "utf-8");
    await fs.rename(tempFile, arquivo);
  } catch (error) {
    await fs.rm(tempFile, { force: true }).catch(() => {});
    const err = new Error("Falha ao gravar os dados na watchlist.");
    err.status = 500;
    err.codigo = "ERRO_ARMAZENAMENTO";
    throw err;
  }
}

module.exports = { lerTodos, salvarTodos };
