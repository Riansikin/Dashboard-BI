import React, { useState, useRef, useEffect } from "react";
import useUser from "../useUser.jsx";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useForm} from 'react-hook-form';
import SideBar from "../components/sideBar.jsx";
import SideBarRes from "../components/sideBarRes.jsx";
import newInvoice from "../services/newInvoice.jsx";
import { useParams } from 'react-router-dom';
import ForbiddenPage from "./Forbidden.jsx";
import InvoicebyId from "../services/getInvoiceById.jsx";
import updateStatusInvoice from "../services/updateStatusInvoice.jsx";
import DownloadInvoice from "../services/downloadInvoice.jsx";


import FormInovice from "../components/formInvoice.jsx";

export default function InvoiceDetail({match}){
    const {user} = useUser();
    const { id } = useParams();
    const toast = useRef(null);
    const [ status , setStatus ] = useState();
    const [visible, setVisible] = useState(false);
    const { handleSubmit, setValue, getValues, control, formState: { errors },  } = useForm({
         defaultValues : {
            nomor_kontrak : null,
            nama_rekanan : '',
            nama_pekerjaan : '',
            nilai_kontrak : null,
            nilai_tagihan : null,
            tanggal_mulai : '',
            tanggal_akhir : '',
            status : '',
            dokumen_bukti : null,
            dokumen : null,
        }

    });

    useEffect(() => {
        if (id) {
            InvoicebyId(id)
                .then(dataInvoice => {
                    const data = dataInvoice.response;
                    const dokumen = dataInvoice.response.dokumen.split("/")[4];

                    setValue('nama_rekanan', data.nama_rekanan);
                    setValue('nama_pekerjaan', data.nama_pekerjaan);
                    setValue('nilai_kontrak', data.nilai_kontrak);
                    setValue('nilai_tagihan', data.nilai_tagihan);
                    setValue('tanggal_mulai', new Date(data.periode_penagihan.mulai));
                    setValue('tanggal_akhir', new Date(data.periode_penagihan.akhir));
                    setValue('dokumen', dokumen);
                    setValue('status', data.status);

                    setStatus(data.status);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }, [id]);

    const handleDownload = () => {
        DownloadInvoice(id);
    }

    const onSubmit = async (data) => {
        try {
            if (!id) {
                const response = await newInvoice(data);

                toast.current.show({ severity: response.status, summary: response.status === 'error' ? 'Error' : 'Success', detail: response.response });
                if (response.status === 'success') {
                    setTimeout(() => {
                        window.location.href = '/invoice';
                    }, 3000);
                }
            } else {
                const response = await updateStatusInvoice(id, user.email, data.status);
                toast.current.show({ severity: response.status, summary: response.status === 'error' ? 'Error' : 'Success', detail: response.response });
                if (response.status === 'success') {
                    setTimeout(() => {
                        window.location.href = '/invoice';
                    }, 3000);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: "Server Dalam Gangguan" });
        }
    }


    if (id && user.role === 'Vendor') {
        return (
            <>
                <ForbiddenPage />
            </>
        )
    }

    return (
        <div className="invoice flex h-full w-full" style={{ background : '#F7F8FA'}}>
        
            <SideBar user={user} position={"Invoice"} />
            <SideBarRes user={user} position={"Invoice"} visible={visible} setVisible={setVisible}/>
             
            <main className="flex-grow-1" style={{ background : '#F7F8FA'}}>
                <div className="block sm:hidden w-full flex justify-content-center">
                    <div className="w-11 flex gap-2">
                        <Button className="block sm:hidden"  icon="pi pi-bars" onClick={() => setVisible(true)} /> 
                        <h1>Invoice</h1>
                    </div>
                </div>
                

                <div className="berita-acara w-full flex flex-column align-items-center">
                    <div className="w-11 py-4 text-left hidden sm:block">
                        <h1>Invoice</h1>
                    </div>

                    <FormInovice
                        toast={toast}
                        id={id}
                        handleSubmit={handleSubmit(onSubmit)}
                        setValue={setValue}
                        control={control}
                        errors={errors}
                        handleDownload={handleDownload}
                        getValues={getValues}
                        status={status}
                    />
                </div>
            </main>

           
            <Toast ref={toast} />
        </div>
    )
}
