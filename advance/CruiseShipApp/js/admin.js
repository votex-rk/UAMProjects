import { db, auth, collection, addDoc, onSnapshot, deleteDoc, doc, signOut, query, getDocs } from './config.js';

// Analytics Loader
async function loadStats() {
    const ordersSnap = await getDocs(collection(db, "orders"));
    const usersSnap = await getDocs(collection(db, "users"));
    document.getElementById('countOrders').innerText = ordersSnap.size;
    document.getElementById('countUsers').innerText = usersSnap.size;
}

loadStats(); // Run on load

// Inventory Management
document.getElementById('addItemBtn').addEventListener('click', async () => {
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    
    if(name && price) {
        await addDoc(collection(db, "inventory"), { name, price });
        alert("Item Added");
        document.getElementById('itemName').value = "";
    }
});

// Real-time Inventory List with Delete Feature
onSnapshot(collection(db, "inventory"), (snapshot) => {
    const list = document.getElementById('inventoryList');
    list.innerHTML = "";
    snapshot.forEach(d => {
        const item = d.data();
        // Create list item with delete button
        const li = document.createElement('li');
        li.style.cssText = "display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1)";
        li.innerHTML = `<span>${item.name} ($${item.price})</span>`;
        
        const btn = document.createElement('button');
        btn.innerText = "×";
        btn.style.cssText = "padding:2px 10px; background:red; font-size:0.8rem;";
        btn.onclick = () => deleteDoc(doc(db, "inventory", d.id)); // Delete logic
        
        li.appendChild(btn);
        list.appendChild(li);
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(()=>window.location.href="index.html"));