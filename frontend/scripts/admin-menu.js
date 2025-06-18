// frontend/scripts/admin-menu.js

const API_BASE_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");
const isAdmin = localStorage.getItem("isAdmin") === "true";

const menuForm = document.getElementById('menu-form');
const menuItemIdInput = document.getElementById('menuItemId');
const menuFormSubmitBtn = document.getElementById('menuFormSubmitBtn');
const menuFormClearBtn = document.getElementById('menuFormClearBtn');
const menuList = document.getElementById('menu-list');
const categorySelect = document.getElementById('category');

// Definir as categorias fixas
const MENU_CATEGORIES = [
    "Bebidas com Café",
    "Sobremesas",
    "Pratos Salgados",
    "Chás"
];

// Redireciona para login se não for admin ou não houver token
if (!isAdmin || !token) {
    alert("Acesso negado. Você precisa ser um administrador para acessar esta página.");
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("current-year").textContent = new Date().getFullYear();
    populateCategoriesDropdown();
    fetchMenuItems();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

// Função para preencher o dropdown de categorias
function populateCategoriesDropdown() {
    categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>'; // Reset e valor padrão
    MENU_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
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

// --- CRUD Menu Items ---

// Fetch (Read) Menu Items
async function fetchMenuItems() {
    try {
        const res = await fetch(`${API_BASE_URL}/menu`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const menuItems = await handleApiResponse(res);
        displayMenuItems(menuItems);
    } catch (error) {
        console.error("Erro ao carregar itens do menu:", error);
        menuList.innerHTML = `<p class="error-message">Erro ao carregar o menu: ${error.message}</p>`;
    }
}

function displayMenuItems(items) {
    menuList.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        menuList.innerHTML = '<p>Nenhum item no menu ainda.</p>';
        return;
    }
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${item.name}</strong> - R$ ${item.price.toFixed(2)} (${item.category})
            <br>XP: ${item.xpGain || 0} | Grãos: ${item.coffeeBeansGain || 0}</span>
            <div>
                <button class="edit-btn" data-id="${item.id}">Editar</button>
                <button class="delete-btn" data-id="${item.id}">Excluir</button>
            </div>
        `;
        menuList.appendChild(li);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => editMenuItem(e.target.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteMenuItem(e.target.dataset.id));
    });
}

// Create/Update Menu Item
menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = menuItemIdInput.value;
    const isEditing = !!id;

    const formData = new FormData(menuForm);
    const data = Object.fromEntries(formData.entries());

    // Convert numbers
    data.price = parseFloat(data.price);
    data.xpGain = parseInt(data.xpGain, 10);
    data.coffeeBeansGain = parseInt(data.coffeeBeansGain, 10);

    try {
        let res;
        if (isEditing) {
            res = await fetch(`${API_BASE_URL}/menu/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        } else {
            res = await fetch(`${API_BASE_URL}/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        }

        await handleApiResponse(res);
        alert(`Item do menu ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        menuForm.reset();
        menuItemIdInput.value = '';
        menuFormSubmitBtn.textContent = 'Criar Item';
        menuFormClearBtn.style.display = 'none';
        fetchMenuItems();
    } catch (error) {
        console.error("Erro ao salvar item do menu:", error);
        alert(`Erro ao salvar item do menu: ${error.message}`);
    }
});

// Edit Menu Item (Populate form)
async function editMenuItem(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const item = await handleApiResponse(res);

        menuItemIdInput.value = item.id;
        menuForm.querySelector('[name="name"]').value = item.name;
        categorySelect.value = item.category; // Set dropdown value
        menuForm.querySelector('[name="price"]').value = item.price;
        menuForm.querySelector('[name="imageUrl"]').value = item.imageUrl || '';
        menuForm.querySelector('[name="description"]').value = item.description || '';
        menuForm.querySelector('[name="xpGain"]').value = item.xpGain || 0;
        menuForm.querySelector('[name="coffeeBeansGain"]').value = item.coffeeBeansGain || 0;

        menuFormSubmitBtn.textContent = 'Salvar Alterações';
        menuFormClearBtn.style.display = 'inline-block';
    } catch (error) {
        console.error("Erro ao carregar item para edição:", error);
        alert(`Erro ao carregar item para edição: ${error.message}`);
    }
}

// Clear Form / Cancel Edit
menuFormClearBtn.addEventListener('click', () => {
    menuForm.reset();
    menuItemIdInput.value = '';
    menuFormSubmitBtn.textContent = 'Criar Item';
    menuFormClearBtn.style.display = 'none';
    populateCategoriesDropdown(); // Reset dropdown to default selection
});

// Delete Menu Item
async function deleteMenuItem(id) {
    if (!confirm('Tem certeza que deseja excluir este item do menu?')) {
        return;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await handleApiResponse(res);
        alert('Item do menu excluído com sucesso!');
        fetchMenuItems();
    } catch (error) {
        console.error("Erro ao excluir item do menu:", error);
        alert(`Erro ao excluir item do menu: ${error.message}`);
    }
}