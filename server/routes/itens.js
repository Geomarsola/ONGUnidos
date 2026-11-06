import { Router } from "express";
import db from "../db.js";
const router = Router();
// GET /api/itens
router.get("/", async (req, res) => {
  const [itens] = await db.execute(`
 SELECT
 i.id_item,
 i.nome,
 i.unidade,
 c.nome AS categoria
 FROM item i
 JOIN categoria c ON c.id_categoria = i.id_categoria
 ORDER BY c.nome, i.nome
 `);
  res.json(itens);
});
export default router;
