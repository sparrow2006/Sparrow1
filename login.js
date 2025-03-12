import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAjd5Q32AD3nf2SlFwLSA-5WFO6reKgVD0",
    authDomain: "login-page-ffb00.firebaseapp.com",
    projectId: "login-page-ffb00",
    storageBucket: "login-page-ffb00.firebasestorage.app",
    messagingSenderId: "827092805782",
    appId: "1:827092805782:web:0a7f4679687579bb7cfab7",
    measurementId: "G-96BKXR4C32"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful!");

        // Redirect to home page after successful login
        window.location.href = 'home.html';
    } catch (error) {
        console.error("Login error:", error);

        // Display appropriate error message
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage.textContent = 'Email is not registered';
                break;
            case 'auth/wrong-password':
                errorMessage.textContent = 'Incorrect password';
                break;
            default:
                errorMessage.textContent = 'Login failed. Please try again';
        }
    }
}); 