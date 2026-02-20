import { db, auth, collection, onSnapshot, query, where, updateDoc, doc, getDoc, signOut } from './config.js';

const grid = document.getElementById('tasksGrid');

auth.onAuthStateChanged(async (user) => {
    if (user) {
        // 1. Get User Role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.data().role;
        document.getElementById('roleTitle').innerText = `${role.toUpperCase()} PANEL`;

        // 2. Filter Orders based on Role
        let q;
        if(role === 'head-cook') q = query(collection(db, "orders"), where("type", "==", "Catering"));
        else if(role === 'manager') q = query(collection(db, "orders"), where("type", "==", "Booking"));
        else q = query(collection(db, "orders")); // Supervisor sees everything

        // 3. Render Tasks
        onSnapshot(q, (snapshot) => {
            grid.innerHTML = "";
            snapshot.forEach(d => {
                const data = d.data();
                
                // Create Card
                const card = document.createElement('div');
                card.className = "glass-card";
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span class="badge ${data.status}">${data.status}</span>
                        <small>${data.category || data.type}</small>
                    </div>
                    <h3>${data.detail}</h3>
                    <p>User: ${data.user}</p>
                `;

                // Add "Complete" Button if status is pending
                if(data.status === "pending") {
                    const btn = document.createElement('button');
                    btn.innerText = "Mark as Done";
                    btn.style.width = "100%";
                    btn.style.marginTop = "10px";
                    btn.onclick = async () => {
                        await updateDoc(doc(db, "orders", d.id), { status: "completed" });
                    };
                    card.appendChild(btn);
                }

                grid.appendChild(card);
            });
        });
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(()=>window.location.href="index.html"));