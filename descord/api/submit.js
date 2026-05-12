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
    const { name, email, message, images, pdfBase64 } = req.body || {};

    if (!name || !message || !pdfBase64) {
      res.status(400).json({ message: "Dados obrigatorios ausentes." });
      return;
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const formData = new FormData();

    const details = [
      `Nome: ${name}`,
      `E-mail: ${email || "Nao informado"}`,
      `Mensagem: ${message}`,
      `Imagens: ${Array.isArray(images) && images.length ? images.map((img) => img.name).join(", ") : "Nenhuma"}`,
    ].join("\n");

    formData.append("content", details);
    formData.append("file", new Blob([pdfBuffer], { type: "application/pdf" }), "relatorio.pdf");

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
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
