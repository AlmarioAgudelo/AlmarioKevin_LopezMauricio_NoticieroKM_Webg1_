// Importa Firebase y Storage
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCSUOeSPzxFpXHlTN-C0rcyx6ZfHTJKFqE",
    authDomain: "noticias-proyecto-kmw.firebaseapp.com",
    projectId: "noticias-proyecto-kmw",
    storageBucket: "noticias-proyecto-kmw.appspot.com",
    messagingSenderId: "489854389369",
    appId: "1:489854389369:web:8a0b65e8443120ca1fd8a8",
    measurementId: "G-5NYXCMGP6B"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporta servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 Aquí exportas Storage
