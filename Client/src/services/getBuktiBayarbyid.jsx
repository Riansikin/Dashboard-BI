import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";


const BuktiBayarbyId = async (id) => {
    try {
        const {token} = await refreshToken();

        const response = await axios.get(`${API.apiBaseUrl}get-bukti-bayar/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                status: 200,
                response : response.data
            };
        }


        if(response.status === 204){
            return {
                status : 204,
                response : `Berita Acara ${id} tidak ditemukan`
            }
        }
    } catch (error) {
        console.error(error.message);
        return {
            status : "error",
            response : error.response.data.show_msg,
        }

    }
}

export default BuktiBayarbyId;