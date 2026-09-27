const onRequest = require("firebase-functions/https").onRequest;

exports.testeMercadoPago = onRequest(async (req, res) => {
  try {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const planId = process.env.MERCADO_PAGO_PLAN_ID;

    const resposta = await fetch(
        `https://api.mercadopago.com/preapproval_plan/${planId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        },
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro Mercado Pago:", resposta.status, dados);

      res.status(resposta.status).json({
        sucesso: false,
        mensagem: "Mercado Pago recusou a consulta.",
        status: resposta.status,
      });

      return;
    }

    res.status(200).json({
      sucesso: true,
      id: dados.id,
      nome: dados.reason,
      valor: dados.auto_recurring?.transaction_amount,
      moeda: dados.auto_recurring?.currency_id,
      status: dados.status,
    });
  } catch (erro) {
    console.error("Erro ao consultar Mercado Pago:", erro);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao comunicar com Mercado Pago.",
    });
  }
});
