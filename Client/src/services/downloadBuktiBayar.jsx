import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";

const DownloadBuktiBayar= async (id) => {
    
    try {     
        const { token } = await refreshToken();
        const instance = await axios.create({
            baseURL: API.apiBaseUrl,
            headers: {
                "Content-Type": "application/zip",
                "Authorization": `Bearer ${token}`,
            },
            credentials: 'include',
            responseType: "blob",
        });
        const response =  await instance.get(`download-bukti-bayar/${id}`);
        if (response.status >= 400) {
            const errorMsg = await response.data.text();
            const errorObj = JSON.parse(errorMsg);
            return { 
                status: "error",
                response: errorObj.show_msg || 'An error occurred while downloading the file.',
            };
        }

        if(response.data.type === "application/zip"){
            const url = URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download= `${id}_bukti_bayar.zip`;
            a.style.display = "none",
            document.body.appendChild(a);
            a.click();
            a.remove(),
            URL.revokeObjectURL(url);

        }else{
            const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', `${id}_bukti_bayar_acara.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        return response;
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
        if (error.message === "Network Error") {
            console.warn("Network Error ignored");
            return { 
                status : "info",
                response: "Menunggu Donwload File",
            };
        }
        return { 
            status: "error",
            response: "Ada kesalahan dalam mengambil file",
        };
    }

}


export default DownloadBuktiBayar;