import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging.js";

// 🔐 Load environment variables
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
const db = getFirestore(app);
const messaging = getMessaging(app);

// Get form elements
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Signup function
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (password.length < 6) {
        alert("🔴 Password must be at least 6 characters");
        return;
    }

    try {
        console.log('🔹 Creating user...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        console.log('🔹 Updating profile...');
        await updateProfile(userCredential.user, { displayName: name });

        console.log('🔹 Storing in Firestore...');
        await storeUserData(userCredential.user);

        console.log('🔹 Requesting FCM permission...');
        await requestNotificationPermission(userCredential.user.uid);

        alert('✅ Registration successful!');

        setTimeout(() => {
            window.location.replace('./home.html');
        }, 1000);

    } catch (error) {
        console.error("🚨 Registration error:", error);
        alert("🚨 Error: " + error.message);
    }
});

// Store user data in Firestore
async function storeUserData(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            createdAt: serverTimestamp()
        }, { merge: true });  // ✅ Prevents overwriting existing data
        console.log('✅ User data stored successfully');
    } catch (error) {
        console.error('🚨 Error storing user data:', error);
        throw error;
    }
}

// Request notification permission & store FCM token
async function requestNotificationPermission(userId) {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: '2YGOsc3SD0RoTyLOLCkGxJljZK8IWn7-3nKDHx5Ss_g'
            });

            if (token) {
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, { fcmToken: token }, { merge: true });

                console.log('✅ FCM Token:', token);
            } else {
                console.log('⚠️ No FCM token received.');
            }
        } else {
            console.log('⚠️ Notification permission denied.');
        }
    } catch (error) {
        console.error('🚨 Error fetching FCM token:', error);
    }
}
