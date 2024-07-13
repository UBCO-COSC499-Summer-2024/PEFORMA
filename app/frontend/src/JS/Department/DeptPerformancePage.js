import React, { useEffect } from 'react';
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


import '../../CSS/Department/DeptPerformancePage.css';

function PerformanceDepartmentPage() {
	const navigate = useNavigate();
	const { authToken, accountLogInType } = useAuth();
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
	return (
		<div className="dp-container">
			<CreateSideBar sideBarType="Department" />

			<div className="container">
				<CreateTopBar />
				<div className="main">
					<div className="performanceD-title">
						<h1>Department Performance Overview</h1>
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