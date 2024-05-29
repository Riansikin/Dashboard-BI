import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "./config";

const instance = axios.create({
    withCredentials: true,
    baseURL: API.apiBaseUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    credentials: "include",
});

const refreshToken = async () => {
    try {
        const response = await instance.get('refresh-token');
        const decoded = jwtDecode(response.data.token);

        return {
            token : response.data.token,
            decoded : decoded
        }
    } catch (error) {
        console.log("Error refreshing token:", error);
        // window.location.href = '/login'; s
        throw error;
    }   
}


export default refreshToken;