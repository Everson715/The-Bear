// frontend/scripts/admin-missions.js

const API_BASE_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");
const isAdmin = localStorage.getItem("isAdmin") === "true";

const missionForm = document.getElementById('mission-form');
const missionIdInput = document.getElementById('missionId');
const missionFormSubmitBtn = document.getElementById('missionFormSubmitBtn');
const missionFormClearBtn = document.getElementById('missionFormClearBtn');
const missionList = document.getElementById('mission-list');
const missionCategorySelect = document.getElementById('missionCategory');

// Definir as categorias de missão fixas
const MISSION_CATEGORIES = [
    "Diária",
    "Semanal",
    "Mensal",
    "Evento Especial"
];

// Redireciona para login se não for admin ou não houver token
if (!isAdmin || !token) {
    alert("Acesso negado. Você precisa ser um administrador para acessar esta página.");
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("current-year").textContent = new Date().getFullYear();
    populateMissionCategoriesDropdown();
    fetchMissions();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

// Função para preencher o dropdown de categorias de missão
function populateMissionCategoriesDropdown() {
    missionCategorySelect.innerHTML = '<option value="">Selecione uma categoria de missão</option>'; // Reset e valor padrão
    MISSION_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        missionCategorySelect.appendChild(option);
    });
}

async function handleApiResponse(response) {
    const contentType = response.headers.get("content-type");
    if (response.ok) {
        return contentType && contentType.includes("application/json") ? await response.json() : {};
    } else {
        let errorData = { message: "Ocorreu um erro no servidor." };
        if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
        } else {
            errorData.message = await response.text();
        }
        throw new Error(errorData.message || "Erro desconhecido da API.");
    }
}

// --- CRUD Missions ---

// Fetch (Read) Missions
async function fetchMissions() {
    try {
        const res = await fetch(`${API_BASE_URL}/missions`, { // Assumindo /api/missions
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const missions = await handleApiResponse(res);
        displayMissions(missions);
    } catch (error) {
        console.error("Erro ao carregar missões:", error);
        missionList.innerHTML = `<p class="error-message">Erro ao carregar missões: ${error.message}</p>`;
    }
}

function displayMissions(missions) {
    missionList.innerHTML = '';
    if (!Array.isArray(missions) || missions.length === 0) {
        missionList.innerHTML = '<p>Nenhuma missão cadastrada ainda.</p>';
        return;
    }
    missions.forEach(mission => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${mission.title}</strong> (${mission.category})
            <br>Categorias Necessárias: ${mission.requiredCategories ? mission.requiredCategories.join(', ') : 'Nenhuma'}</span>
            <div>
                <button class="edit-btn" data-id="${mission.id}">Editar</button>
                <button class="delete-btn" data-id="${mission.id}">Excluir</button>
            </div>
        `;
        missionList.appendChild(li);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => editMission(e.target.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteMission(e.target.dataset.id));
    });
}

// Create/Update Mission
missionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = missionIdInput.value;
    const isEditing = !!id;

    const formData = new FormData(missionForm);
    const data = Object.fromEntries(formData.entries());

    // Processar requiredCategories: string separada por vírgula para array de strings
    data.requiredCategories = data.requiredCategories
        ? data.requiredCategories.split(',').map(cat => cat.trim()).filter(cat => cat !== '')
        : [];

    try {
        let res;
        if (isEditing) {
            res = await fetch(`${API_BASE_URL}/missions/${id}`, { // Assumindo PUT /api/missions/:id
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        } else {
            res = await fetch(`${API_BASE_URL}/missions`, { // Assumindo POST /api/missions
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        }

        await handleApiResponse(res);
        alert(`Missão ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
        missionForm.reset();
        missionIdInput.value = '';
        missionFormSubmitBtn.textContent = 'Criar Missão';
        missionFormClearBtn.style.display = 'none';
        populateMissionCategoriesDropdown(); // Reset dropdown
        fetchMissions();
    } catch (error) {
        console.error("Erro ao salvar missão:", error);
        alert(`Erro ao salvar missão: ${error.message}`);
    }
});

// Edit Mission (Populate form)
async function editMission(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/missions/${id}`, { // Assumindo GET /api/missions/:id
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const mission = await handleApiResponse(res);

        missionIdInput.value = mission.id;
        missionForm.querySelector('[name="title"]').value = mission.title;
        missionForm.querySelector('[name="description"]').value = mission.description || '';
        missionCategorySelect.value = mission.category; // Set dropdown value
        // Convert array of categories back to comma-separated string for the input field
        missionForm.querySelector('[name="requiredCategories"]').value = Array.isArray(mission.requiredCategories)
            ? mission.requiredCategories.join(', ')
            : '';

        missionFormSubmitBtn.textContent = 'Salvar Alterações';
        missionFormClearBtn.style.display = 'inline-block';
    } catch (error) {
        console.error("Erro ao carregar missão para edição:", error);
        alert(`Erro ao carregar missão para edição: ${error.message}`);
    }
}

// Clear Form / Cancel Edit
missionFormClearBtn.addEventListener('click', () => {
    missionForm.reset();
    missionIdInput.value = '';
    missionFormSubmitBtn.textContent = 'Criar Missão';
    missionFormClearBtn.style.display = 'none';
    populateMissionCategoriesDropdown(); // Reset dropdown
});

// Delete Mission
async function deleteMission(id) {
    if (!confirm('Tem certeza que deseja excluir esta missão?')) {
        return;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/missions/${id}`, { // Assumindo DELETE /api/missions/:id
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await handleApiResponse(res);
        alert('Missão excluída com sucesso!');
        fetchMissions();
    } catch (error) {
        console.error("Erro ao excluir missão:", error);
        alert(`Erro ao excluir missão: ${error.message}`);
    }
}