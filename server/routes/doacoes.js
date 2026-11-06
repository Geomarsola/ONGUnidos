import { Router } from "express";
import db from "../db.js";
import { validarDoacao } from "../validacao.js";
const router = Router();
// GET /api/doacoes
router.get("/", async (req, res) => {
  const [linhas] = await db.execute(`
 SELECT
 d.id_doacao,
 d.data_doacao,
 d.observacao,
 dr.id_doador,
 dr.nome AS nome_doador,
 i.id_item,
 i.nome AS nome_item,
 i.unidade,
 di.quantidade
 FROM doacao d
 JOIN doador dr ON dr.id_doador = d.id_doador
 JOIN doacao_item di ON di.id_doacao = d.id_doacao
 JOIN item i ON i.id_item = di.id_item
 ORDER BY d.data_doacao DESC, d.id_doacao DESC, i.nome
 `);
  const doacoes = new Map();
  for (const linha of linhas) {
    if (!doacoes.has(linha.id_doacao)) {
      doacoes.set(linha.id_doacao, {
        id_doacao: linha.id_doacao,
        data_doacao: linha.data_doacao,
        observacao: linha.observacao,
        doador: {
          id_doador: linha.id_doador,
          nome: linha.nome_doador,
        },
        itens: [],
      });
    }
    doacoes.get(linha.id_doacao).itens.push({
      id_item: linha.id_item,
      nome: linha.nome_item,
      unidade: linha.unidade,
      quantidade: linha.quantidade,
    });
  }
  res.json([...doacoes.values()]);
});
// POST /api/doacoes
router.post("/", async (req, res) => {
  const erro = validarDoacao(req.body);
  if (erro) return res.status(400).json({ erro });
  const { id_doador, data_doacao, itens } = req.body;
  const observacao = req.body.observacao || null;
  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    const [resultado] = await conexao.execute(
      "INSERT INTO doacao (id_doador, data_doacao, observacao) VALUES (?, ?, ?)",
      [id_doador, data_doacao, observacao],
    );
    for (const item of itens) {
      await conexao.execute(
        "INSERT INTO doacao_item (id_doacao, id_item, quantidade) VALUES (?, ?, ?)",
        [resultado.insertId, item.id_item, item.quantidade],
      );
    }
    await conexao.commit();
    res.status(201).json({
      id_doacao: resultado.insertId,
      id_doador,
      data_doacao,
      observacao,
      itens,
    });
  } catch (e) {
    await conexao.rollback();
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ erro: "Doador ou item não encontrado" });
    }
    if (e.code === "ER_TRUNCATED_WRONG_VALUE") {
      return res.status(400).json({ erro: "Data inválida" });
    }
    throw e;
  } finally {
    conexao.release();
  }
});
export default router;
