import { db, auth, addDoc, collection, query, where, onSnapshot, signOut, serverTimestamp, orderBy } from './config.js';

// Order Catering
document.getElementById('orderCatBtn').addEventListener('click', async () => {
    const item = document.getElementById('catItem').value;
    if(!item) return alert("Please enter an item name");
    
    await addDoc(collection(db, "orders"), {
        user: auth.currentUser.email,
        type: "Catering",
        detail: item,
        category: document.getElementById('catType').value,
        status: "pending",
        timestamp: serverTimestamp()
    });
    alert("Order Sent to Kitchen!");
});

// Book Facility
document.getElementById('bookResBtn').addEventListener('click', async () => {
    const date = document.getElementById('resDate').value;
    if(!date) return alert("Please pick a date");

    await addDoc(collection(db, "orders"), {
        user: auth.currentUser.email,
        type: "Booking",
        detail: document.getElementById('resType').value,
        date: date,
        status: "confirmed",
        timestamp: serverTimestamp()
    });
    alert("Reservation Confirmed!");
});

// Real-time History Loader
auth.onAuthStateChanged((user) => {
    if (user) {
        const q = query(
            collection(db, "orders"), 
            where("user", "==", user.email),
            orderBy("timestamp", "desc")
        );

        onSnapshot(q, (snapshot) => {
            const list = document.getElementById('historyList');
            list.innerHTML = "";
            snapshot.forEach(doc => {
                const data = doc.data();
                const dateStr = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : "Just now";
                
                list.innerHTML += `
                    <tr>
                        <td>${data.detail} <br><small style="opacity:0.6">${data.type}</small></td>
                        <td><span class="badge ${data.status}">${data.status}</span></td>
                        <td>${dateStr}</td>
                    </tr>
                `;
            });
            if(snapshot.empty) list.innerHTML = "<tr><td colspan='3'>No history found.</td></tr>";
        });
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(()=>window.location.href="index.html"));