import React from "react";
import "../CSS/common.css";
import Sidebar from "./sidebar.js";
import Topbar from "./topbar.js";
import SidebarDept from "./sidebarDept.js";
import TopbarFilter from "./topbarFilter.js";
import WorkHoursBarChart from "./workHoursBarChart.js"
import DeptPerformancePieChart from "./deptPerformancePolarChart.js"


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

function CreateTopBarFilter(){
    return(
        <TopbarFilter />
    );
}

function CreateSidebarDept(){
    return (
    <SidebarDept />
    )
}

function CreateWorkingBarChart(){
    return (
        <WorkHoursBarChart />
    )
}

function CreateScorePolarChart(){
    return (
        <DeptPerformancePieChart />
    )
}

export default CreateSidebar;
export {CreateTopbar, 
    CreateSidebarDept, 
    CreateTopBarFilter, 
    CreateWorkingBarChart, 
    CreateScorePolarChart
};