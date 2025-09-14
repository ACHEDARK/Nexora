import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBrVKU2E0-Jpnxim-349OBl1aBS4XJTbFs",
  authDomain: "blog-web-fb5f6.firebaseapp.com",
  databaseURL: "https://blog-web-fb5f6-default-rtdb.firebaseio.com",
  projectId: "blog-web-fb5f6",
  storageBucket: "blog-web-fb5f6.firebasestorage.app",
  messagingSenderId: "47461542299",
  appId: "1:47461542299:web:15131c32932b85de8c593e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
