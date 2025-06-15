const api = "http://localhost:3000/api/purchases";

const form = document.getElementById("purchaseForm");
const purchaseList = document.getElementById("purchase-list");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = form.userId.value.trim();
  const menuItemId = form.menuItemId.value.trim();
  const quantity = parseInt(form.quantity.value.trim());

  if (!userId || !menuItemId || !quantity || quantity < 1) {
    resultDiv.textContent = "Preencha todos os campos corretamente.";
    return;
  }

  try {
    // Enviar a compra para o backend
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, menuItemId: Number(menuItemId), quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao registrar compra.");
    }

    resultDiv.textContent = `Compra registrada com sucesso! ID: ${data.id || 'N/A'}`;

    form.reset();
    loadPurchases();

  } catch (error) {
    resultDiv.textContent = `Erro: ${error.message}`;
  }
});

async function loadPurchases() {
  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error("Falha ao carregar compras.");
    const purchases = await res.json();

    purchaseList.innerHTML = "";

    if (purchases.length === 0) {
      purchaseList.textContent = "Nenhuma compra registrada.";
      return;
    }

    purchases.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `Usuário: ${p.userId} | Item: ${p.menuItemId} | Quantidade: ${p.quantity}`;
      purchaseList.appendChild(li);
    });
  } catch (error) {
    purchaseList.textContent = `Erro: ${error.message}`;
  }
}

// Carrega a lista de compras ao abrir a página
loadPurchases();
