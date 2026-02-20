import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc, 
    query, where, onSnapshot, doc, setDoc, orderBy, limit, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
  const firebaseConfig = {
    apiKey: "AIzaSyBHY7vIpnBehv6S4mUBOf5rKSL_DhLvSzM",
    authDomain: "cruiseshipmanager.firebaseapp.com",
    projectId: "cruiseshipmanager",
    storageBucket: "cruiseshipmanager.firebasestorage.app",
    messagingSenderId: "442027254202",
    appId: "1:442027254202:web:c0f75a919c82188a2cbd83",
    measurementId: "G-6QPNNL28PD"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 1. Toast Notification Helper
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    // Simple color coding based on type
    let border = '#00f2ff'; // Info (Cyan)
    if(type === 'error') border = '#ff4757'; // Red
    if(type === 'success') border = '#2ed573'; // Green
    
    toast.style.borderLeft = `4px solid ${border}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    
    // Animation logic
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    document.body.appendChild(div);
    return div;
}

// 2. Database Logging Helper (The missing function)
async function logAction(userEmail, action, module) {
    try {
        await addDoc(collection(db, "system_logs"), {
            user: userEmail,
            action: action,
            module: module,
            timestamp: new Date().toISOString() // String format for easier reading
        });
    } catch (e) {
        console.error("Logging failed:", e);
    }
}

// EXPORT EVERYTHING
export { 
    app, db, auth, 
    collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc, query, where, onSnapshot, doc, setDoc, orderBy, limit, serverTimestamp,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, 
    showToast, logAction 
};