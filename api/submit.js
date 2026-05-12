export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Metodo nao permitido." });
    return;
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(500).json({ message: "Webhook nao configurado." });
    return;
  }

  try {
    const { name, message } = req.body || {};

    if (!name || !message) {
      res.status(400).json({ message: "Dados obrigatorios ausentes." });
      return;
    }

    const content = `Nome: ${name}\nMensagem: ${message}`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(502).json({ message: `Falha no Discord: ${text}` });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Erro interno ao enviar." });
  }
}
