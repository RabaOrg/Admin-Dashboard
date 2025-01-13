import React, { useState } from "react";
import { Icons } from "../icons/icon";
import Button from "./button";
import { useAuthStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa';

const SidebarComponent = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const navigate = useNavigate()
    const handleItemClick = (item, path) => {
        setActiveItem(item);
        toggleSidebar();
        navigate(path)
    };
    const { logOut } = useAuthStore()

    const menuItems = [
        { name: "Dashboard", icon: <Icons.Dashboard />, path: "/" },
        { name: "Product", icon: <Icons.Product />, path: "/product" },
        { name: "Customer", icon: <Icons.Customer />, path: "/customer" },
        { name: "Transactions", icon: <Icons.Transaction />, path: "/transaction" },
        { name: "Activations", icon: <Icons.Activation /> },
        { name: "Applications", icon: <Icons.Application /> },
        { name: "Repayment Plans", icon: <Icons.RepaymentPlan />, path: "/repayment-plan" },

    ];
    const [activeItem, setActiveItem] = useState(() => {
        const currentPath = location.pathname;
        const currentItem = menuItems.find((item) => item.path === currentPath);
        return currentItem ? currentItem.name : "Dashboard";
    });

    return (
        <div>
            <div
                className={`${isOpen ? "block" : "hidden"} fixed top-0 left-0 w-64 h-full bg-white z-50  md:block`}
            >
                <div className="flex flex-col p-5">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden mb-4 text-xl text-gray-700"
                    >
                        Close
                    </button>
                    <div>
                        <img src="/raba.png" alt="" />
                    </div>
                    <ul className="space-y-1 mt-14">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className={`flex items-center text-[#202224] font-medium text-sm space-x-2 px-4 py-3 rounded cursor-pointer ${activeItem === item.name
                                    ? "bg-[#0f5d30] text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                onClick={() => handleItemClick(item.name, item.path)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                    <hr className="mt-40" />
                    <div onClick={() => logOut()} className="flex gap-3 py-14 px-5">
                        <FaSignOutAlt className="mt-1" />
                        <p >Logout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarComponent
