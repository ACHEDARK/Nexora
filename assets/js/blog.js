import { DataBlog } from "../services/database.js";

// Variables globales
let posts = [];
let currentPage = 1;
const postsPerPage = 6;

const postsContainer = document.querySelector(".posts-container");
const paginationContainer = document.querySelector(".pagination-container");
const searchInput = document.querySelector('input[placeholder="Buscar artículos..."]');
const categorySelect = document.querySelector('select');
const spinner = postsContainer.querySelector(".spinner");

// --- Funciones principales ---
async function cargarPosts() {
    spinner.classList.remove("hidden");
    posts = await DataBlog();
    spinner.classList.add("hidden");

    populateCategories();
    renderPage(currentPage);
    renderPagination();
}

// Renderizar posts
function renderPage(page, postsToRender = posts) {
    if (!postsContainer) return;

    postsContainer.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pagePosts = postsToRender.slice(start, end);

    pagePosts.forEach(post => {
        const article = document.createElement("article");
        article.className = "bg-white rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition";
        article.innerHTML = `
            <img src="${post.urlFoto}" alt="${post.categoria}" class="h-48 w-full object-cover" />
            <div class="p-6 flex flex-col">
                <span class="text-xs font-semibold text-blue-600">${post.categoria}</span>
                <h3 class="font-bold text-xl mt-2 mb-3 text-[#16194a]">${post.titulo}</h3>
                <p class="text-gray-600 mb-4">${post.descripcion}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <span>📅 ${post.fecha}</span><span class="mx-2">•</span><span>✍️ ${post.autor}</span>
                </div>
                <a href="./post.html?id=${post.id}" class="mt-auto text-blue-500 font-semibold hover:underline">Leer más →</a>
            </div>
        `;
        article.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('postSeleccionado', JSON.stringify(post));
            window.location.href = `./post.html?id=${post.id}`;
        });
        postsContainer.appendChild(article);
    });
}

// Renderizar paginación
function renderPagination(postsToRender = posts) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(postsToRender.length / postsPerPage);

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.className = "px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage, postsToRender);
            renderPagination(postsToRender);
        }
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = `px-4 py-2 rounded-lg ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderPage(currentPage, postsToRender);
            renderPagination(postsToRender);
        });
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.className = "px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage, postsToRender);
            renderPagination(postsToRender);
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// Llenar categorías dinámicamente
function populateCategories() {
    const categories = Array.from(new Set(posts.map(post => post.categoria)));
    categories.forEach(cat => {
        if (!Array.from(categorySelect.options).some(opt => opt.value === cat)) {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        }
    });
}

// Filtrar posts por título y categoría
function filterPosts() {
    const query = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;

    let filteredPosts = posts.filter(post =>
        post.titulo.toLowerCase().includes(query)
    );

    if (selectedCategory !== "all") {
        filteredPosts = filteredPosts.filter(post => post.categoria === selectedCategory);
    }

    currentPage = 1;
    renderPage(currentPage, filteredPosts);
    renderPagination(filteredPosts);
}

// --- Eventos ---
searchInput.addEventListener("input", filterPosts);
categorySelect.addEventListener("change", filterPosts);

// --- Inicialización ---
cargarPosts();
