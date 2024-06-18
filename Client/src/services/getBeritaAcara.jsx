import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";
import { decryptData } from "../utils/cryptoUtils";


const getBeritaAcara = async (setBeritaAcara) => {
    try {
        const { token } = await refreshToken();
        const response = await axios.get(`${API.apiBaseUrl}get-all-berita-acara`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status >= 200 && response.status <= 299) {
            const decryptedData = response.data.data.map(item => ({
                ...item,
                nomor_kontrak: decryptData(item.nomor_kontrak)
            }));
            setBeritaAcara(decryptedData);
        }
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
    }
}

export default getBeritaAcara;
