import React from 'react';
import '../../CSS/common.css';
import Sidebar from './sidebar.js';
import TopBar from './TopBar.js';
import SidebarDept from './sidebarDept.js';
import InsWorkHoursBarChart from '../Instructor/InsPerformanceImports/InsWorkHoursBarChart.js';
import InsPerformancePolarChart from '../Instructor/InsPerformanceImports/InsPerformancePolarChart.js';
import InsLeaderBoard from '../Instructor/InsPerformanceImports/InsLeaderBoard.js';
import InsServiceHoursProgressChart from '../Instructor/InsPerformanceImports/InsServiceHoursProgressChart.js';

// Every page should import this file (Except maybe the home page)

function CreateSidebar({ sideBarType }) {
	return <Sidebar sideBarType={sideBarType} />;
}

function CreateTopBar({ searchListType, onSearch }) {
	return <TopBar searchListType={searchListType} onSearch={onSearch} />;
}

function CreateSidebarDept() {
	return <SidebarDept />;
}

function CreateWorkingBarChart() {
	return <InsWorkHoursBarChart />;
}

function CreateScorePolarChart() {
	return <InsPerformancePolarChart />;
}

function CreateLeaderboardChart() {
	return <InsLeaderBoard />;
}

function CreateProgressChart() {
	return <InsServiceHoursProgressChart />;
}

export default CreateSidebar;
export {
	CreateTopBar,
	CreateSidebarDept,
	CreateWorkingBarChart,
	CreateScorePolarChart,
	CreateLeaderboardChart,
	CreateProgressChart,
};
