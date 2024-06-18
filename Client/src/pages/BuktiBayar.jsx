import React, { useState, useRef, useEffect } from "react";
import useUser from "../useUser.jsx";
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
// import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import SideBar from "../components/sideBar.jsx";
import SideBarRes from "../components/sideBarRes.jsx";
import BeritaAcarabyId from "../services/getBeritaAcaraById.jsx";
import DownloadBeritaAcara from "../services/downloadBeritaAcara.jsx";
import BuktiBayarForm from "../components/formBuktiBayar.jsx";
import BuktiBayarbyId from "../services/getBuktiBayarbyid.jsx";
import newBuktiBayar from "../services/newBuktiBayar.jsx";
import DownloadBuktiBayar from "../services/downloadBuktiBayar.jsx";
import ForbiddenPage from "./Forbidden.jsx";
import { encryptAES } from "../utils/cryptoUtils.js";

export default function BuktiBayar({match}){
    const { user } = useUser();
    const { id } = useParams();
    const toast = useRef(null);
    const [allow, setAllow ] = useState(false);
    const confirmDialogRef = useRef(null);
    const [ forbid , setForbid ] = useState(true);
    const [visible, setVisible] = useState(false);
    const [file , setFile ]  = useState({
        dokumen : '',
        dokumen_bukti : '',
        upload : false
    })


    const { handleSubmit, setValue, control, formState: { errors }, getValues } = useForm({  
        defaultValues : {
            nomor_kontrak : null,
            nama_rekanan : '',
            nama_pekerjaan : '',
            nilai_kontrak : null,
            jangka_waktu : null,
            nilai_tagihan : null,
            tanggal_mulai : '',
            status : '',
            dokumen_bukti : null,
            dokumen : null,
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await newBuktiBayar(data, id);
            if (response.status === 'success' && toast.current  ) {
                toast.current.show({ severity: response.status, summary: response.status === 'error' ? 'Error' : 'Success', detail: response.response });
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
        } catch (error) {
            console.error("Error:", error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: "Server Dalam Gangguan" });
            }
        }
    }    
     
    useEffect(() => {
        if (!id) {
            confirmDialogRef.current = confirmDialog({
                group: 'headless',
                message: 'Are you sure you want to proceed?',
                header: 'Nomor Kontrak',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'accept',
            });

            return; 
        } 

        const fetchData = async () => {
            try {
                const beritaAcaraResponse = await BeritaAcarabyId(id);
                const buktiBayarResponse = await BuktiBayarbyId(id);

                if(beritaAcaraResponse.status === 'error'){
                    toast.current.show({
                        severity: 'error', 
                        summary: 'Error', 
                        detail: beritaAcaraResponse.response
                    });

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2500);

                    return;
                }

                if(beritaAcaraResponse.response.status === "Ditolak"){
                    toast.current.show({
                        severity: 'error', 
                        summary: 'Error', 
                        detail: "Proses Telah Ditolak" 
                    });

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2500);
                    

                    return;
                }else if ( beritaAcaraResponse.response.status !== "Selesai"){
                    toast.current.show({
                        severity: 'error', 
                        summary: 'Error', 
                        detail: "Proses Belum Dalam status 'Selesai'" 
                    });

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2500);

                    return;
                }

                if(user.role === 'Vendor'){
                    setForbid(beritaAcaraResponse.response.created_by.email === user.email);
                }
                
               
                const dataBeritaAcara = beritaAcaraResponse.response;
                setAllow(true);
                setValue('nomor_kontrak', id);
                setValue('nama_rekanan', dataBeritaAcara.nama_rekanan);
                setValue('nama_pekerjaan', dataBeritaAcara.nama_pekerjaan);
                setValue('nilai_kontrak', dataBeritaAcara.nilai_kontrak);
                setValue('jangka_waktu', dataBeritaAcara.jangka_waktu);
                setValue('nilai_tagihan', dataBeritaAcara.nilai_tagihan);
                setValue('tanggal_mulai', new Date(dataBeritaAcara.periode_penagihan.mulai));
                setValue('dokumen', dataBeritaAcara.dokumen.split("/")[4]);
                setValue('status', dataBeritaAcara.status);
                setFile(data => ({
                    ...data,
                    dokumen : getValues().dokumen
                }))
                
                if(buktiBayarResponse.status === 200) {
                    const dokumen = buktiBayarResponse.response.result.dokumen.split("/")[4];
                    setValue('dokumen_bukti', dokumen);
                    setFile(data => ({
                        ...data,
                        dokumen_bukti : getValues().dokumen_bukti,
                        upload : true   
                    }))
                    
                }
            } catch (error) {
                console.error('Error:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Server Dalam Gangguan, Di alihkan ke home"
                });
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
        }
        
        fetchData();
    }, [id, setValue, toast]);

    const handleDownloadBeritaAcara = async () => {
        const response  = await DownloadBeritaAcara(id);

        toast.current.show({ severity: response.status, summary: response.status === 'error' ? 'Error' : 'Success', detail: response.response });
    }
    const handleDownloadBuktiBayar = async () => {

        const response = await DownloadBuktiBayar(id)
        toast.current.show({ severity: response.status, summary: response.status === 'error' ? 'Error' : 'Success', detail: response.response });
    }

    const onSearch = async (data) => {
        try {
            const response = await BeritaAcarabyId(encryptAES(data.nomor_kontrak));
            if(response.status === 'success'){
                window.location.href = `/bukti-bayar/${encryptAES(data.nomor_kontrak)}`
            }else{
                toast.current.show({ 
                    severity: response.status, 
                    summary: 'Error',
                    detail: response.response
                });
            }
        } catch (error) {
            console.error(
                'ERROR:',
                JSON.stringify(error.message)
            );
            toast.current.show({
                severity: 'error', 
                summary: 'Error', 
                detail: "Server Dalam Gangguan" 
            }); 
        }
    }

    if(!forbid){
        return (
            <>
                <ForbiddenPage />
            </>
        )
    }
    return (
        <div className="bukti-bayar flex h-full w-full" style={{ background : '#F7F8FA'}}>
        
            <SideBar user={user} position={"Bukti Bayar"} />
            <SideBarRes user={user} position={"Bukti Bayar"} visible={visible} setVisible={setVisible}/>
            {id && allow && (
                <main  className="flex-grow-1" style={{ background : '#F7F8FA'}} >

                <div className="block sm:hidden w-full flex justify-content-center">
                    <div className="w-11 flex align-items-center gap-2">
                        <Button className="block sm:hidden"  icon="pi pi-bars" onClick={() => setVisible(true)} /> 
                        <span>Bukti Bayar #{id}</span>
                    </div>
                </div>
                
                <div className="bukti-bayar w-full flex flex-column align-items-center">
                    <div className="w-11 py-4 text-left hidden sm:block">
                        <h1>Bukti Bayar #{id}</h1>
                    </div>

                   <BuktiBayarForm
                        toast={toast}
                        id={id}
                        setFile={setFile}
                        file={file}
                        handleSubmit={handleSubmit(onSubmit)}
                        setValue={setValue}
                        control={control}
                        errors={errors}
                        getValues={getValues}
                        handleDownloadBeritaAcara={handleDownloadBeritaAcara}
                        handleDownloadBuktiBayar={handleDownloadBuktiBayar}
                    />
                </div>
            </main>
            )}
            <ConfirmDialog
                group="headless"
                content={({ headerRef, footerRef, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-question text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>

                        <form onSubmit={handleSubmit(onSearch)} >
                            <div className="nomor-kontrak-field flex flex-column gap-1">
                                <Controller
                                    name="nomor_kontrak"
                                    control={control}
                                    rules={{ required: 'Nomor kontrak is required' }}
                                    render={({ field }) => (
                                        <>
                                            <InputText value={field.value} 
                                            inputStyle={{ textAlign: 'center' }}
                                            onChange={(e) => {
                                                setValue('nomor_kontrak', e.target.value);
                                            }}  useGrouping={false}
                                            />
                                            <small>{errors.nomor_kontrak && <span>{errors.nomor_kontrak.message}</span>}</small>
                                        </>
                                )}/>
                            </div>

                            <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                                <Button
                                    label="Search"
                                    className="w-8rem"
                                />
                                <Button
                                    label="Home"
                                    outlined
                                    type="button"
                                    className="w-8rem"
                                    onClick={() => window.location.href = '/'}
                                />
                            </div>
                        </form>
                    </div>
                )}
            />
            <Toast ref={toast} />
        </div>
    )
}