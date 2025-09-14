import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { db } from "./FirebaseConfig.js";
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Post del Blog
export async function DataBlog() {
    try {
        const postCol = collection(db, "Post");
        const snapshot = await getDocs(postCol);

        if (!snapshot.empty) {
            const posts = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    autor: data.autor || "",
                    categoria: data.categoria || "",
                    descripcion: data.descripcion || "",
                    fecha: data.fecha || "",
                    titulo: data.titulo || "",
                    contenido: data.contenido || "",
                    urlFoto: data.urlFoto || "/placeholder.svg",
                    comentarios: data.comentarios || []
                };
            });

            return posts;
        } else {
            console.warn("No se encontró ningún post.");
            return [];
        }
    } catch (error) {
        console.error("Error al obtener posts:", error);
        return [];
    }
}

// Agregar un comentario 
export async function agregarComentario(postId, comentario) {
    try {
        const refPost = doc(db, "Post", postId);

        await updateDoc(refPost, {
            comentarios: arrayUnion(comentario)
        });

        console.log("Comentario agregado correctamente");
    } catch (error) {
        console.error("Error al agregar comentario:", error);
    }
}

// Redes sociales
export async function GetSocialLinks() {
    try {
        const socialCol = collection(db, "social");
        const snapshot = await getDocs(socialCol);

        if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            const data = docSnap.data();

            return {
                correo: data?.correo ?? "",
                github: data?.github ?? "",
                linkedin: data?.linkedin ?? "",
            };
        } else {
            console.warn("No se encontró ningún documento en 'social'.");
            return { correo: "", github: "", linkedin: "" };
        }
    } catch (error) {
        console.error("Error al obtener redes sociales:", error);
        return { correo: "", github: "", linkedin: "" };
    }
}


