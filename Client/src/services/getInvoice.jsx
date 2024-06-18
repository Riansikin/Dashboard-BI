import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";
import { decryptData } from "../utils/cryptoUtils";

const getInvoice = async (setInvoice) => {
    try {
        const { token } = await refreshToken();
        const response = await axios.get(`${API.apiBaseUrl}invoice`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status >= 200 && response.status <= 299) {
            const decryptedData = response.data.data.map(item => ({
                ...item,
                nomor_invoice: decryptData(item.nomor_invoice)
            }));
            setInvoice(decryptedData);
        }
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
    }
}

export default getInvoice;
