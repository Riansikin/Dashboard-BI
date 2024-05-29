import React, { useEffect, useRef, useState } from "react";
import useUser from "../useUser";
import { Toast } from "primereact/toast";
import SideBar from "../components/sideBar.jsx";
import SideBarRes from "../components/sideBarRes.jsx";
import ForbiddenPage from "./Forbidden.jsx";
import getAllUsers from "../services/getAllUser.jsx";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from 'primereact/menu';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import ChangeRole from "../services/changeRole.jsx";


export default function Setting (){
    const [visible, setVisible] = useState(false);
    const [ listUser , setListUser ] = useState([]);
    const [userEmail , setUserEmail ] = useState('');
    const { user } = useUser();
    const menuRefs = useRef({});
    const toast = useRef(null);

    const formatDate = (value) => {
        if (!value) return ""; 

        const d = new Date(value);

        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const dateBodyTemplateCreate = (rowData) => {
        return formatDate(rowData.created_at);
    };

    const dateBodyTemplateUpdate = (rowData) => {
        return formatDate(rowData.updated_at);
    };


    const changeRole = async (email, newRole) => {
        try {
            const response = await ChangeRole(email, newRole);

            toast.current.show({ 
                severity: response.status, 
                summary: response.status === 'error' ? 'Error' : 'Success',
                detail: response.response 
            });

            setTimeout(() => {
                window.location.href = '/setting';
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
        if(rowData.role === 'Admin'){ 
            items = [
                {
                    label : 'Change Role To :',
                    items : [
                        {
                            label : 'Super Admin',
                            icon: 'pi pi-user-plus',
                            command : () => changeRole(rowData.email, "Super Admin"),
                        },
                        {
                            label : 'Vendor',
                            icon: 'pi pi-user-minus',
                            command : () => changeRole(rowData.email, "Vendor"),
                        },
                        
                    ],
                },
            ];
        }else if ( rowData.role === 'Vendor'){
            items = [
                {
                    label : 'Change Role To :',
                    items : [
                        {
                            label : 'Super Admin',
                            icon: 'pi pi-user-plus',
                            command : () => changeRole(rowData.email, "Super Admin"),
                        },
                        {
                            label : 'Admin',
                            icon: 'pi pi-user-plus',
                            command : () => changeRole(rowData.email, "Admin"),
                        },
                        
                    ]
                }
            ];
        }else{
            return (
                <Button 
                    label="Lock" 
                    icon="pi pi-lock" 
                    className="w-full"
                    disabled
                />
            )
        }


        return (
            <>
                <Menu 
                    pt={{ action: { className: 'gap-2' } }} 
                    model={items} 
                    popup 
                    ref={(el) => menuRefs.current[rowData.email] = el} 
                    id={`popup_menu_${rowData.email}`} 
                    popupAlignment="right" 
                />
                <Button 
                    label="Action" 
                    icon="pi pi-spin pi-cog" 
                    className="w-full"
                    onClick={(event) => menuRefs.current[rowData.email].toggle(event)}
                    aria-controls={`popup_menu_${rowData.email}`} 
                    aria-haspopup
                />
            </>
        )
    }


    const useremailOnChange = (e) => {
        setUserEmail(e.target.value);
    }
    const renderHeader = () => {
        return (
            <div className="w-full flex  gap-2 sm:gap-0  sm:justify-content-between align-items-center">
                <Button className="block sm:hidden"  icon="pi pi-bars" onClick={() => setVisible(true)} /> 
                <span className="p-input-icon-left relative"> 
                    <i className="pi pi-search h-full flex align-items-center top-0"></i> 
                    <InputText value={userEmail} onChange={useremailOnChange} placeholder="Search Email" />
                </span>
            </div>
        );
    }
    const filteredUserEmail = listUser.filter(item => {
        return item.email.toLowerCase().includes(userEmail.toLowerCase());
    });

    const header = renderHeader();


    useEffect(() => {
        getAllUsers(setListUser);
    }, []);

    
    if(user.role !== 'Super Admin') {
        return (
            <>
                <ForbiddenPage />
            </>
        );
    }

    
    return (
        <>
            <div className="setting flex h-full w-full">
                <SideBar user={user} position={"setting"} />
                <SideBarRes user={user} position={"setting"} visible={visible} setVisible={setVisible}/>
                
                <main className="flex-grow-1" style={{ background : '#F7F8FA'}}>
                    <div className="w-full max-w-full flex justify-content-center ">
                        <DataTable  className="border-round-2xl max-w-full" value={filteredUserEmail} header={header} paginator showGridlines rows={10} dataKey="email" emptyMessage="No customers found." >
                            <Column field="email" header="Email" style={{ minWidth: '12rem' }} />
                            <Column field="user_name" header="User Name" style={{ minWidth: '12rem' }} />
                            <Column field="role" header="Role" style={{ minWidth: '12rem' }} />
                            <Column header="Dibuat Tanggal"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateCreate}/>
                            <Column header="Terakhir Update"  dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplateUpdate}/>
                            <Column header="Action"  body={actionBodyTemplate} style={{ minWidth: '10rem' }} />  
                        </DataTable> 
                    </div>
                </main>


                <Toast ref={toast} />
            </div>

        </>
    )


}