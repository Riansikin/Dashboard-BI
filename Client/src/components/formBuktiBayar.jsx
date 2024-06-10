import React, { useEffect, useState } from "react";
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';

const BuktiBayarForm = ({toast, id, handleSubmit, setValue, control, errors, getValues, handleDownloadBeritaAcara, handleDownloadBuktiBayar, setFile, file}) => {    
    
    return (
        <form className="w-11 flex flex-column lg:flex-row p-1 lg:p-3" onSubmit={handleSubmit}   style={{ background : '#FFFFFF'}}>
            <div className="left-form p-2 flex flex-column gap-3 flex-grow-1">
                <div className="nama-renkanan-field flex flex-column gap-1">
                    <label htmlFor="nama_rekanan">Nama Rekanan</label>
                    <Controller
                        name="nama_rekanan"
                        control={control}
                        rules={{ required: 'Nama Rekanan is required' }}
                        render={({ field }) => (
                            <>  
                                <InputText {...field}  disabled/>
                                <small>{errors.nama_rekanan && <span>{errors.nama_rekanan.message}</span>}</small>
                            </>
                    )}/>
                </div>

                <div className="nama-pekerjaan-field flex flex-column gap-1 ">
                    <label htmlFor="nama_pekerjaan">Nama Pekerjaan</label>
                    <Controller
                        name="nama_pekerjaan"
                        control={control}
                        rules={{ required: 'Nama Pekerjaan is required' }}
                        render={({ field }) => (
                            <>
                                <InputText {...field} disabled/>
                                <small>{errors.nama_pekerjaan && <span>{errors.nama_pekerjaan.message}</span>}</small>
                            </>
                    )}/>
                </div>

                <div className="nilai-kontrak-field flex flex-column gap-1">
                    <label htmlFor="nilai_kontrak">Nilai Kontrak</label>
                    <Controller
                        name="nilai_kontrak"
                        control={control}
                        
                        rules={{ required: 'Nilai Kontrak is required' }}
                        render={({ field }) => (
                            <>
                                <InputNumber {...field} mode="currency" currency="IDR" locale="id-ID" disabled />
                                <small>{errors.nilai_kontrak && <span>{errors.nilai_kontrak.message}</span>}</small>
                            </>
                    )}/>
                </div>

                <div className="file-field flex flex-column gap-1">
                    <Controller 
                        name="dokumen"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Button type="button" label={file.dokumen}  severity="info" onClick={handleDownloadBeritaAcara} raised/>
                            </>
                        )}
                    />
                </div>

                {getValues().dokumen_bukti ? (
                    <div className="file-field flex flex-column gap-1">
                        <Controller 
                            name="dokumen_bukti"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Button type="button" label={file.dokumen_bukti} onClick={handleDownloadBuktiBayar} severity="info" raised/>
                                </>
                            )}
                        />
                    </div>
                ) : (
                    <Controller
                        name="dokumen_bukti"
                        control={control}
                        rules={{ required: 'File is required' }}
                        render={({ field }) => (
                            <>
                                <FileUpload pt={{
                                    basicButton : {
                                        className : 'w-full lg:w-3'
                                    }
                                }}
                                chooseLabel="Bukti Bayar"
                                value={field.value}
                                onSelect= { (e) => {
                                    const fileList = e.files[0];
                                    if (!fileList) {
                                        toast.current.show({ severity: 'error', summary: 'Error', detail: "File tidak boleh lebih dari 10 MB" });
                                        return;
                                    }
                                    setValue('dokumen_bukti', fileList);
                                    setFile(data => ({
                                        ...data,
                                        dokumen_bukti : e.files[0].name,  
                                    }))
                                    field.onChange(fileList);
                                }}
                                    mode="basic" accept=".zip,.pdf" maxFileSize={10000000}/>
                                <small>{errors.dokumen_bukti && <span>{errors.dokumen_bukti.message}</span>}</small>
                            </>
                        )}/>
                    )}
                
            </div>

            <div className="rigth-form p-2 flex  flex-column gap-3 flex-grow-1">
                <div className="tanngal-mulai-field flex flex-column gap-1">
                    <label htmlFor="tanngal-mulai">Tanggal Mulai</label>
                    <Controller
                        name="tanggal_mulai" 
                        control={control}
                        rules={{ required: 'Tanggal Mulai is required' }}
                        render={({ field }) => (
                            <>
                                <Calendar id="calendar-24h" {...field} showTime hourFormat="24" disabled={!!id}/>
                                <small>{errors.tanggal_mulai && <span>{errors.tanggal_mulai.message}</span>}</small>
                            </>
                    )}/>
                </div>
                <div className="tanngal-akhir-field flex flex-column gap-1">
                    <label htmlFor="tanngal-akhir">Tanggal Akhir</label>
                    <Controller
                        name="tanggal_akhir" 
                        control={control}
                        rules={{ required: 'Tanggal Akhir is required' }}
                        render={({ field }) => (
                            <>
                                <Calendar id="calendar-24h" value={field.value} onChange={(e) => setValue('tanggal_akhir', e.value)} showTime hourFormat="24" disabled={isEdit}/>
                                <small>{errors.tanggal_akhir && <span>{errors.tanggal_akhir.message}</span>}</small>
                            </>
                    )}/>
                </div>
                <div className="nilai-tagihan-field flex flex-column gap-1">
                    <label htmlFor="nilai_tagihan">Nilai Tagihan</label>
                    <Controller
                        name="nilai_tagihan"
                        control={control}
                        rules={{ required: 'Nilai Tagihan is required' }}
                        render={({ field }) => (
                            <>
                                <InputNumber {...field} mode="currency" currency="IDR" locale="id-ID" disabled={!!id} />
                                <small>{errors.nilai_tagihan && <span>{errors.nilai_tagihan.message}</span>}</small>
                            </>
                    )}/>
                </div>

                <div className="nama-renkanan-field flex flex-column gap-1">
                    <label htmlFor="status">Update</label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'status is required' }}
                        render={({ field }) => (
                            <>  
                                <InputText {...field} disabled/>
                                <small>{errors.status && <span>{errors.status.message}</span>}</small>
                            </>
                    )}/>
                </div>
                {file.upload ? (null) : (
                    <Button label="Submit" severity="success" />
                )}
                
            </div>
        </form>
    );
}


export default BuktiBayarForm;