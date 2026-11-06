import { Router } from "express";
import db from "../db.js";
import { validarDoador } from "../validacao.js";
const router = Router();
const CAMPOS = "id_doador, nome, email, telefone, data_cadastro";
// GET /api/doadores
router.get("/", async (req, res) => {
  const [doadores] = await db.execute(`SELECT ${CAMPOS} FROM doador ORDER BY nome`);
  res.json(doadores);
});
// GET /api/doadores/:id
router.get("/:id", async (req, res) => {
  const [linhas] = await db.execute(`SELECT ${CAMPOS} FROM doador WHERE id_doador = ?`, [
    req.params.id,
  ]);
  if (linhas.length === 0) {
    return res.status(404).json({ erro: "Doador não encontrado" });
  }
  res.json(linhas[0]);
});
// POST /api/doadores
router.post("/", async (req, res) => {
  const erro = validarDoador(req.body);
  if (erro) return res.status(400).json({ erro });
  const nome = req.body.nome.trim();
  const email = req.body.email || null;
  const telefone = req.body.telefone || null;
  try {
    const [resultado] = await db.execute(
      "INSERT INTO doador (nome, email, telefone) VALUES (?, ?, ?)",
      [nome, email, telefone],
    );
    res.status(201).json({
      id_doador: resultado.insertId,
      nome,
      email,
      telefone,
    });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }
    throw e;
  }
});
// PUT /api/doadores/:id
router.put("/:id", async (req, res) => {
  const erro = validarDoador(req.body);
  if (erro) return res.status(400).json({ erro });
  const nome = req.body.nome.trim();
  const email = req.body.email || null;
  const telefone = req.body.telefone || null;
  try {
    const [resultado] = await db.execute(
      "UPDATE doador SET nome = ?, email = ?, telefone = ? WHERE id_doador = ?",
      [nome, email, telefone, req.params.id],
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado" });
    }
    res.json({
      id_doador: Number(req.params.id),
      nome,
      email,
      telefone,
    });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }
    throw e;
  }
});
// DELETE /api/doadores/:id
router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute("DELETE FROM doador WHERE id_doador = ?", [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado" });
    }
    res.status(204).end();
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        erro: "Doador possui doações registradas e não pode ser excluído",
      });
    }
    throw e;
  }
});
export default router;
