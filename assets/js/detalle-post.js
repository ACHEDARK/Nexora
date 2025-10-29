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
    
    // Procesar markdown y convertir a HTML profesional
    let contenidoHTML = post.contenido;
    
    // Limpiar símbolos de markdown sueltos y líneas vacías
    contenidoHTML = contenidoHTML.replace(/^#+\s*$/gm, ''); // Eliminar líneas que solo contengan #, ##, ###, etc.
    contenidoHTML = contenidoHTML.replace(/^\s*#+\s*$/gm, ''); // Eliminar líneas con espacios y solo #
    contenidoHTML = contenidoHTML.replace(/\n\s*\n\s*\n/g, '\n\n'); // Limpiar múltiples saltos de línea
    
    // Procesar títulos principales (##) - debe tener texto después
    contenidoHTML = contenidoHTML.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-[#16194a] mt-8 mb-4 pb-2 border-b border-gray-200">$1</h2>');
    
    // Procesar subtítulos (###) - debe tener texto después
    contenidoHTML = contenidoHTML.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold text-[#16194a] mt-6 mb-3">$1</h3>');
    
    // Procesar texto en negrita
    contenidoHTML = contenidoHTML.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
    
    // Procesar texto en negrita seguido de dos puntos (para casos como "**Marketing y Ventas**:")
    contenidoHTML = contenidoHTML.replace(/\*\*(.*?)\*\*:/g, '<strong class="font-semibold text-[#16194a] text-lg">$1:</strong>');
    
    // Procesar listas con viñetas - agrupar elementos consecutivos
    contenidoHTML = contenidoHTML.replace(/(^- .*(?:\n^- .*)*)/gm, (match) => {
        const items = match.split('\n').filter(item => item.trim().startsWith('- '));
        const listItems = items.map(item => {
            const text = item.replace(/^- /, '').trim();
            return `<li class="mb-2 text-gray-700 pl-2">${text}</li>`;
        }).join('');
        return `<ul class="list-none space-y-2 my-4 pl-6">${listItems}</ul>`;
    });
    
    // Limpiar líneas vacías múltiples
    contenidoHTML = contenidoHTML.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Dividir en párrafos y procesar saltos de línea
    let parrafos = contenidoHTML.split('\n\n');
    contenidoHTML = parrafos.map(parrafo => {
        parrafo = parrafo.trim();
        if (parrafo === '') return '';
        
        // Si ya es un título, lista o elemento HTML, no envolver en <p>
        if (parrafo.startsWith('<h') || parrafo.startsWith('<ul') || parrafo.startsWith('<li')) {
            return parrafo;
        }
        
        // Convertir saltos de línea simples a <br>
        parrafo = parrafo.replace(/\n/g, '<br>');
        
        return `<p class="mb-4 text-gray-700 leading-relaxed">${parrafo}</p>`;
    }).join('');
    
    // Agregar video tutorial si existe
    let videoHTML = '';
    if (post.videoTutorial && post.videoTutorial.trim() !== '') {
        // Extraer el ID del video de diferentes formatos de URL de YouTube
        let videoId = '';
        const url = post.videoTutorial;
        
        // Formato: https://youtu.be/VIDEO_ID
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        // Formato: https://www.youtube.com/watch?v=VIDEO_ID
        else if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        }
        // Formato: https://www.youtube.com/embed/VIDEO_ID
        else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        // Si solo es el ID
        else if (!url.includes('http')) {
            videoId = url;
        }
        
        if (videoId) {
            videoHTML = `
                <div class="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-lg">
                    <div class="text-center mb-6">
                        <h3 class="text-3xl font-bold text-[#16194a] mb-3">Tutorial en Video</h3>
                        <p class="text-gray-600 text-lg">Guía completa paso a paso sobre ${post.titulo}</p>
                    </div>
                    <div class="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style="padding-bottom: 56.25%;">
                        <iframe 
                            class="absolute top-0 left-0 w-full h-full"
                            src="https://www.youtube.com/embed/${videoId}"
                            title="Tutorial de ${post.titulo}"
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-600 italic">
                            <span class="inline-block mr-2"></span>
                            Video tutorial creado por el equipo de expertos de Nexora
                        </p>
                    </div>
                </div>
            `;
        }
    }
    
    articulo.innerHTML = `
                <h1 class="text-4xl font-extrabold text-[#16194a] mb-6 leading-tight">${post.titulo}</h1>
                <div class="flex items-center text-gray-600 space-x-6 mb-8 pb-6 border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-gray-500">Autor:</span>
                        <span class="text-sm font-semibold text-gray-700">${post.autor}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-gray-500">Fecha:</span>
                        <span class="text-sm font-semibold text-gray-700">${post.fecha}</span>
                    </div>
                    <span class="bg-[#16194a] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">${post.categoria}</span>
                </div>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    ${contenidoHTML}
                    ${videoHTML}
                </div>
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