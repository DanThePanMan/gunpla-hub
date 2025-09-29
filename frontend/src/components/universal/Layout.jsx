import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const Layout = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto flex gap-4 px-4 py-4">
                {/* Left sidebar shown on large screens */}
                <LeftSidebar />

                {/* Main content area rendered by child routes */}
                <div className="flex-1 min-w-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
