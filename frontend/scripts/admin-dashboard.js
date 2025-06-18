// frontend/scripts/admin-dashboard.js (Should be the same as previously provided)
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("current-year").textContent = new Date().getFullYear();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token || !isAdmin) {
        alert("Acesso negado. Você precisa ser um administrador e estar logado.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
    });

    const API_BASE_URL = "http://localhost:3000/api";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    // --- VARIÁVEIS DA NAVEGAÇÃO ---
    const navMenuItemsBtn = document.getElementById("nav-menu-items");
    const navMissionsBtn = document.getElementById("nav-missions");
    const menuItemsSectionContainer = document.getElementById("menu-items-section-container");
    const missionsSectionContainer = document.getElementById("missions-section-container");

    // Função para mostrar a seção e atualizar o estado ativo da navegação
    function showSection(sectionToShowElement, activeNavLink) {
        // Esconde todas as seções de feature
        document.querySelectorAll('.admin-feature-section').forEach(section => {
            section.style.display = 'none';
        });
        // Remove a classe 'active' de todos os links de navegação
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });

        // Mostra a seção desejada
        if (sectionToShowElement) {
            sectionToShowElement.style.display = 'block';
        }

        // Adiciona a classe 'active' ao link de navegação correspondente
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }

    // Event Listeners para a navegação
    if (navMenuItemsBtn) {
        navMenuItemsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(menuItemsSectionContainer, navMenuItemsBtn);
        });
    }

    if (navMissionsBtn) {
        e.preventDefault(); // Moved inside the listener to prevent default action only when clicked
        navMissionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(missionsSectionContainer, navMissionsBtn);
        });
    }

    // --- VARIÁVEIS DO FORMULÁRIO DE ITENS DE MENU ---
    const menuForm = document.getElementById("menu-form");
    const menuItemIdInput = document.getElementById("menuItemId");
    const menuFormSubmitBtn = document.getElementById("menuFormSubmitBtn");
    const menuFormClearBtn = document.getElementById("menuFormClearBtn");
    const menuList = document.getElementById("menu-list");
    const categorySelect = document.getElementById('category');

    // --- VARIÁVEIS DO FORMULÁRIO DE MISSÕES ---
    const missionForm = document.getElementById("mission-form");
    const missionIdInput = document.getElementById("missionId");
    const missionFormSubmitBtn = document.getElementById("missionFormSubmitBtn");
    const missionFormClearBtn = document.getElementById("missionFormClearBtn");
    const missionList = document.getElementById("mission-list");

    // --- FUNÇÕES GERAIS DE API ---
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro na requisição: ${response.status} ${response.statusText}`);
            }
            if (response.status === 204) return null;
            return await response.json();
        } catch (error) {
            console.error("Erro na API:", error);
            alert(`Erro na comunicação com o servidor: ${error.message}`);
            throw error;
        }
    }

    // --- FUNÇÕES DE GERENCIAMENTO DE ITENS DE MENU ---

    async function loadCategories() {
        try {
            const categories = await fetchData(`${API_BASE_URL}/menu/categories`);
            categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } catch (err) {
            console.error("Falha ao carregar categorias:", err);
            const defaultCategories = ["Bebidas com café", "Chás", "Pratos Salgados", "Sobremesas"];
            categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';
            defaultCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
    }

    menuForm.addEventListener("submit", async e => {
        e.preventDefault();
        const id = menuItemIdInput.value;
        const data = {
            name: menuForm.name.value,
            category: menuForm.category.value,
            price: parseFloat(menuForm.price.value),
            imageUrl: menuForm.imageUrl.value || 'https://via.placeholder.com/100x100?text=Novo+Item',
            description: menuForm.description.value,
            xpGain: parseInt(menuForm.xpGain.value) || 0,
            coffeeBeansGain: parseInt(menuForm.coffeeBeansGain.value) || 0
        };

        try {
            if (id) {
                await fetchData(`${API_BASE_URL}/menu/${id}`, { method: "PUT", body: JSON.stringify(data) });
                alert('Item atualizado com sucesso!');
            } else {
                await fetchData(`${API_BASE_URL}/menu`, { method: "POST", body: JSON.stringify(data) });
                alert('Item adicionado com sucesso!');
            }
            menuForm.reset();
            menuItemIdInput.value = '';
            menuFormSubmitBtn.textContent = 'Criar Item';
            menuFormClearBtn.style.display = 'none';
            loadMenuItems();
        } catch (err) {
            console.error("Erro ao salvar item:", err);
        }
    });

    async function loadMenuItems() {
        try {
            const items = await fetchData(`${API_BASE_URL}/menu`);
            menuList.innerHTML = "";
            if (items.length === 0) {
                menuList.innerHTML = '<p class="no-items-message">Nenhum item no menu ainda. Adicione um!</p>';
                return;
            }
            items.forEach(item => {
                const li = document.createElement("li");
                li.className = 'admin-menu-item';
                li.innerHTML = `
                <img src="${item.imageUrl || 'https://via.placeholder.com/100x100?text=Sem+Imagem'}" alt="${item.name}" />
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Categoria: <strong>${item.category || 'N/A'}</strong></p>
                    <p>Preço: <span>R$ ${item.price.toFixed(2)}</span></p>
                    <p>XP Ganho: <span>${item.xpGain || 0}</span></p>
                    <p>Grãos de Café Ganhos: <span>${item.coffeeBeansGain || 0}</span></p>
                    <p class="description">${item.description || 'Sem descrição.'}</p>
                    <div class="item-actions">
                        <button onclick="editMenuItem(${item.id})" class="btn-secondary edit-btn">Editar</button>
                        <button onclick="deleteMenuItem(${item.id})" class="btn-secondary delete-btn">Excluir</button>
                    </div>
                </div>
                `;
                menuList.appendChild(li);
            });
        } catch (err) {
            console.error("Erro ao carregar menu:", err);
            menuList.innerHTML = `<p class="error-message">Não foi possível carregar os itens do menu. ${err.message || ''} Verifique a conexão com a API e as permissões.</p>`;
        }
    }

    window.editMenuItem = async (id) => {
        try {
            const item = await fetchData(`${API_BASE_URL}/menu/${id}`);
            if (item) {
                menuItemIdInput.value = item.id;
                menuForm.name.value = item.name;
                menuForm.category.value = item.category;
                menuForm.price.value = item.price;
                menuForm.imageUrl.value = item.imageUrl || '';
                menuForm.description.value = item.description || '';
                menuForm.xpGain.value = item.xpGain || 0;
                menuForm.coffeeBeansGain.value = item.coffeeBeansGain || 0;

                menuFormSubmitBtn.textContent = 'Atualizar Item';
                menuFormClearBtn.style.display = 'inline-block';
            }
        } catch (err) {
            console.error("Erro ao carregar item para edição:", err);
        }
    };

    menuFormClearBtn.addEventListener('click', () => {
        menuForm.reset();
        menuItemIdInput.value = '';
        menuFormSubmitBtn.textContent = 'Criar Item';
        menuFormClearBtn.style.display = 'none';
    });

    window.deleteMenuItem = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) {
            return;
        }
        try {
            await fetchData(`${API_BASE_URL}/menu/${id}`, { method: "DELETE" });
            alert('Item excluído com sucesso!');
            loadMenuItems();
        } catch (err) {
            console.error("Erro ao excluir item:", err);
        }
    };

    // --- FUNÇÕES DE GERENCIAMENTO DE MISSÕES ---

    async function loadMissions() {
        try {
            const missions = await fetchData(`${API_BASE_URL}/missions`);
            missionList.innerHTML = "";
            if (missions.length === 0) {
                missionList.innerHTML = '<p class="no-items-message">Nenhuma missão configurada ainda. Adicione uma!</p>';
                return;
            }
            missions.forEach(mission => {
                const li = document.createElement("li");
                li.className = 'admin-mission-item';
                li.innerHTML = `
                    <div class="mission-details">
                        <h4>${mission.title}</h4>
                        <p>Categoria: <strong>${mission.category}</strong></p>
                        <p class="description">${mission.description || 'Sem descrição.'}</p>
                        <p>Categorias Necessárias: <strong>${mission.requiredCategories || 'N/A'}</strong></p>
                        <div class="mission-actions">
                            <button onclick="editMission(${mission.id})" class="btn-secondary edit-btn">Editar</button>
                            <button onclick="deleteMission(${mission.id})" class="btn-secondary delete-btn">Excluir</button>
                        </div>
                    </div>
                `;
                missionList.appendChild(li);
            });
        } catch (err) {
            console.error("Erro ao carregar missões:", err);
            missionList.innerHTML = `<p class="error-message">Não foi possível carregar as missões. ${err.message || ''} Verifique a conexão com a API e as permissões.</p>`;
        }
    }

    missionForm.addEventListener("submit", async e => {
        e.preventDefault();
        const id = missionIdInput.value;
        const data = {
            title: missionForm.title.value,
            description: missionForm.description.value,
            category: missionForm.category.value,
            requiredCategories: missionForm.requiredCategories.value || null
        };

        try {
            if (id) {
                await fetchData(`${API_BASE_URL}/missions/${id}`, { method: "PUT", body: JSON.stringify(data) });
                alert('Missão atualizada com sucesso!');
            } else {
                await fetchData(`${API_BASE_URL}/missions`, { method: "POST", body: JSON.stringify(data) });
                alert('Missão adicionada com sucesso!');
            }
            missionForm.reset();
            missionIdInput.value = '';
            missionFormSubmitBtn.textContent = 'Criar Missão';
            missionFormClearBtn.style.display = 'none';
            loadMissions();
        } catch (err) {
            console.error("Erro ao salvar missão:", err);
        }
    });

    window.editMission = async (id) => {
        try {
            const mission = await fetchData(`${API_BASE_URL}/missions/${id}`);
            if (mission) {
                missionIdInput.value = mission.id;
                missionForm.title.value = mission.title;
                missionForm.description.value = mission.description || '';
                missionForm.category.value = mission.category;
                missionForm.requiredCategories.value = mission.requiredCategories || '';

                missionFormSubmitBtn.textContent = 'Atualizar Missão';
                missionFormClearBtn.style.display = 'inline-block';
            }
        } catch (err) {
            console.error("Erro ao carregar missão para edição:", err);
        }
    };

    missionFormClearBtn.addEventListener('click', () => {
        missionForm.reset();
        missionIdInput.value = '';
        missionFormSubmitBtn.textContent = 'Criar Missão';
        missionFormClearBtn.style.display = 'none';
    });

    window.deleteMission = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta missão?')) {
            return;
        }
        try {
            await fetchData(`${API_BASE_URL}/missions/${id}`, { method: "DELETE" });
            alert('Missão excluída com sucesso!');
            loadMissions();
        } catch (err) {
            console.error("Erro ao excluir missão:", err);
        }
    };

    // --- CARREGAMENTO INICIAL ---
    loadCategories();
    loadMenuItems();
    loadMissions();
    // Ensure both element and nav link are passed
    showSection(menuItemsSectionContainer, navMenuItemsBtn);
});