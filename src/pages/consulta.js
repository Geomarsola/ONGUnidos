import { api } from "../api.js";
import { definirMensagem, elemento, formatarData } from "../ui.js";

export async function renderConsulta(container) {
  const cabecalho = elemento("div", undefined, "cabecalho-pagina");
  cabecalho.append(
    elemento("p", "ACOMPANHAMENTO", "sobretitulo"),
    elemento("h1", "Doações recebidas"),
  );
  cabecalho.append(elemento("p", "Consulte as entregas registradas para a ONG."));
  const mensagem = elemento("p", "Carregando doações...", "mensagem");
  mensagem.setAttribute("role", "status");
  const lista = elemento("div", undefined, "grade-doacoes");
  container.append(cabecalho, mensagem, lista);
  try {
    const doacoes = await api.listarDoacoes();
    if (!doacoes.length) {
      definirMensagem(mensagem, "Nenhuma doação registrada ainda.");
      return;
    }
    mensagem.replaceChildren();
    lista.replaceChildren(
      ...doacoes.map((doacao) => {
        const cartao = elemento("article", undefined, "cartao cartao-doacao");
        const topo = elemento("div", undefined, "topo-cartao");
        topo.append(elemento("h2", doacao.doador?.nome || "Doador não identificado"));
        const data = elemento("time", formatarData(doacao.data_doacao), "data-cartao");
        data.dateTime = String(doacao.data_doacao).slice(0, 10);
        topo.append(data);
        const ul = document.createElement("ul");
        ul.className = "lista-itens-doacao";
        for (const item of doacao.itens ?? []) {
          const li = elemento("li");
          li.append(
            elemento("span", item.nome),
            elemento("strong", `${item.quantidade} ${item.unidade}`),
          );
          ul.append(li);
        }
        cartao.append(topo, ul);
        if (doacao.observacao) cartao.append(elemento("p", doacao.observacao, "observacao-cartao"));
        return cartao;
      }),
    );
  } catch (erro) {
    definirMensagem(mensagem, erro.message, "erro");
  }
}
