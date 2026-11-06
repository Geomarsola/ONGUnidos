const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;
export function validarDoador(dados = {}) {
  const { nome, email, telefone } = dados;
  if (typeof nome !== "string" || nome.trim() === "") {
    return "Nome é obrigatório";
  }
  if (nome.length > 150) {
    return "Nome deve ter no máximo 150 caracteres";
  }
  if (email && !FORMATO_EMAIL.test(email)) {
    return "E-mail inválido";
  }
  if (telefone && String(telefone).length > 20) {
    return "Telefone deve ter no máximo 20 caracteres";
  }
  return null;
}
export function validarDoacao(dados = {}) {
  const { id_doador, data_doacao, itens } = dados;
  if (!Number.isInteger(id_doador)) {
    return "id_doador é obrigatório e deve ser um número inteiro";
  }
  if (!FORMATO_DATA.test(data_doacao ?? "")) {
    return "data_doacao deve estar no formato AAAA-MM-DD";
  }
  if (!Array.isArray(itens) || itens.length === 0) {
    return "Informe pelo menos um item";
  }
  for (const item of itens) {
    if (!Number.isInteger(item.id_item)) {
      return "Cada item precisa de um id_item inteiro";
    }
    if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
      return "A quantidade de cada item deve ser um inteiro maior que zero";
    }
  }
  const ids = itens.map((item) => item.id_item);
  if (new Set(ids).size !== ids.length) {
    return "O mesmo item aparece mais de uma vez";
  }
  return null;
}
