import { api } from "../api.js";
import { criarCampo, definirMensagem, elemento, formatarData } from "../ui.js";

export async function renderDoadores(container) {
  const cabecalho = elemento("div", undefined, "cabecalho-pagina");
  cabecalho.append(elemento("p", "CADASTRO", "sobretitulo"), elemento("h1", "Doadores"));
  cabecalho.append(elemento("p", "Cadastre e mantenha os contatos de quem apoia a ONG."));
  const layout = elemento("div", undefined, "layout-doadores");
  const secaoFormulario = elemento("section", undefined, "painel formulario-painel");
  secaoFormulario.append(elemento("h2", "Cadastrar doador"));
  const form = document.createElement("form");
  form.id = "form-doador";
  const nome = criarCampo({
    id: "nome",
    label: "Nome completo",
    name: "nome",
    required: true,
    maxlength: 150,
    autocomplete: "name",
  });
  const email = criarCampo({
    id: "email",
    label: "E-mail (opcional)",
    name: "email",
    type: "email",
    maxlength: 100,
    autocomplete: "email",
  });
  const telefone = criarCampo({
    id: "telefone",
    label: "Telefone (opcional)",
    name: "telefone",
    type: "tel",
    maxlength: 20,
    autocomplete: "tel",
  });
  const avisoForm = elemento("p", "", "mensagem");
  avisoForm.setAttribute("aria-live", "polite");
  const salvar = elemento("button", "Cadastrar doador", "botao botao-principal");
  salvar.type = "submit";
  form.append(nome.grupo, email.grupo, telefone.grupo, avisoForm, salvar);
  secaoFormulario.append(form);

  const secaoLista = elemento("section", undefined, "painel");
  const tituloLista = elemento("h2", "Pessoas cadastradas");
  const mensagem = elemento("p", "Carregando doadores...", "mensagem");
  mensagem.setAttribute("role", "status");
  const lista = elemento("div", undefined, "lista-doadores");
  secaoLista.append(tituloLista, mensagem, lista);
  layout.append(secaoFormulario, secaoLista);
  container.append(cabecalho, layout);

  let doadores = [];
  let editando = null;
  const cancelar = elemento("button", "Cancelar edição", "botao botao-secundario botao-cancelar");
  cancelar.type = "button";
  cancelar.hidden = true;
  cancelar.addEventListener("click", limparFormulario);
  async function carregar() {
    definirMensagem(mensagem, "Carregando doadores...");
    try {
      doadores = await api.listarDoadores();
      desenharLista();
    } catch (erro) {
      definirMensagem(mensagem, erro.message, "erro");
    }
  }

  function desenharLista() {
    lista.replaceChildren();
    if (doadores.length === 0) {
      definirMensagem(mensagem, "Nenhum doador cadastrado ainda.");
      return;
    }
    mensagem.replaceChildren();
    for (const doador of doadores) {
      const cartao = elemento("article", undefined, "cartao cartao-doador");
      const dados = elemento("div");
      dados.append(elemento("h3", doador.nome));
      dados.append(elemento("p", doador.email || "Sem e-mail informado"));
      dados.append(elemento("p", doador.telefone || "Sem telefone informado"));
      if (doador.data_cadastro) {
        const cadastro = elemento(
          "p",
          `Desde ${formatarData(doador.data_cadastro)}`,
          "texto-secundario",
        );
        dados.append(cadastro);
      }
      const acoes = elemento("div", undefined, "acoes-cartao");
      const editar = elemento("button", "Editar", "botao botao-secundario");
      editar.type = "button";
      editar.addEventListener("click", () => iniciarEdicao(doador));
      const excluir = elemento("button", "Excluir", "botao botao-perigo");
      excluir.type = "button";
      excluir.addEventListener("click", async () => {
        if (!window.confirm(`Excluir o cadastro de ${doador.nome}?`)) return;
        excluir.disabled = true;
        try {
          await api.excluirDoador(doador.id_doador);
          if (editando === doador.id_doador) limparFormulario();
          await carregar();
        } catch (erro) {
          definirMensagem(mensagem, erro.message, "erro");
          excluir.disabled = false;
        }
      });
      acoes.append(editar, excluir);
      cartao.append(dados, acoes);
      lista.append(cartao);
    }
  }

  function iniciarEdicao(doador) {
    editando = doador.id_doador;
    nome.input.value = doador.nome;
    email.input.value = doador.email || "";
    telefone.input.value = doador.telefone || "";
    salvar.textContent = "Salvar alterações";
    cancelar.hidden = false;
    definirMensagem(avisoForm, `Editando ${doador.nome}`);
    nome.input.focus();
  }

  function limparFormulario() {
    editando = null;
    form.reset();
    salvar.textContent = "Cadastrar doador";
    cancelar.hidden = true;
    avisoForm.replaceChildren();
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nomeNormalizado = nome.input.value.trim();
    if (!nomeNormalizado) {
      definirMensagem(avisoForm, "Informe o nome do doador antes de continuar.", "erro");
      nome.input.focus();
      return;
    }

    salvar.disabled = true;
    const estavaEditando = editando !== null;
    salvar.textContent = editando ? "Salvando..." : "Cadastrando...";
    try {
      const dados = {
        nome: nomeNormalizado,
        email: email.input.value.trim() || null,
        telefone: telefone.input.value.trim() || null,
      };
      if (editando) await api.atualizarDoador(editando, dados);
      else await api.criarDoador(dados);
      limparFormulario();
      await carregar();
      definirMensagem(
        avisoForm,
        estavaEditando
          ? "Cadastro atualizado com sucesso."
          : `${nomeNormalizado} foi cadastrado com sucesso.`,
        "sucesso",
      );
    } catch (erro) {
      definirMensagem(avisoForm, erro.message, "erro");
    } finally {
      salvar.disabled = false;
      salvar.textContent = editando ? "Salvar alterações" : "Cadastrar doador";
    }
  });

  form.append(cancelar);
  await carregar();
}
