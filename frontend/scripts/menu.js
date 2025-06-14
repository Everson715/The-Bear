const api = "http://localhost:3000/menu";

document.getElementById("menu-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const price = parseFloat(document.getElementById("price").value);

  await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, category, price })
  });

  e.target.reset();
  loadMenu();
});

async function loadMenu() {
  const res = await fetch(api);
  const items = await res.json();
  const list = document.getElementById("menu-list");
  list.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.category}) - R$${item.price}`;
    list.appendChild(li);
  });
}

loadMenu();
