import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import CreateSidebar, { CreateTopBar } from '../common/commonImports.js';
import DeptCoscTable from './PerformanceImports/DeptCoscTable.js';
import DeptMathTable from './PerformanceImports/DeptMathTable.js';
import DeptPhysTable from './PerformanceImports/DeptPhysTable.js';
import DeptStatTable from './PerformanceImports/DeptStatTable.js';
import DeptGoodBadBoard from './PerformanceImports/DeptGoodBadBoard.js';
import DeptBenchMark from './PerformanceImports/DeptBenchMark.js';

import '../../CSS/Department/PerformanceDepartmentPage.css';

function PerformanceDepartmentPage() {
	const navigate = useNavigate();
	const { authToken, accountType } = useAuth();
	useEffect(() => {
		const checkAuth = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			try {
				const numericAccountType = Number(accountType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/Dashboard');
				}
			} catch (error) {
				console.error('Failed to fetch account type', error);
				navigate('/Login');
			}
		};

		checkAuth();
	}, [authToken, accountType, navigate]);
	return (
		<div className="dp-container">
			<CreateSidebar sideBarType="Department" />

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
