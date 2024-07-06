import React from 'react';
import '../../CSS/common.css';
import Sidebar from './sidebar.js';
import Topbar from './topbar.js';
import SidebarDept from './sidebarDept.js';
import TopSearchBar  from './topbarFilter.js';
import InsWorkHoursBarChart from '../Instructor/InsPerformanceImports/InsWorkHoursBarChart.js';
import InsPerformancePolarChart from '../Instructor/InsPerformanceImports/InsPerformancePolarChart.js';
import InsLeaderBoard from '../Instructor/InsPerformanceImports/InsLeaderBoard.js';
import InsServiceHoursProgressChart from '../Instructor/InsPerformanceImports/InsServiceHoursProgressChart.js';

// Every page should import this file (Except maybe the home page)

function CreateSidebar() {
	return <Sidebar />;
}

function CreateTopbar() {
	return <Topbar />;
}

function CreateTopSearchBar({ searchListType, onSearch }) {
	return <TopSearchBar searchListType={searchListType} onSearch={onSearch} />;
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
	CreateTopbar,
	CreateSidebarDept,
	CreateTopSearchBar,
	CreateWorkingBarChart,
	CreateScorePolarChart,
	CreateLeaderboardChart,
	CreateProgressChart,
};
