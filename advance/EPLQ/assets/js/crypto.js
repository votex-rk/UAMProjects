/* js/crypto.js */

// We use a symmetric key derivation for this demo. 
// In a real production environment, this would be a predicate encryption scheme.
const SECRET_KEY = "EPLQ-Super-Secret-Key-Change-This"; 

export const CryptoModule = {
    /**
     * Encrypts data before sending to Cloud (Firebase)
     */
    encryptData: (data) => {
        try {
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
            return ciphertext;
        } catch (error) {
            console.error("Encryption Failed:", error);
            return null;
        }
    },

    /**
     * Decrypts data received from Cloud
     */
    decryptData: (ciphertext) => {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        } catch (error) {
            console.error("Decryption Failed:", error);
            return null;
        }
    },

    /**
     * Generates a privacy-preserving spatial index
     * We hash the GeoHash so the server doesn't know the exact location, 
     * but we can still query for exact matches on the hash.
     */
    generateBlindIndex: (geohash) => {
        return CryptoJS.SHA256(geohash).toString();
    }
};