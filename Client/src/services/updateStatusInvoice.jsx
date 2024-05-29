import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";

const updateStatusInvoice = async (id, email, newStatus) => {
    let response;
    try {
        const  {token}  = await refreshToken();

        const instance = await axios.create({
            withCredentials: true,
            baseURL: API.apiBaseUrl,
            headers: { 
                'Authorization' : `Bearer ${token}` },
            credentials: 'include',
        });

        const result = await instance.patch(`invoice/${id}`, {
            email,
            newStatus,
        });

        response = result.data.show_msg;

        return {
            status : "success",
            response
        }

    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
        
        return {
            status : "error",
            response
        }
    }
}


export default updateStatusInvoice;