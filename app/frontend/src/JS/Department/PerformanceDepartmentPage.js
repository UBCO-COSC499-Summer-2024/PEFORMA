import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../CSS/Department/PerformanceDepartmentPage.css';
import { CreateSidebarDept,CreateTopbar } from '../commonImports.js';
import  CoscTable  from './PerformanceImports/CoscTable.js';
import  MathTable  from './PerformanceImports/MathTable.js';
import  PhysTable  from './PerformanceImports/PhysTable.js';
import  StatTable  from './PerformanceImports/StatTable.js';
import GoodBadBoard from './PerformanceImports/GoodBadBoard.js';

function PerformanceDepartmentPage() {
	const params = new URLSearchParams(window.location.search);
	const ubcid = params.get('ubcid');

	const initProfile = {
		roles: [],
		teachingAssignments: [{}],
	};
	const [profile, setProfile] = useState(initProfile);

	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get('http://localhost:3000/profileSample.json?ubcid=' + ubcid); //replace it to api
			return res.data;
		};
		fetchData().then((res) => setProfile(res));
	}, []);

	return (
		<div className="dashboard-container">
			<CreateSidebarDept />

			<div className="container">
				<CreateTopbar />
				<div className="performanceD-title">
          <h2>Department Performance Overview</h2>
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

				<div className="bottom-section">
					<div className="benchmark-section">
					</div>

					<div className="people-section">
						<GoodBadBoard />
					</div>
					
				</div>
			</div>
		</div>
	);
}

export default PerformanceDepartmentPage;
