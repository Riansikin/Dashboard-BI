import React, {useState, useEffect,useRef} from "react";
import useUser from "../useUser.jsx";
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import SideBar from "../components/sideBar.jsx";
import SideBarRes from "../components/sideBarRes.jsx";
import getBeritaAcara from "../services/getBeritaAcara.jsx";
import updateStatusBeritaAcara from "../services/updateStatusBeritaAcara.jsx";
import ExportBeritaAcara from "../services/exportBeritaAcara.jsx";

const Dashboard = () => {
    const [visible, setVisible] = useState(false);
    const { user } = useUser();
    const toast = useRef(null);
    const [namarekanan, setNamaRekanan] = useState('');
    const [listBeritaAcara, setListBeritaAcara] = useState([]);
    const menuRight = useRef(null);
    const menuRefs = useRef({});
   
    const getSeverity = (status) => {
        switch (status) {
          case "Ditolak":
            return "danger";
    
          case "Selesai":
            return "success";
    
          case "Sedang diproses":
            return null;
    
          default:
            return null;
        }
    };

    const formatDate = (value) => {
        if (!value) return ""; 

        const d = new Date(value);

        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const formatCurrency = (value) => {
        return 'Rp.' + value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const dateBodyTemplateStart = (rowData) => {
        return formatDate(rowData.periode_penagihan.mulai);
    };

    const dateBodyTemplateEnd = (rowData) => {
        return formatDate(rowData.periode_penagihan.akhir);
    };

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.nilai_tagihan);
    };
    
    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const handleUpdateProses = (rowData) => {
        window.location.href = `/berita-acara/${rowData.nomor_kontrak}`;
    };
    
    const finalStatus = async (rowData, newStatus) => {
        try {
            const response = await updateStatusBeritaAcara(rowData.nomor_kontrak, user.email, newStatus);

            toast.current.show({ 
                severity: response.status, 
                summary: response.status === 'error' ? 'Error' : 'Success',
                detail: response.response 
            });

            setTimeout(() => {
                window.location.href = '/';
            }, 3000); 
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

    const actionBodyTemplate = (rowData) => {
        let items;

        if (user.role === 'Super Admin' || user.role === 'Admin') {
            if (rowData.status === 'Selesai') {
                items = [
                    {
                        label: 'Pembayaran',
                        items: [
                            {
                                label: 'Bukti Bayar',
                                icon: 'pi pi-reply',
                                command: () => {
                                    window.location.href = `/bukti-bayar/${rowData.nomor_kontrak}`;
                                },
                            },
                        ],
                    },
                ];
            } else if (rowData.status === 'Ditolak') {
                return (
                    <Button 
                        label="Update" 
                        icon="pi pi-spin pi-cog" 
                        className="w-full"
                        disabled
                    />
                );
            }else {
                items = [
                    {
                        label: 'Proses',
                        items: [
                            {
                                label: 'Update Proses',
                                icon: 'pi pi-reply',
                                command: () => handleUpdateProses(rowData),
                            },
                        ],
                    },
                    {
                        label: 'Final',
                        items: [
                            {
                                label: 'Selesai',
                                icon: 'pi pi-verified',
                                command: () => finalStatus(rowData, 'Selesai'),
                            },
                            {
                                label: 'Tolak',
                                icon: 'pi pi-ban',
                                command: () => finalStatus(rowData, 'Ditolak'),
                            },
                        ],
                    },
                ];
            }
        } else if (user.role === 'Vendor') {
            if(rowData.created_by !== user.email){
               
                return (
                    <>

                    </>
                );
            }
           

                
             if (rowData.status === 'Selesai' ) {
                
                items = [
                    {
                        label: 'Pembayaran',
                        items: [
                            {
                                label: 'Bukti Bayar',
                                icon: 'pi pi-reply',
                                command: () => {
                                window.location.href = `/bukti-bayar/${rowData.nomor_kontrak}`;
                                },
                            },
                        ],
                    },
                ];
            }else if(rowData.status === 'Ditolak') {

                return (
                    <>
                        <Button 
                            label="Ditolak" 
                            icon="pi pi-lock" 
                            className="w-full"
                            severity="danger" 
                            disabled
                        />
                    </>
                    
                )
            }else{
                return ( 
                    
                    <Button 
                        label="Dalam Proses" 
                        icon="pi pi-spin pi-cog" 
                        className="w-full"
                        disabled
                    />
             
                );
            }
        }

        return (
            <>
                <Menu 
                    pt={{ action: { className: 'gap-2' } }} 
                    model={items} 
                    popup 
                    ref={(el) => menuRefs.current[rowData.nomor_kontrak] = el} 
                    id={`popup_menu_${rowData.nomor_kontrak}`} 
                    popupAlignment="right" 
                />
                <Button 
                    label="Update" 
                    icon="pi pi-spin pi-cog" 
                    className="w-full"
                    onClick={(event) => menuRefs.current[rowData.nomor_kontrak].toggle(event)}
                    aria-controls={`popup_menu_${rowData.nomor_kontrak}`} 
                    aria-haspopup
                />
            </>
        );
    }
    const namarekananOnChange = (e) => {
        setNamaRekanan(e.target.value);
    };

    const filteredBeritaAcara = listBeritaAcara.filter(item => {
        return item.nama_rekanan.toLowerCase().includes(namarekanan.toLowerCase());
    });

    const handleExprotBeritaAcara = async () => {
        try {
            await ExportBeritaAcara();
        } catch (error) {
            console.error(error.message);
            toast.current.show({
                severity: 'error', 
                summary: 'Error', 
                detail: "Server Dalam Gangguan" 
            }); 
        }
    }
    const renderHeader = () => {
        return (
            <div className="w-full flex  gap-2 sm:gap-0  sm:justify-content-between align-items-center">
                <Button className="block sm:hidden"  icon="pi pi-bars" onClick={() => setVisible(true)} /> 
                <span className="p-input-icon-left relative">
                    
                    <i className="pi pi-search h-full flex align-items-center top-0"></i> 
                    <InputText value={namarekanan} onChange={namarekananOnChange} placeholder="Search Nama Rekanan" />
                </span>

                {user.role !== 'Vendor' && (
                    <Button label="Export" severity="success" icon="pi pi-download" onClick={handleExprotBeritaAcara} className="w-1 md:w-2"/>
                )}
                
            </div>
        );
    }

    const header = renderHeader();


    useEffect(() => {
        getBeritaAcara(setListBeritaAcara);
    }, []);

    return (
        <div className="dashboard flex h-full max-w-full justify-content-between">
            <SideBar user={user} position={"Dashboard"} />
            <SideBarRes user={user} position={"Dashboard"} visible={visible} setVisible={setVisible}/>
            
            <main className="sm:w-8 md:w-7 lg:w-9 xl:w-10" style={{ background : '#F7F8FA'}}>
                <div className="w-full flex justify-content-center mt-0 sm:mt-3">
                    <DataTable  className="border-round-2xl w-full md:w-11" value={filteredBeritaAcara} header={header} paginator showGridlines rows={10} dataKey="nomor_kontrak" emptyMessage="No customers found." >
                        <Column field="nomor_kontrak" header="Nomor Kontrak" style={{ minWidth: '12rem' }} />
                        <Column field="nama_pekerjaan" header="Nama Pekerjaan" style={{ minWidth: '12rem' }} />
                        <Column field="nama_rekanan" header="Nama Rekanan" style={{ minWidth: '12rem' }}  />
                        <Column field="status" header="Status" style={{ minWidth: '12rem' }} body={statusBodyTemplate}/>
                        <Column header="Mulai Kontrak"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateStart}/>
                        <Column header="Akhir Kontrak"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateEnd}/>
                        <Column header="Nilai Kontrak" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} />
                        <Column header="Action"  body={actionBodyTemplate} style={{ minWidth: '10rem' }} />                      
                    </DataTable>                    
                </div>
            </main>
            <Toast ref={toast} />
        </div>
    
    )
}


export default Dashboard;