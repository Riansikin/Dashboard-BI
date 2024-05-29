import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";


const newBuktiBayar = async (data, id) => {
    
    try {
        const { token } = await refreshToken();
        const instance = axios.create({
            baseURL: API.apiBaseUrl,
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization' : `Bearer ${token}` 
            },
            credentials: 'include',
        });
        const formData = new FormData();
        formData.append("bukti_bayar", data.dokumen_bukti);

        const response = await instance.post(`new-bukti-bayar/${id}`, formData);
        
        return {
            status: "success",
            response: response.data.show_msg,
        }
    } catch (error) {
        console.error("Error uploading bukti bayar:", error);
        return {
            status: "error",
            response: error.response.data.show_msg || "no response",
        };
    }
};

export default newBuktiBayar;
