import React from "react";
import "../CSS/common.css";
import Sidebar from "./sidebar.js";
import Topbar from "./topbar.js";
import SidebarDept from "./sidebarDept.js";
import {TopSearchBarIns, TopSearchBarDept} from "./topbarFilter.js";
import WorkHoursBarChart from "./workHoursBarChart.js"
import DeptPerformancePieChart from "./deptPerformancePolarChart.js"
import LeaderBoard from "./leaderBoard.js"
import ServiceHoursProgressChart from "./ServiceHoursProgressChart.js";


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

function CreateTopSearchbarIns({ onSearch }){
    return(
        <TopSearchBarIns onSearch={ onSearch } />
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

function CreateLeaderboardChart(){
    return (
        <LeaderBoard />
    )
}

function CreateProgressChart(){
    return (
        <ServiceHoursProgressChart />
    )
}
function CreateTopSearchBarDept({ onSearch }){
    return (
        <TopSearchBarDept onSearch={ onSearch }/>
    )
}

export default CreateSidebar;
export {CreateTopbar, 
    CreateSidebarDept, 
    CreateTopSearchbarIns, 
    CreateWorkingBarChart, 
    CreateScorePolarChart,
    CreateLeaderboardChart,
    CreateProgressChart,
    CreateTopSearchBarDept
};