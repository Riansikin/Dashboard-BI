import React from "react";
import '../css/components/menusidebar.css'


const MenuSideBar = ({ icon, text, status, href }) => {
    return (
        <a href={href} className="w-9" >
            <div className={`w-full ${status === text ? 'active-menu' : ''}`}>
                <div className={`menu-sidebar p-1 md:p-2 min-w-full flex justify-content-between`}>
                    <div className="w-3 md:w-3 xl:w-3 p-2 flex align-items-center justify-content-center">
                        <img className="w-full " src={icon} alt="" />
                    </div>
                    <span className="text-base  md:text-xs lg:text-lg xl:text-lg w-8 flex align-items-center">{text}</span>
                </div>
            </div>
        </a>
    )
}

export default MenuSideBar;