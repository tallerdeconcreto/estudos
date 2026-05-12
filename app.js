const BACKEND_URL = "https://estudos-psi-pearl.vercel.app/api/submit";

const form = document.getElementById("report-form");
const statusEl = document.getElementById("status");

const setStatus = (message) => {
  statusEl.textContent = message;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Enviando para o Discord...");

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name").toString().trim(),
    email: formData.get("email").toString().trim(),
    message: formData.get("message").toString().trim(),
  };

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        message: payload.message,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Falha ao enviar o PDF.");
    }

    setStatus("Enviado com sucesso.");
    form.reset();
  } catch (error) {
    setStatus(error.message);
  }
});
