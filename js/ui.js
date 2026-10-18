// ===== TROCAR TELA =====
function trocarTela(id, el) {
  // esconder telas
  document.querySelectorAll(".tela").forEach((t) => (t.style.display = "none"));

  // mostrar tela selecionada
  document.getElementById(id).style.display = "block";
  // Atualiza navegação inferior
  document
    .querySelectorAll(".bottom-nav .nav-item")
    .forEach((b) => b.classList.remove("ativo"));

  const idNav = id === "gastos" ? "mais" : id;
  const botao = document.getElementById("nav-" + idNav);

  if (botao) {
    botao.classList.add("ativo");
  }

  // remover ativo
  document
    .querySelectorAll(".sidebar button")
    .forEach((b) => b.classList.remove("ativo"));

  // adiciona ativo
  const botaoSidebar = document.getElementById("btn-" + id);

  if (botaoSidebar) {
    botaoSidebar.classList.add("ativo");
  }
  // atualizar resumo
  if (id === "resumo") {
    atualizar();

    setTimeout(() => {
      atualizar();

      window.dispatchEvent(new Event("resize"));
    }, 150);
  }
  if (id === "diario") {
    atualizarMeuDia();
  }
}
window.atualizarStatusTeste = async function () {
  const elemento = document.getElementById("status-teste");

  if (!elemento) {
    return;
  }

  // Usuário Premium vê a confirmação do plano ativo
  const acessoPremium = await window.verificarAcessoUsuario();

  if (acessoPremium) {
    elemento.textContent =
      "💎 Plano Premium ativo — você tem acesso aos recursos Premium!";
    elemento.style.display = "block";
    elemento.style.color = "#16a34a";
    elemento.style.fontWeight = "bold";
    return;
  }

  elemento.style.display = "block";

  if (resultado.testeAtivo) {
    const textoDias =
      resultado.diasRestantes === 1
        ? "1 dia restante"
        : `${resultado.diasRestantes} dias restantes`;

    elemento.textContent = `🎁 Período de teste grátis — ${textoDias}`;
  } else {
    elemento.textContent = "⏰ Seu período de teste grátis terminou.";
  }
};
document.getElementById("btn-assinar")?.addEventListener("click", async () => {
  try {
    const token = await window.obterTokenFirebase();

    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const resposta = await fetch(
      "https://controle-motoristas-webhook.antoniojrlinhares.workers.dev/criar-assinatura",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
      console.error("Erro ao criar assinatura:", dados);
      alert("Não foi possível iniciar a assinatura.");
      return;
    }

    window.open(dados.init_point, "_blank");
  } catch (erro) {
    console.error("Erro:", erro);
    alert("Ocorreu um erro ao iniciar a assinatura.");
  }
});
window.trocarTela = trocarTela;
