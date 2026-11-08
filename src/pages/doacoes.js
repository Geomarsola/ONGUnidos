import { api } from "../api.js";
import { definirMensagem, elemento } from "../ui.js";

function hoje() {
  const agora = new Date();
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export async function renderDoacoes(container) {
  const cabecalho = elemento("div", undefined, "cabecalho-pagina");
  cabecalho.append(
    elemento("p", "NOVA ENTRADA", "sobretitulo"),
    elemento("h1", "Registrar doação"),
  );
  cabecalho.append(elemento("p", "Informe quem doou e os itens recebidos."));
  const painel = elemento("section", undefined, "painel painel-formulario");
  const form = document.createElement("form");
  const mensagem = elemento("p", "Carregando dados...", "mensagem");
  mensagem.setAttribute("role", "status");

  const grupoDoador = elemento("div", undefined, "campo");
  const labelDoador = elemento("label", "Doador");
  labelDoador.htmlFor = "doador";
  const selectDoador = document.createElement("select");
  selectDoador.id = "doador";
  selectDoador.name = "id_doador";
  selectDoador.required = true;
  selectDoador.append(new Option("Selecione um doador", ""));
  grupoDoador.append(labelDoador, selectDoador);

  const grupoData = elemento("div", undefined, "campo");
  const labelData = elemento("label", "Data da doação");
  labelData.htmlFor = "data-doacao";
  const inputData = document.createElement("input");
  inputData.type = "date";
  inputData.id = "data-doacao";
  inputData.name = "data_doacao";
  inputData.required = true;
  inputData.value = hoje();
  grupoData.append(labelData, inputData);

  const grupoObs = elemento("div", undefined, "campo");
  const labelObs = elemento("label", "Observação (opcional)");
  labelObs.htmlFor = "observacao";
  const observacao = document.createElement("textarea");
  observacao.id = "observacao";
  observacao.name = "observacao";
  observacao.maxLength = 255;
  observacao.rows = 3;
  grupoObs.append(labelObs, observacao);

  const fieldset = document.createElement("fieldset");
  fieldset.className = "itens-fieldset";
  fieldset.append(elemento("legend", "Itens recebidos"));
  const listaItens = elemento("div", undefined, "linhas-itens");
  const adicionar = elemento("button", "＋ Adicionar item", "botao botao-secundario");
  adicionar.type = "button";
  adicionar.addEventListener("click", () => adicionarLinha());
  fieldset.append(listaItens, adicionar);
  const salvar = elemento("button", "Registrar doação", "botao botao-principal");
  salvar.type = "submit";
  form.append(grupoDoador, grupoData, grupoObs, fieldset, mensagem, salvar);
  painel.append(form);
  container.append(cabecalho, painel);

  let doadores = [];
  let itens = [];
  let proximoNumeroLinha = 0;
  function adicionarLinha(idInicial = "") {
    proximoNumeroLinha += 1;
    const numeroLinha = proximoNumeroLinha;
    const linha = elemento("div", undefined, "linha-item");
    const grupoItem = elemento("div", undefined, "campo");
    const labelItem = elemento("label", "Item");
    const select = document.createElement("select");
    select.required = true;
    select.name = "item";
    select.append(new Option("Selecione um item", ""));
    for (const item of itens) {
      select.append(new Option(`${item.nome} · ${item.unidade}`, String(item.id_item)));
    }
    if (idInicial) select.value = String(idInicial);
    labelItem.htmlFor = `item-${numeroLinha}`;
    select.id = labelItem.htmlFor;
    grupoItem.append(labelItem, select);
    const grupoQuantidade = elemento("div", undefined, "campo campo-quantidade");
    const labelQuantidade = elemento("label", "Quantidade");
    const quantidade = document.createElement("input");
    quantidade.type = "number";
    quantidade.name = "quantidade";
    quantidade.required = true;
    quantidade.min = "1";
    quantidade.step = "1";
    quantidade.value = "1";
    labelQuantidade.htmlFor = `quantidade-${numeroLinha}`;
    quantidade.id = labelQuantidade.htmlFor;
    grupoQuantidade.append(labelQuantidade, quantidade);
    const remover = elemento("button", "Remover", "botao botao-perigo botao-remover");
    remover.type = "button";
    remover.setAttribute("aria-label", "Remover este item da doação");
    remover.addEventListener("click", () => {
      linha.remove();
      if (!listaItens.children.length) adicionarLinha();
    });
    linha.append(grupoItem, grupoQuantidade, remover);
    listaItens.append(linha);
  }

  try {
    [doadores, itens] = await Promise.all([api.listarDoadores(), api.listarItens()]);
    selectDoador.replaceChildren(new Option("Selecione um doador", ""));
    for (const doador of doadores)
      selectDoador.append(new Option(doador.nome, String(doador.id_doador)));
    if (!doadores.length) {
      definirMensagem(
        mensagem,
        "Cadastre pelo menos um doador antes de registrar uma doação.",
        "erro",
      );
      salvar.disabled = true;
    } else if (!itens.length) {
      definirMensagem(mensagem, "Não há itens disponíveis no catálogo.", "erro");
      salvar.disabled = true;
    } else {
      mensagem.replaceChildren();
      adicionarLinha();
    }
  } catch (erro) {
    definirMensagem(mensagem, erro.message, "erro");
    salvar.disabled = true;
    adicionar.disabled = true;
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const linhas = [...listaItens.children];
    const itensDoacao = linhas.map((linha) => ({
      id_item: Number(linha.querySelector('[name="item"]').value),
      quantidade: Number(linha.querySelector('[name="quantidade"]').value),
    }));
    if (new Set(itensDoacao.map((item) => item.id_item)).size !== itensDoacao.length) {
      definirMensagem(
        mensagem,
        "Escolha cada item apenas uma vez. Ajuste as quantidades nas linhas existentes.",
        "erro",
      );
      return;
    }
    salvar.disabled = true;
    salvar.textContent = "Registrando...";
    try {
      await api.criarDoacao({
        id_doador: Number(selectDoador.value),
        data_doacao: inputData.value,
        observacao: observacao.value.trim() || null,
        itens: itensDoacao,
      });
      form.reset();
      inputData.value = hoje();
      listaItens.replaceChildren();
      adicionarLinha();
      definirMensagem(mensagem, "Doação registrada com sucesso.", "sucesso");
    } catch (erro) {
      definirMensagem(mensagem, erro.message, "erro");
    } finally {
      salvar.disabled = false;
      salvar.textContent = "Registrar doação";
    }
  });
}
