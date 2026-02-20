import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { firebaseConfig } from './config.js';
import { AuthManager } from './auth.js';
import { DBManager } from './db.js';

// Init
const app = initializeApp(firebaseConfig);
const auth = new AuthManager(app);
const db = new DBManager(app);
let map = null;
let markers = [];

// --- UTILS ---
const showToast = (msg, type = 'info') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = type === 'error' ? '#ef4444' : '#3b82f6';
    toast.innerHTML = `<strong>${type.toUpperCase()}</strong><br>${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// --- MAP LOGIC ---
function initMap() {
    if(map) return; // Prevent re-init
    
    // Default: Faridabad
    map = L.map('map').setView([28.4089, 77.3178], 13);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 19
    }).addTo(map);

    // Add User Location Button Logic
    document.getElementById('btn-geo')?.addEventListener('click', () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], 15);
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup("You are here (Approx)").openPopup();
                showToast("Location Acquired");
            });
        }
    });
}

// --- DASHBOARD SETUP ---
auth.monitorState((user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('user-email').innerText = user.email;
    initMap();

    // *** ADMIN LOGIC ***
    // We check if the email is our specific admin email
    if (user.email === 'admin@eplq.com') {
        setupAdminView();
    } else {
        setupUserView();
    }
});

function setupAdminView() {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('user-panel').classList.add('hidden');
    document.getElementById('role-badge').innerText = "SYSTEM ADMIN";
    document.getElementById('role-badge').style.color = "#ef4444";
    showToast("Admin Privileges Granted");
}

function setupUserView() {
    document.getElementById('user-panel').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('role-badge').innerText = "SECURE USER";
}

// --- EVENT HANDLERS ---

// 1. ADMIN UPLOAD
document.getElementById('form-upload')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Encrypting & Uploading...";

    try {
        const data = {
            name: document.getElementById('poi-name').value,
            desc: document.getElementById('poi-desc').value,
            lat: parseFloat(document.getElementById('poi-lat').value),
            lng: parseFloat(document.getElementById('poi-lng').value),
            type: document.getElementById('poi-type').value
        };

        await db.uploadSecureData(data);
        showToast("Data Encrypted & Uploaded Successfully!");
        e.target.reset();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.innerText = originalText;
    }
});

// 2. USER SEARCH (FIXED)
document.getElementById('btn-search')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-search');
    btn.innerText = "Running Secure Query...";
    btn.disabled = true;

    try {
        // Clear old markers
        markers.forEach(m => map.removeLayer(m));
        markers = [];

        // Fetch Data
        let pois = await db.fetchAndDecryptData();

        // *** MOCK DATA FALLBACK *** // If DB is empty, generate fake data so user sees SOMETHING
        if (pois.length === 0) {
            showToast("Database empty. Generating Simulation Data...", 'info');
            pois = [
                { name: "City Hospital (Sim)", lat: 28.41, lng: 77.32, desc: "Trauma Center" },
                { name: "Police HQ (Sim)", lat: 28.405, lng: 77.31, desc: "Main Station" },
                { name: "Fire Station (Sim)", lat: 28.415, lng: 77.325, desc: "Quick Response" }
            ];
        }

        // Render Markers
        const bounds = L.latLngBounds();
        pois.forEach(poi => {
            const m = L.marker([poi.lat, poi.lng]).addTo(map);
            m.bindPopup(`
                <div style="color:#333">
                    <strong>${poi.name}</strong><br>
                    ${poi.desc}
                </div>
            `);
            markers.push(m);
            bounds.extend([poi.lat, poi.lng]);
        });

        // Zoom map to fit results
        if(markers.length > 0) map.fitBounds(bounds, { padding: [50, 50] });

        showToast(`Decrypted ${pois.length} Locations nearby.`);

    } catch (err) {
        showToast("Decryption Error: " + err.message, 'error');
    } finally {
        btn.innerText = "Fetch & Decrypt Nearby Data";
        btn.disabled = false;
    }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => auth.logout());