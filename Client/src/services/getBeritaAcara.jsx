import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";

const getBeritaAcara = async (setBeritaAcara) => {
    try {
        const { token } = await refreshToken();
        const response = await axios.get(`${API.apiBaseUrl}get-all-berita-acara`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status >= 200 && response.status <= 299) {
            setBeritaAcara(response.data.data);
        }
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
    }
}

export default getBeritaAcara;
