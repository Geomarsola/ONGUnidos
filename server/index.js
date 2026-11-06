import "dotenv/config";
import express from "express";
import db from "./db.js";
import doadores from "./routes/doadores.js";
import itens from "./routes/itens.js";
import doacoes from "./routes/doacoes.js";
const app = express();
app.use(express.json());
app.get("/api/health", async (req, res) => {
  let banco = "ok";
  try {
    await db.query("SELECT 1");
  } catch {
    banco = "sem conexão";
  }
  res.json({
    status: "ok",
    banco,
    app: "ongunidos",
    hora: new Date().toISOString(),
  });
});
app.use("/api/doadores", doadores);
app.use("/api/itens", itens);
app.use("/api/doacoes", doacoes);
// Tratamento final de erros
app.use((erro, req, res, _next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({
      erro: "JSON inválido no corpo da requisição",
    });
  }
  console.error(erro);
  res.status(500).json({ erro: "Erro interno no servidor" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
