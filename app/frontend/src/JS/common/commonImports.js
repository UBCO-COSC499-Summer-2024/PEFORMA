import React from 'react';
import '../../CSS/common.css';
import SideBar from './SideBar.js';
import TopBar from './TopBar.js';

// Every page should import this file (Except maybe the home page)

function CreateSideBar({ sideBarType }) {
	return <SideBar sideBarType={sideBarType} />;
}

function CreateTopBar({ searchListType, onSearch, onTermChange }) {
    return <TopBar searchListType={searchListType} onSearch={onSearch} onTermChange={onTermChange} />;
}

export default CreateSideBar;
export {
	CreateTopBar,
};
