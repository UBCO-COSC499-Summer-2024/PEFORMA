import React from "react";
import "../CSS/common.css";
import Sidebar from "./sidebar.js";
import Topbar from "./topbar.js";
import SidebarDept from "./sidebarDept.js";

// Every page should import this file (Except maybe the home page)

function CreateSidebar() {
    return (
    <Sidebar />          
    );
}

function CreateTopbar() {
    return (
    <Topbar />
    );
}

function CreateSidebarDept(){
    return (
    <SidebarDept />
    )
}

export default CreateSidebar;
export {CreateTopbar};
export {CreateSidebarDept};