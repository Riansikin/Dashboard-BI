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
import updateStatusInvoice from "../services/updateStatusInvoice.jsx";
import getInvoice from "../services/getInvoice.jsx";
import ExportInvoice from "../services/exportinvoice.jsx";
import { encryptAES } from "../utils/cryptoUtils.js";

const Invoice = () =>{
    const [visible, setVisible] = useState(false);
    const { user } = useUser();
    const toast = useRef(null);
    const [namarekanan, setNamaRekanan] = useState('');
    const [listInvoice, setListInvoice] = useState([]);
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

    const handleUpdateProses = (data) => {
        window.location.href = `/invoice/${data}`;
    };


    const finalStatus = async (data, newStatus) => {
        try {
            const response = await updateStatusInvoice(data, user.email, newStatus);

            toast.current.show({ 
                severity: response.status, 
                summary: response.status === 'error' ? 'Error' : 'Success',
                detail: response.response 
            });

            setTimeout(() => {
                window.location.href = '/invoice';
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
        const NI_AES = encryptAES(rowData.nomor_invoice);
        if (user.role === 'Super Admin' || user.role === 'Admin') {
            if (rowData.status === 'Selesai') {
                items = [
                    {
                        label: 'Action',
                        items: [
                            {
                                label: 'Detail invoice',
                                icon: 'pi pi-reply',
                                command: () => {
                                    window.location.href = `/invoice/${NI_AES}`;
                                },
                            },
                        ],
                    },
                ];
            } else if (rowData.status === 'Ditolak') {
                return (
                    <Button 
                        label="Action" 
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
                                command: () => handleUpdateProses(NI_AES),
                            },
                        ],
                    },
                    {
                        label: 'Final',
                        items: [
                            {
                                label: 'Selesai',
                                icon: 'pi pi-verified',
                                command: () => finalStatus(NI_AES, 'Selesai'),
                            },
                            {
                                label: 'Tolak',
                                icon: 'pi pi-ban',
                                command: () => finalStatus(NI_AES, 'Ditolak'),
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
                        label: 'Action',
                        items: [
                            {
                                label: 'Detail invoice',
                                icon: 'pi pi-reply',
                                command: () => {
                                    window.location.href = `/invoice/${NI_AES}`;
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
                    ref={(el) => menuRefs.current[NI_AES] = el} 
                    id={`popup_menu_${NI_AES}`} 
                    popupAlignment="right" 
                />
                <Button 
                    label="Update" 
                    icon="pi pi-spin pi-cog" 
                    className="w-full"
                    onClick={(event) => menuRefs.current[NI_AES].toggle(event)}
                    aria-controls={`popup_menu_${NI_AES}`} 
                    aria-haspopup
                />
            </>
        );
    }

    const namarekananOnChange = (e) => {
        setNamaRekanan(e.target.value);
    };

    const filteredInovice = listInvoice.filter(item => {
        return item.nama_rekanan.toLowerCase().includes(namarekanan.toLowerCase());
    });

    const handleExprotInvoice = async () => {
        try {
            await ExportInvoice();
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
                    <InputText value={namarekanan} onChange={namarekananOnChange} placeholder="Search Nama Rekanan"  />
                </span>

                    <div  className="w-3 md:w-4 flex gap-2">
                        <Button label="Invoice" severity="Primary" icon="pi pi-plus" onClick={() => { window.location.href = '/invoice/new';}} className="w-6"/>
                {user.role !== 'Vendor' && (
                        <Button label="Export" severity="success" icon="pi pi-download" onClick={handleExprotInvoice} className="w-6"/>
                    )}
                    </div>
                
            </div>
        );
    }
    const header = renderHeader();

    useEffect(() => {
        getInvoice(setListInvoice);
    }, []);
    
    return (
        <div className="dashboard flex h-full max-w-full justify-content-between">
            <SideBar user={user} position={"Invoice"} />
            <SideBarRes user={user} position={"Invoice"} visible={visible} setVisible={setVisible}/>
            
            <main className="sm:w-8 md:w-7 lg:w-9 xl:w-10" style={{ background : '#F7F8FA'}}>
                <div className="w-full flex justify-content-center mt-0 sm:mt-3">
                    <DataTable  className="border-round-2xl w-full md:w-11" value={filteredInovice} header={header} paginator showGridlines rows={10} dataKey="nomor_invoice" emptyMessage="No customers found." >
                        <Column field="nomor_invoice" header="Nomor Invoice" style={{ minWidth: '12rem' }} />
                        <Column field="nama_pekerjaan" header="Nama Pekerjaan" style={{ minWidth: '12rem' }} />
                        <Column field="nama_rekanan" header="Nama Rekanan" style={{ minWidth: '12rem' }}  />
                        <Column field="status" header="Status" style={{ minWidth: '12rem' }} body={statusBodyTemplate}/>
                        <Column header="Mulai Kontrak"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateStart}/>
                        <Column header="Akhir Kontrak"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateEnd}/>
                        <Column header="Nilai Kontrak" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} />
                        <Column header="Update"  body={actionBodyTemplate} style={{ minWidth: '10rem' }} />                      
                    </DataTable>                    
                </div>
            </main>
            <Toast ref={toast} />
        </div>
    )
}

export default Invoice;