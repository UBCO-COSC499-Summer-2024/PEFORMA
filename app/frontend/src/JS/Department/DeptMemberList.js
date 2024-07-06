import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { CreateSidebarDept, CreateTopbar } from '../common/commonImports.js';
import '../../CSS/Department/ServiceRoleList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import axios from 'axios';
import '../common/AuthContext.js';
import { useAuth } from '../common/AuthContext.js';

function DeptMemberList() {
	const { authToken, accountType } = useAuth();

	const navigate = useNavigate();

	return <div>asdsd</div>;
}

export default DeptMemberList;
