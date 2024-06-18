import CryptoJS from 'react-native-crypto-js';

const SECRET_KEY = '12345678901234567890123456789012';
const IV = '1234567890123456'; 

// Fungsi untuk mengenkripsi data
export const encryptAES = (plainText) => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);

  const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

  return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
};

// Fungsi untuk mendekripsi data
export const decryptData = (encryptedData) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);

    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(encryptedData) // Ensure encryptedData is parsed as Hex
      },
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting:', error);
    return null;
  }
};
