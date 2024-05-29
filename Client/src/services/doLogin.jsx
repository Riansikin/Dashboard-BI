import axios from "axios";
import { API } from "./config";

const DoLogin = async (data) => {
    const instance = await axios.create({
        withCredentials: true,
        baseURL: API.apiBaseUrl,
        headers: {
            'Access-Control-Allow-Origin': '*', 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    });
    try {
        const response = await instance.post("login", data);
        localStorage.setItem('userProfile', JSON.stringify(response.data.profile_picture));
        return {
            status : "success",
            response : response.data.show_msg,
        }
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
        return {
            status : "error",
            response : error.response.data.show_msg
        }
    }
}

export default DoLogin;