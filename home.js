import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

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

// Get DOM elements
const userNameElement = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userNameElement.textContent = `Welcome, ${user.displayName || 'User'}!`;
    } else {
        // User is signed out, redirect to login page
        window.location.href = 'index.html';
    }
});

// Logout functionality
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}); 