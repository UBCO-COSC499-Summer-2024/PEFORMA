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
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        try {
            const [cosc, math, phys, stat, benchmark, leaderboard] = await Promise.all([
                axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 1 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 2 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 3 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 4 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                axios.get(`http://localhost:3001/api/benchmark`, { params: { currMonth: new Date().getMonth() + 1 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                axios.get(`http://localhost:3001/api/deptLeaderBoard`, { headers: { Authorization: `Bearer ${authToken.token}` } })
            ]);

            const newData = {
                cosc: cosc.data.courses,
                math: math.data.courses,
                phys: phys.data.courses,
                stat: stat.data.courses,
                benchmark: benchmark.data.people,
                leaderboard: leaderboard.data
            };

            setAllData(newData);
            setIsLoading(false);
            return newData;
        } catch (error) {
            console.error('Error fetching all data:', error);
            setIsLoading(false);
        }
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        return `${hours} hours ${remainingMinutes} minutes`;
    };

    const exportAllToPDF = (data) => {
        const doc = new jsPDF();
        let yOffset = 10;

        const addTable = (title, data, columns, formatters = {}) => {
            doc.setFontSize(16);
            doc.text(title, 14, yOffset);
            
            const rankedData = data.map((item, index) => ({
                '#': index + 1,
                ...item
            }));

            const readableColumns = columns.map(col => {
                switch(col) {
                    case 'courseCode': return 'Course Code';
                    case 'rank': return 'Rank';
                    case 'score': return 'Score';
                    case 'name': return 'Name';
                    case 'shortage': return 'Shortage';
                    default: return col.charAt(0).toUpperCase() + col.slice(1);
                }
            });

            doc.autoTable({
                startY: yOffset + 10,
                head: [['#', ...readableColumns]],
                body: rankedData.map(item => 
                    ['#', ...columns].map(col => 
                        formatters[col] ? formatters[col](item[col]) : item[col]
                    )
                ),
            });
            yOffset = doc.lastAutoTable.finalY + 20;
        };

        addTable('Computer Science Courses', data.cosc, ['courseCode', 'rank', 'score']);
        addTable('Mathematics Courses', data.math, ['courseCode', 'rank', 'score']);
        addTable('Physics Courses', data.phys, ['courseCode', 'rank', 'score']);
        addTable('Statistics Courses', data.stat, ['courseCode', 'rank', 'score']);
        
        // Sort benchmark data by shortage in descending order
        const sortedBenchmark = [...data.benchmark].sort((a, b) => b.shortage - a.shortage);
        addTable('Benchmark', sortedBenchmark, ['name', 'shortage'], { shortage: formatTime });
        
        doc.addPage();
        yOffset = 10;
        addTable('Top 5 Instructors', data.leaderboard.top, ['name', 'score']);
        addTable('Bottom 5 Instructors', data.leaderboard.bottom, ['name', 'score']);

        doc.save('department_performance_overview.pdf');
    };

    const handleExport = async () => {
        setIsLoading(true);
        const data = await fetchAllData();
        if (data) {
            exportAllToPDF(data);
        }
        setIsLoading(false);
    };

    return (
        <div className="dp-container">
            <CreateSideBar sideBarType="Department" />

            <div className="container">
                <CreateTopBar />
                <div className="main">
                    <div className="performanceD-title">
                        <h1>Department Performance Overview</h1>
                        <button className='icon-button' onClick={handleExport} disabled={isLoading}>
                            <Download size={20} color="black" />
                            {isLoading ? 'Loading...' : ''}
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