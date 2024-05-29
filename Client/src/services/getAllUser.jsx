import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";


const getAllUsers = async (setListUser) => {
    try {
        const { token } = await refreshToken();
        const response = await axios.get(`${API.apiBaseUrl}get-all-users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status >= 200 && response.status <= 299) {
            setListUser(response.data.users);
        }
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
    }
}

export default getAllUsers;