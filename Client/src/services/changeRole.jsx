import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";

const ChangeRole = async (email,  newRole) => {
    try {
        const  {token}  = await refreshToken();
        const instance = await axios.create({
            withCredentials: true,
            baseURL: API.apiBaseUrl,
            headers: { 
                'Authorization' : `Bearer ${token}` },
            credentials: 'include',
        });

        const result = await instance.patch(`change-role/${newRole}`, {
            email
        });

        if(result.status >= 200 && result.status <=  299){
            return {
                status: "success",
                response : result.data.show_msg
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

export default ChangeRole;
