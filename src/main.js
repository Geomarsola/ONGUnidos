import "./style.css";
import { renderDoadores } from "./pages/doadores.js";
import { renderDoacoes } from "./pages/doacoes.js";
import { renderConsulta } from "./pages/consulta.js";
import { renderShell } from "./ui.js";

const app = document.querySelector("#app");
const rotas = {
  "/doadores": renderDoadores,
  "/doacoes/nova": renderDoacoes,
  "/doacoes": renderConsulta,
};

function renderizarRota() {
  const rotaSolicitada = window.location.hash.slice(1) || "/doadores";
  const rota = rotas[rotaSolicitada] ? rotaSolicitada : "/doadores";
  const render = rotas[rota];
  app.replaceChildren(renderShell(rota, render));
  render(app.querySelector("#conteudo"));
}

window.addEventListener("hashchange", renderizarRota);
renderizarRota();
