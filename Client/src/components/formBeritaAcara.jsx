import React, { useEffect, useState} from "react";
import { Button } from 'primereact/button';
import { Controller } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';

const FormBeritaAcara = ({toast, id, handleSubmit, setValue, control, errors, handleDownload, status }) => {
    const isEdit = !!id;

    return (
        <form className="w-11 flex flex-column lg:flex-row p-1 lg:p-3" onSubmit={handleSubmit} style={{ background: '#FFFFFF' }}>
            <div className="left-form p-2 flex flex-column gap-3 flex-grow-1">
                {/* Nama Rekanan */}
                <div className="nama-renkanan-field flex flex-column gap-1">
                    <label htmlFor="nama_rekanan">Nama Rekanan</label>
                    <Controller
                        name="nama_rekanan"
                        control={control}   
                        rules={{ required: 'Nama Rekanan is required' }}
                        render={({ field }) => (
                            <>  
                                <InputText {...field}  disabled={isEdit}/>
                                <small>{errors.nama_rekanan && <span>{errors.nama_rekanan.message}</span>}</small>
                            </>
                    )}/>
                </div>
                {/* Nama Pekerjaan */}
                <div className="nama-pekerjaan-field flex flex-column gap-1 ">
                    <label htmlFor="nama_pekerjaan">Nama Pekerjaan</label>
                    <Controller
                        name="nama_pekerjaan"
                        control={control}
                        rules={{ required: 'Nama Pekerjaan is required' }}
                        render={({ field }) => (
                            <>
                                <InputText {...field} disabled={isEdit} />
                                <small>{errors.nama_pekerjaan && <span>{errors.nama_pekerjaan.message}</span>}</small>
                            </>
                    )}/>
                </div>

                {/* Nilai Kontrak */}
                <div className="nilai-kontrak-field flex flex-column gap-1">
                    <label htmlFor="nilai_kontrak">Nilai Kontrak</label>
                    <Controller
                        name="nilai_kontrak"
                        control={control}
                        rules={{ required: 'Nilai Kontrak is required' }}
                        render={({ field }) => (
                            <>
                                <InputNumber value={field.value} onChange={(e) => setValue('nilai_kontrak', e.value)} mode="currency" currency="IDR" locale="id-ID" disabled={isEdit} />
                                <small>{errors.nilai_kontrak && <span>{errors.nilai_kontrak.message}</span>}</small>
                            </>
                    )}/>
                </div>

                {/* File Upload */}
                <div className="file-field flex flex-column gap-1">
                    {isEdit ? (
                        <Controller 
                            name="dokumen"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Button type="button" label={field.value} severity="info" onClick={handleDownload} raised/>
                                </>
                            )}
                        
                        />
                    ) : (
                        <Controller
                            name="dokumen"
                            control={control}
                            rules={{ 
                                required: 'File is required',
                            }}
                            render={({ field }) => (

                                
                                <>
                                    <FileUpload pt={{
                                        basicButton : {
                                            className : 'w-full lg:w-auto gap-2'
                                        }
                                        
                                    }}
                                    
                                    chooseLabel="Dokumen"
                                    value={field.value}
                                    onSelect= { (e) => {
                                        const fileList = e.files[0];
                                    
                                        if (!fileList) {
                                            toast.current.show({ severity: 'error', summary: 'Error', detail: "File tidak boleh lebih dari 10 MB" });
                                            return;
                                        }
                                        console.log(true);
                                        setValue('dokumen', fileList);
                                        field.onChange(fileList);
                                    }}
                                     mode="basic" accept=".zip,.pdf" maxFileSize={10000000} onError={(e) => {
                                        console.log("test");
                                     }}/>
                                    <small>{errors.dokumen && <span>{errors.dokumen.message}</span>}</small>
                                </>
                        )}/>
                    )}
                </div>
            </div>

            <div className="rigth-form p-2 flex  flex-column gap-3 flex-grow-1">
                {/* Tanggal Mulai*/}
                <div className="tanngal-mulai-field flex flex-column gap-1">
                    <label htmlFor="tanngal-mulai">Tanggal Mulai</label>
                    <Controller
                        name="tanggal_mulai" 
                        control={control}
                        rules={{ required: 'Tanggal Mulai is required' }}
                        render={({ field }) => (
                            <>
                                <Calendar id="calendar-24h" value={field.value} onChange={(e) => setValue('tanggal_mulai', e.value)} showTime hourFormat="24" disabled={isEdit}/>
                                <small>{errors.tanggal_mulai && <span>{errors.tanggal_mulai.message}</span>}</small>
                            </>
                    )}/>
                </div>

                {/* Tanggal Akhir */}
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

                {/* Nilai Tagihan */}
                <div className="nilai-tagihan-field flex flex-column gap-1">
                    <label htmlFor="nilai_tagihan">Nilai Tagihan</label>
                    <Controller
                        name="nilai_tagihan"
                        control={control}
                        rules={{ required: 'Nilai Tagihan is required' }}
                        render={({ field }) => (
                            <>
                                <InputNumber value={field.value} onChange={(e) => setValue('nilai_tagihan', e.value)} mode="currency" currency="IDR" locale="id-ID" disabled={isEdit} />
                                <small>{errors.nilai_tagihan && <span>{errors.nilai_tagihan.message}</span>}</small>
                            </>
                    )}/>
                </div>

                {/* Status (for editing only) */}
                {isEdit && (
                    <div className="nama-renkanan-field flex flex-column gap-1">
                        <label htmlFor="status">Update</label>
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: 'status is required' }}
                            render={({ field }) => (
                                <>  
                                    <InputText {...field} disabled={field.value === 'Ditolak' || field.value === 'Selesai'}/>
                                    <small>{errors.status && <span>{errors.status.message}</span>}</small>
                                </>
                        )}/>
                    </div>
                )}

                {/* Submit Button (for new entry) */}
                {!isEdit && <Button label="Success" severity="success" />}

                {/* Update Button (for editing) */}
                {(isEdit && status !== 'Selesai' && status !== 'Ditolak') && <Button label="Update" severity="success" /> }
            </div>
        </form>
    );
}


export default FormBeritaAcara;