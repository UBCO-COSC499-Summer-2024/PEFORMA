import React from "react";
import "../CSS/common.css";
import Sidebar from "./sidebar.js";
import Topbar from "./topbar.js";

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

export default CreateSidebar;
export {CreateTopbar}