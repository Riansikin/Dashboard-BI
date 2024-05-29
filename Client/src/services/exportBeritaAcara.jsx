import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";


const ExportBeritaAcara = async () => {

    try {
        const { token } = await refreshToken();
        const instance = axios.create({
            baseURL: API.apiBaseUrl,
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/zip",
                "Authorization": `Bearer ${token}`,
            },
            credentials: 'include',
            responseType: "blob",
        });
        const response = await instance.get(`export-berita-acara`);

        const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `berita_acara_export.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
    }
}


export default ExportBeritaAcara;