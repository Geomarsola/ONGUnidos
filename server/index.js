import "dotenv/config";
import express from "express";
const app = express();
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ConectaDoa", hora: new Date().toISOString() });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
