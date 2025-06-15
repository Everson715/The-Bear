const apiBase = "http://localhost:3000/api/missions";

async function completeMission(userId, missionId) {
  try {
    await fetch(`${apiBase}/${userId}/${missionId}/complete`, { method: "PUT" });
    await loadMissions(userId);
  } catch {
    alert("Erro ao concluir missão.");
  }
}

async function loadMissions(userId) {
  if (!userId) {
    alert("Informe o ID do usuário para carregar as missões.");
    return;
  }
  
  try {
    const res = await fetch(`${apiBase}/${userId}`);
    if (!res.ok) throw new Error("Falha ao carregar missões.");
    
    const missions = await res.json();
    const list = document.getElementById("missionsList");
    list.innerHTML = "";

    missions.forEach(m => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${m.title || m.name} - ${m.completed ? "✅ Concluída" : "🕒 Pendente"}
        ${!m.completed ? `<button onclick="completeMission('${userId}', ${m.id})">Concluir</button>` : ""}
      `;
      list.appendChild(li);
    });
  } catch (e) {
    alert(e.message);
  }
}

// Função para buscar o userId do input e carregar missões
function carregarMissoes() {
  const userId = document.getElementById("userId").value.trim();
  loadMissions(userId);
}
