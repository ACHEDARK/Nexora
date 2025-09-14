import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { auth } from "./FirebaseConfig.js"; // asegúrate que tu archivo FirebaseConfig.js exporta `auth`

export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        console.error("Error en login:", error);
        return false;
    }
}
