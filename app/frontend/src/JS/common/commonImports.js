import React from 'react';
import '../../CSS/common.css';
import SideBar from './SideBar.js';
import TopBar from './TopBar.js';

// Every page should import this file (Except maybe the home page)

function CreateSideBar({ sideBarType }) {
	return <SideBar sideBarType={sideBarType} />;
}

function CreateTopBar({ searchListType, onSearch }) {
	return <TopBar searchListType={searchListType} onSearch={onSearch} />;
}

export default CreateSideBar;
export {
	CreateTopBar,
};
