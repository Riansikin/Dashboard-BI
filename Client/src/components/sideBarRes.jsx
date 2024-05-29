import React, {useState, useEffect} from "react";
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import MenuSideBar from "./menuSideBar";

import { BeritaAcaraIcon, BuktiBayarIcon, DashboardIcon, LogoutIcon, SettingIcon } from "../assets/icon/icon";
import logOut from "../services/logout";

const SideBarRes = ({ user, position, visible, setVisible }) => {


    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        }
    }, []);

    const handleLogoutClick = () => {
        logOut();
    }

    const customHeader = (
        <div className="flex  max-w-full align-items-center gap-2">
            <Avatar image={userProfile} shape="circle" />

            <div className="w-10 max-w-full flex flex-column">
                <span className="font-bold surface-overlay  white-space-nowrap overflow-hidden text-overflow-ellipsis" >{user.user_name}</span>
                <span className="font-medium">{user.role}</span>
            </div>

        </div>
    );

    return (
        
        <Sidebar pt={{ content: { className: 'h-full flex flex-column' } }} header={customHeader} visible={visible} onHide={() => setVisible(false)} >
            <div className="sidebar-content w-full flex flex-column gap-2 align-items-center mb-auto">
                <MenuSideBar icon={DashboardIcon} text={"Dashboard"} href={"/"} status={position} />
                <MenuSideBar icon={DashboardIcon} text={"Invoice"} href={"/invoice"} status={position} />
                <MenuSideBar icon={BeritaAcaraIcon} text={"Berita Acara"} href={"/berita-acara"} status={position} />
                <MenuSideBar icon={BuktiBayarIcon} text={"Bukti Bayar"} href={"/bukti-bayar"} status={position} />
            </div>

            <div className=" w-full flex flex-column align-items-center mt-auto">
                {user.role === 'Super Admin' &&  ( 
                    <MenuSideBar icon={SettingIcon} text={"Setting"} href={"/setting"} status={position} />
                )}
                <button onClick={handleLogoutClick} className="w-9 cursor-pointer" style={{ background : 'transparent', border : 'none'}}>
                    <div className="w-full">
                        <div className={`menu-sidebar p-1 md:p-2 min-w-full flex justify-content-between`}>
                            <div className="w-3 md:w-3 xl:w-3 p-2 flex align-items-center justify-content-center">
                                <img className="w-full " src={LogoutIcon} alt="" />
                            </div>
                            <span className="text-base  md:text-xs lg:text-lg xl:text-lg w-8 flex align-items-center">Logout</span>
                        </div>
                    </div>
                </button>
            </div>
        </Sidebar>

      
    );
}


export default SideBarRes;