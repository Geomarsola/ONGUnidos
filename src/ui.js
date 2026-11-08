export function elemento(tag, texto, classe) {
  const el = document.createElement(tag);
  if (texto !== undefined && texto !== null) el.textContent = texto;
  if (classe) el.className = classe;
  return el;
}

export function renderShell(rota, renderConteudo) {
  const shell = elemento("div", undefined, "app-shell");
  const topo = elemento("header", undefined, "topo");
  const marca = elemento("a", "ONGUnidos", "marca");
  marca.href = "#/doadores";
  const subtitulo = elemento("span", "Gestão de doações", "subtitulo-marca");
  const nav = elemento("nav");
  nav.setAttribute("aria-label", "Navegação principal");

  const links = [
    ["/doadores", "Doadores"],
    ["/doacoes/nova", "Registrar doação"],
    ["/doacoes", "Doações"],
  ];
  for (const [caminho, rotulo] of links) {
    const link = elemento("a", rotulo, "link-nav");
    link.href = `#${caminho}`;
    if (rota === caminho) {
      link.setAttribute("aria-current", "page");
    }
    nav.append(link);
  }

  topo.append(marca, subtitulo, nav);
  const main = elemento("main", undefined, "conteudo-principal");
  main.id = "conteudo";
  main.setAttribute("tabindex", "-1");
  const rodape = elemento("footer", "ONGUnidos · Sistema de apoio a doações", "rodape");
  shell.append(topo, main, rodape);
  return shell;
}

export function definirMensagem(alvo, texto, tipo = "info") {
  alvo.replaceChildren();
  alvo.className = `mensagem mensagem-${tipo}`;
  alvo.setAttribute("role", tipo === "erro" ? "alert" : "status");
  alvo.textContent = texto;
}

export function formatarData(data) {
  if (!data) return "Data não informada";
  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : String(data);
}

export function criarCampo({
  id,
  label,
  name,
  type = "text",
  required = false,
  maxlength,
  autocomplete,
  min,
}) {
  const grupo = elemento("div", undefined, "campo");
  const rotulo = elemento("label", label);
  rotulo.htmlFor = id;
  const input = document.createElement("input");
  Object.assign(input, { id, name, type, required });
  if (maxlength) input.maxLength = maxlength;
  if (autocomplete) input.autocomplete = autocomplete;
  if (min !== undefined) input.min = min;
  grupo.append(rotulo, input);
  return { grupo, input };
}
