// js/auth.js
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc, logAction, showToast } from './config.js';

const emailIn = document.getElementById('email');
const passIn = document.getElementById('password');
const roleIn = document.getElementById('role');
const msg = document.getElementById('msg');

// Register
document.getElementById('regBtn').addEventListener('click', async () => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, emailIn.value, passIn.value);
        
        await setDoc(doc(db, "users", cred.user.uid), {
            email: emailIn.value,
            role: roleIn.value
        });
        
        await logAction(emailIn.value, "User Registered", "Auth");
        showToast("Registration Successful! Please Sign In.", "success");
    } catch (e) {
        msg.innerText = e.message;
        showToast("Registration Failed", "error");
    }
});

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
        const cred = await signInWithEmailAndPassword(auth, emailIn.value, passIn.value);
        
        const userSnap = await getDoc(doc(db, "users", cred.user.uid));
        if (userSnap.exists()) {
            const role = userSnap.data().role;
            await logAction(emailIn.value, `Login as ${role}`, "Auth");
            showToast("Login Successful", "success");
            
            // Redirect logic
            setTimeout(() => {
                if (role === 'voyager') window.location.href = 'voyager.html';
                else if (role === 'admin') window.location.href = 'admin.html';
                else window.location.href = 'staff.html';
            }, 1000);
        } else {
            showToast("User role not found in database", "error");
        }
    } catch (e) {
        msg.innerText = "Invalid Credentials";
        showToast(e.message, "error");
    }
});