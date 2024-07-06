import React from 'react';
import '../../CSS/common.css';
import SideBar from './SideBar.js';
import TopBar from './TopBar.js';
import InsWorkHoursBarChart from '../Instructor/InsPerformanceImports/InsWorkHoursBarChart.js';
import InsPerformancePolarChart from '../Instructor/InsPerformanceImports/InsPerformancePolarChart.js';
import InsLeaderBoard from '../Instructor/InsPerformanceImports/InsLeaderBoard.js';
import InsServiceHoursProgressChart from '../Instructor/InsPerformanceImports/InsServiceHoursProgressChart.js';

// Every page should import this file (Except maybe the home page)

function CreateSideBar({ sideBarType }) {
	return <SideBar sideBarType={sideBarType} />;
}

function CreateTopBar({ searchListType, onSearch }) {
	return <TopBar searchListType={searchListType} onSearch={onSearch} />;
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

export default CreateSideBar;
export {
	CreateTopBar,
	CreateWorkingBarChart,
	CreateScorePolarChart,
	CreateLeaderboardChart,
	CreateProgressChart,
};
