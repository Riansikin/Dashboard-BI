import React from "react";
import axios from "axios";
import { API } from "./config";

const logOut = async () => {
    try {
        const instance = await axios.create({
            withCredentials: true,
            baseURL: API.apiBaseUrl,
            headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            credentials: 'include',
        });

        const response = await instance.delete('logout');
        localStorage.removeItem('userProfile');
        window.location.href = '/login';

        return {
            status: "success",
            response,
        };
    } catch (error) {
        console.error("Error : ", error.message);
        return {
            status: "error",
            response: error.response.data.show_msg,
        };
    }
}



export default logOut;