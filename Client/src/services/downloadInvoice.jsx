import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";

const DownloadInvoice = async (id) => {
    
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
        const response  = await instance.get(`download-invoice/${id}`);

        if(response.data.type === "application/zip"){
            const url = URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download= `${id}_invoice.zip`;
            a.style.display = "none",
            document.body.appendChild(a);
            a.click();
            a.remove(),
            URL.revokeObjectURL(url);

        }else{
            const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', `${id}_invoice.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        return response;
    } catch (error) {
        console.error("Error : ",JSON.stringify(error.message));
    }

}


export default DownloadInvoice;