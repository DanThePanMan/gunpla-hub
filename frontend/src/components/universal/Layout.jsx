import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col justify-start items-center gap-4 px-4 ">
                <NavBar />

                <div className="flex-1 min-w-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
