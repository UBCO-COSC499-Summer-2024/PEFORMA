import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import DeptCoscTable from './PerformanceImports/DeptCoscTable.js';
import DeptMathTable from './PerformanceImports/DeptMathTable.js';
import DeptPhysTable from './PerformanceImports/DeptPhysTable.js';
import DeptStatTable from './PerformanceImports/DeptStatTable.js';
import DeptGoodBadBoard from './PerformanceImports/DeptGoodBadBoard.js';
import DeptBenchMark from './PerformanceImports/DeptBenchMark.js';
import { checkAccess } from '../common/utils.js';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from 'axios';
import { Download } from 'lucide-react';

import '../../CSS/Department/DeptPerformancePage.css';

function PerformanceDepartmentPage() {
	const navigate = useNavigate();
	const { authToken, accountLogInType } = useAuth();
	const [allData, setAllData] = useState({
		cosc: [],
		math: [],
		phys: [],
		stat: [],
		benchmark: [],
		leaderboard: { top: [], bottom: [] }
	});

	useEffect(() => {
		const checkAuth = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			try {
				checkAccess(accountLogInType, navigate, 'department');
			} catch (error) {
				console.error('Failed to fetch account type', error);
				navigate('/Login');
			}
		};

		checkAuth();
	}, [authToken, accountLogInType, navigate]);

	const fetchAllData = async () => {
		try {
			const [cosc, math, phys, stat, benchmark, leaderboard] = await Promise.all([
				axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 1 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
				axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 2 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
				axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 3 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
				axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 4 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
				axios.get(`http://localhost:3001/api/benchmark`, { params: { currMonth: new Date().getMonth() + 1 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
				axios.get(`http://localhost:3001/api/deptLeaderBoard`, { headers: { Authorization: `Bearer ${authToken.token}` } })
			]);

			setAllData({
				cosc: cosc.data.courses,
				math: math.data.courses,
				phys: phys.data.courses,
				stat: stat.data.courses,
				benchmark: benchmark.data.people,
				leaderboard: leaderboard.data
			});
		} catch (error) {
			console.error('Error fetching all data:', error);
		}
	};

	const exportAllToPDF = () => {
		const doc = new jsPDF();
		let yOffset = 10;

		const addTable = (title, data, columns) => {
			doc.setFontSize(16);
			doc.text(title, 14, yOffset);
			doc.autoTable({
				startY: yOffset + 10,
				head: [columns],
				body: data.map(item => columns.map(col => item[col])),
			});
			yOffset = doc.lastAutoTable.finalY + 20;
		};

		addTable('Computer Science Courses', allData.cosc, ['courseCode', 'rank', 'score']);
		addTable('Mathematics Courses', allData.math, ['courseCode', 'rank', 'score']);
		addTable('Physics Courses', allData.phys, ['courseCode', 'rank', 'score']);
		addTable('Statistics Courses', allData.stat, ['courseCode', 'rank', 'score']);
		addTable('Benchmark', allData.benchmark, ['name', 'shortage']);
		
		doc.addPage();
		yOffset = 10;
		addTable('Top 5 Instructors', allData.leaderboard.top, ['name', 'score']);
		addTable('Bottom 5 Instructors', allData.leaderboard.bottom, ['name', 'score']);

		doc.save('department_performance_overview.pdf');
	};

	return (
		<div className="dp-container">
			<CreateSideBar sideBarType="Department" />

			<div className="container">
				<CreateTopBar />
				<div className="main">
					<div className="performanceD-title">
						<h1>Department Performance Overview</h1>
						<button className='icon-button' onClick={() => { fetchAllData().then(exportAllToPDF); }}>
							<Download size={20} color="black" />
							Export All
						</button>
					</div>

					<div className="division-top-table">
						<div className="division">
							<DeptCoscTable />
						</div>

						<div className="division">
							<DeptMathTable />
						</div>
					</div>

					<div className="division-mid-table">
						<div className="division">
							<DeptPhysTable />
						</div>

						<div className="division">
							<DeptStatTable />
						</div>
					</div>

					<div className="bottom-sectin">
						<div className="division">
							<DeptBenchMark />
						</div>

						<div className="division">
							<DeptGoodBadBoard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PerformanceDepartmentPage;