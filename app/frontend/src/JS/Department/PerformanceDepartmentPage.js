
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import { CreateSidebarDept,CreateTopbar } from '../commonImports.js';
import  CoscTable  from './PerformanceImports/CoscTable.js';
import  MathTable  from './PerformanceImports/MathTable.js';
import  PhysTable  from './PerformanceImports/PhysTable.js';
import  StatTable  from './PerformanceImports/StatTable.js';
import GoodBadBoard from './PerformanceImports/GoodBadBoard.js';
import BenchMark from './PerformanceImports/BenchMark.js';

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
					alert("No Access, Redirecting to instructor view");
					navigate("/Dashboard");
				}
			} catch (error) {
				console.error("Failed to fetch account type", error);
				navigate('/Login');
			}
		};

		checkAuth();
	}, [authToken, accountType, navigate]);
	return (
		<div className="dp-container">
			<CreateSidebarDept />

			<div className="container">
				<CreateTopbar />
				<div className='main'>
				<div className="performanceD-title">
          <h1>Department Performance Overview</h1>
				</div>

				<div className="division-top-table">

          <div className="division">
            <CoscTable />
					</div>

					<div className="division">
            <MathTable />
					</div>
          
				</div>

        <div className="division-mid-table">

          <div className="division">
            <PhysTable />
					</div>

					<div className="division">
            <StatTable />
					</div>

        </div>

				<div className="bottom-sectin">
					<div className="division">
						<BenchMark />
					</div>

					<div className="division">
						<GoodBadBoard />
					</div>
					
				</div>
				</div>
			</div>
		</div>
	);
}

export default PerformanceDepartmentPage;
