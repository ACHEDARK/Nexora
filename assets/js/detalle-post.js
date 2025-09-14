import { agregarComentario } from "../services/database.js";

document.addEventListener("DOMContentLoaded", () => {
    const post = JSON.parse(localStorage.getItem('postSeleccionado'));
    if (!post) return console.error("No se encontró el post en localStorage");

    // Imagen principal
    const imagenPrincipal = document.querySelector('main > img');
    if (imagenPrincipal) {
        imagenPrincipal.src = post.urlFoto;
        imagenPrincipal.alt = post.categoria;
    }

    // Contenido del artículo
    const articulo = document.querySelector('article.prose');
    articulo.innerHTML = `
                <h1 class="text-4xl font-extrabold text-[#16194a] mb-3">${post.titulo}</h1>
                <div class="flex items-center text-gray-600 space-x-4 mb-4">
                    <span>✍️ ${post.autor}</span>
                    <span>📅 ${post.fecha}</span>
                    <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">${post.categoria}</span>
                </div>
                <p>${post.contenido}</p>
            `;

    // Comentarios
    const comentariosContainer = document.getElementById('comentarios-container');
    const comentarioForm = document.getElementById('comentario-form');
    const mensajeInput = document.getElementById('mensaje-comentario');
    const nombreInput = document.getElementById('nombre-comentario');
    const anonimoCheckbox = document.getElementById('anonimo-comentario');

    // Inicializar comentarios
    post.comentarios = post.comentarios || [];
    post.comentarios.forEach(renderComentario);

    function renderComentario(comentario) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow p-4 mb-4';
        div.innerHTML = `
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="font-semibold">${comentario.author}</span>
                        <span class="text-gray-500 text-sm">${comentario.fecha}</span>
                    </div>
                    <p class="text-gray-700">${comentario.mensaje}</p>
                `;
        comentariosContainer.appendChild(div);
    }

    // Enviar nuevo comentario
    comentarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mensaje = mensajeInput.value.trim();
        if (!mensaje) return alert("El mensaje no puede estar vacío");

        const autor = anonimoCheckbox.checked || !nombreInput.value.trim()
            ? "Anónimo"
            : nombreInput.value.trim();

        const nuevoComentario = {
            author: autor,
            mensaje,
            fecha: new Date().toLocaleString()
        };

        console.log("Form:", comentarioForm);
        console.log("Post ID:", post.id);

        post.comentarios.push(nuevoComentario);
        await agregarComentario(post.id, nuevoComentario);
        renderComentario(nuevoComentario);

        mensajeInput.value = "";
        nombreInput.value = "";
        anonimoCheckbox.checked = false;

        localStorage.setItem('postSeleccionado', JSON.stringify(post));
    });
});