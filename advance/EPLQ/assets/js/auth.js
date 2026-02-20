// --- AUTHENTICATION MODULE ---
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

export class AuthManager {
    constructor(app) {
        this.auth = getAuth(app);
    }

    async register(email, password) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    async login(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async logout() {
        return signOut(this.auth);
    }

    monitorState(callback) {
        onAuthStateChanged(this.auth, callback);
    }
}