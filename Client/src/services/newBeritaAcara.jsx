import axios from "axios";
import refreshToken from "./resfreshToken";
import { API } from "./config";


const newBeritaAcara = async (data) => {
    
 
    try {
        const { token } = await refreshToken();
        const instance = axios.create({
            baseURL: API.apiBaseUrl,
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization' : `Bearer ${token}` 
            },
            credentials: 'include',
        });
        const formData = new FormData();
        formData.append("nomor_kontrak", data.nomor_kontrak);
        formData.append("nama_rekanan", data.nama_rekanan);
        formData.append("nama_pekerjaan", data.nama_pekerjaan);
        formData.append("nilai_kontrak", data.nilai_kontrak);
        formData.append("jangka_waktu", data.jangka_waktu);
        formData.append("nilai_tagihan", data.nilai_tagihan);
        formData.append("tanggal_mulai", data.tanggal_mulai.toISOString());
        formData.append("berita_acara", data.dokumen);

        const response = await instance.post("new-berita-acara", formData);
    
        return {
            status: "success",
            response: response.data.show_msg,
        }
    } catch (error) {
        console.error("Error uploading berita acara:", error.response.data.show_msg);
        return {
            status: "error",
            response: error.response.data.show_msg,
        };
    }
};

export default newBeritaAcara;
