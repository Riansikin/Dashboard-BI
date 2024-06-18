const crypto = require('crypto');
const encryptionKey = process.env.ENCRYPTION_KEY;
const algorithm = process.env.ENCRYPTION_ALGORITHM;
const iv = process.env.ENCRYPTION_IV;

module.exports = {
    encryptData(data){
        try {
            const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_IV);
            let encryptedData = cipher.update(data, 'utf8', 'hex');
            encryptedData += cipher.final('hex');
            return encryptedData.toUpperCase(); 
        } catch (error) {
            return null;
        }
    },

    decryptData(encryptedData){
        try {
            const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM, process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_IV);
            let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
            decryptedData += decipher.final('utf8');
            return decryptedData;
        } catch (error) {
            return null;
        }
        
    }
}