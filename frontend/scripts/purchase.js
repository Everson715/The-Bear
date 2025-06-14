const api = "http://localhost:3000/purchase";

document.getElementById("purchase-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const menuItemId = parseInt(document.getElementById("menuItemId").value);
  const quantity = parseInt(document.getElementById("quantity").value);

  await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuItemId, quantity })
  });

  e.target.reset();
  loadPurchases();
});

async function loadPurchases() {
  const res = await fetch(api);
  const purchases = await res.json();
  const list = document.getElementById("purchase-list");
  list.innerHTML = "";
  purchases.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `Item ${p.menuItemId} - Qtd: ${p.quantity}`;
    list.appendChild(li);
  });
}

loadPurchases();
