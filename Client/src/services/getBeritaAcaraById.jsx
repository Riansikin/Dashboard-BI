import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";

const BeritaAcarabyId = async(id) => {
    try {
        const {token} = await refreshToken();

        const response = await axios.get(`${API.apiBaseUrl}get-berita-acara-id/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

        if (response.status >= 200 && response.status <= 299) {
            return {
                status: "success",
                response: response.data.data,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            status : "error",
            response : error.response.data.show_msg,
        }
    }   
}


export default BeritaAcarabyId;