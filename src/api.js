const ROTAS = {
  doadores: "/api/doadores",
  itens: "/api/itens",
  doacoes: "/api/doacoes",
};

async function requisitar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(caminho, {
      ...opcoes,
      headers: {
        ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique se a API está rodando.");
  }

  if (resposta.status === 204) return null;

  const tipo = resposta.headers.get("Content-Type") ?? "";
  const dados = tipo.includes("application/json") ? await resposta.json() : null;
  if (!resposta.ok) {
    throw new Error(dados?.erro || "Não foi possível concluir a operação.");
  }
  return dados;
}

export const api = {
  listarDoadores: () => requisitar(ROTAS.doadores),
  criarDoador: (dados) =>
    requisitar(ROTAS.doadores, { method: "POST", body: JSON.stringify(dados) }),
  atualizarDoador: (id, dados) =>
    requisitar(`${ROTAS.doadores}/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  excluirDoador: (id) => requisitar(`${ROTAS.doadores}/${id}`, { method: "DELETE" }),
  listarItens: () => requisitar(ROTAS.itens),
  listarDoacoes: () => requisitar(ROTAS.doacoes),
  criarDoacao: (dados) =>
    requisitar(ROTAS.doacoes, { method: "POST", body: JSON.stringify(dados) }),
};
