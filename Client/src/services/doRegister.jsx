import axios from "axios";
import { API } from "./config";

const doRegister = async (data) => {
    const instance = axios.create({
        baseURL: API.apiBaseUrl,
        headers: {
          "Content-Type": "application/json",
        },
    });
    try {
        const response = await instance.post("register", data);
        return {
            status : "success",
            response : response.data.show_msg,  
        };
    } catch (error) {
        console.error(
            'ERROR:',
            JSON.stringify(error.message),
        );
        return {
            status : "error",
            response : error.response.data.show_msg
        }
    }
}

export default doRegister;