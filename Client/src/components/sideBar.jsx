import React, {useState, useEffect} from "react";
import { Avatar } from 'primereact/avatar';
import MenuSideBar from "./menuSideBar";
import { BeritaAcaraIcon, BuktiBayarIcon, DashboardIcon, LogoutIcon, SettingIcon } from "../assets/icon/icon";
import logOut from "../services/logout";


const sideBarLarge = ({ user, position }) => {
    
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
    return (
        <div className="sidebar h-full hidden sm:block w-4 md:w-5 lg:w-3 xl:w-2 p-2" style={{ background : '#FFFFFF'}}>
            <div className="sidebar-container h-full w-full flex flex-column ">
                <div className="profile flex flex-column align-items-center mt-2 mb-4">
                    <Avatar className="w-9 h-auto" image={userProfile} pt={{ image: { className: 'w-full h-auto' } }} shape="circle" />
                    <div className="w-full text-center mt-2" style={{ color: 'black' }}>
                        <h1 className="text-base sm:text-sm md:text-4xl lg:text-4xl xl:text-4xl">{user.user_name}</h1>
                        <span className="text-sm">{user.role}</span>
                    </div>
                </div>
                <div className="w-full flex flex-column h-full min-h-screen">
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
                        
                        <button onClick={handleLogoutClick} className="w-9 cursor-pointer" style={{ background: 'transparent', border: 'none' }}>
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
                </div>

            </div>
        </div>
    )
}


export default sideBarLarge;