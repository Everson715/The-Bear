const api = "http://localhost:3000/missions";

async function completeMission(id) {
  await fetch(`${api}/${id}/complete`, { method: "PUT" });
  loadMissions();
}

async function loadMissions() {
  const res = await fetch(api);
  const missions = await res.json();
  const list = document.getElementById("mission-list");
  list.innerHTML = "";
  missions.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${m.name} - ${m.completed ? "✅ Concluída" : "🕒 Pendente"}
      ${!m.completed ? `<button onclick="completeMission(${m.id})">Concluir</button>` : ""}
    `;
    list.appendChild(li);
  });
}

loadMissions();
