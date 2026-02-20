// --- DATABASE MODULE ---
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { CryptoModule } from './crypto.js';
import { Logger } from './logger.js';

export class DBManager {
    constructor(app) {
        this.db = getFirestore(app);
        this.collectionName = "secure_locations";
    }

    // Admin: Encrypts data and uploads only the ciphertext
    async uploadSecureData(poiData) {
        Logger.log(Logger.levels.SECURE, "Encrypting POI Data...");
        const encryptedBlob = CryptoModule.encryptPayload(poiData);
        
        const docRef = await addDoc(collection(this.db, this.collectionName), {
            payload: encryptedBlob,
            uploadedAt: Date.now(),
            // We store a rough index for performance, but not exact location
            regionIndex: "IND-NCR" 
        });
        
        return docRef.id;
    }

    // User: Downloads all encrypted blobs and decrypts locally
    async fetchAndDecryptData() {
        Logger.log(Logger.levels.INFO, "Fetching Encrypted Streams...");
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        
        const results = [];
        querySnapshot.forEach((doc) => {
            const rawData = doc.data();
            const decrypted = CryptoModule.decryptPayload(rawData.payload);
            if (decrypted) {
                results.push(decrypted);
            }
        });
        
        Logger.log(Logger.levels.SECURE, `Decrypted ${results.length} records locally.`);
        return results;
    }
}