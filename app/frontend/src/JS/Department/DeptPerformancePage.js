import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import DeptDivisionTable from './PerformanceImports/DeptDivisionTable.js';
import DeptGoodBadBoard from './PerformanceImports/DeptGoodBadBoard.js';
import DeptBenchMark from './PerformanceImports/DeptBenchMark.js';
import { checkAccess, getCurrentMonthName } from '../common/utils.js';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from 'axios';
import { Download } from 'lucide-react';

import '../../CSS/Department/DeptPerformancePage.css';

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} hours ${remainingMinutes} minutes`;
}

function getReadableColumns(columns) {
    const columnMap = {
        courseCode: 'Course Code',
        rank: 'Rank',
        score: 'Score',
        name: 'Name',
        shortage: 'Shortage'
    };
    return columns.map(col => columnMap[col] || col.charAt(0).toUpperCase() + col.slice(1));
}


function mapDataWithIndex(data) {
    return data.map((item, index) => ({
        '#': index + 1,
        ...item
    }));
}

function addTable(doc, title, data, columns, yOffset, formatters = {}) {
    doc.setFontSize(16);
    doc.text(title, 14, yOffset);

    const rankedData = mapDataWithIndex(data);
    const readableColumns = getReadableColumns(columns);

    doc.autoTable({
        startY: yOffset + 10,
        head: [['#', ...readableColumns]],
        body: rankedData.map(item =>
            ['#', ...columns].map(col =>
                formatters[col] ? formatters[col](item[col]) : item[col]
            )
        ),
    });
    return doc.lastAutoTable.finalY + 20;
}

function exportAllToPDF(data) {
    const doc = new jsPDF();
    let yOffset = 10;

    yOffset = addTable(doc, 'Computer Science Courses', data.cosc, ['courseCode', 'rank', 'score'], yOffset);
    yOffset = addTable(doc, 'Mathematics Courses', data.math, ['courseCode', 'rank', 'score'], yOffset);
    yOffset = addTable(doc, 'Physics Courses', data.phys, ['courseCode', 'rank', 'score'], yOffset);
    yOffset = addTable(doc, 'Statistics Courses', data.stat, ['courseCode', 'rank', 'score'], yOffset);
    
    const currentMonth = getCurrentMonthName();
    yOffset = addTable(doc, `Benchmark - ${currentMonth}`, data.benchmark, ['name', 'shortage'], yOffset, { shortage: formatTime });
    
    doc.addPage();
    yOffset = 10;
    yOffset = addTable(doc, 'Top 5 Instructors', data.leaderboard.top, ['name', 'score'], yOffset);
    addTable(doc, 'Bottom 5 Instructors', data.leaderboard.bottom, ['name', 'score'], yOffset);

    doc.save('department_performance_overview.pdf');
}

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
        const fetchAllData = async () => {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken)
                const [cosc, math, phys, stat, benchmark, leaderboard] = await Promise.all([
                    axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 1 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                    axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 2 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                    axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 3 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                    axios.get(`http://localhost:3001/api/coursePerformance`, { params: { divisionId: 4 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                    axios.get(`http://localhost:3001/api/benchmark`, { params: { currMonth: new Date().getMonth() + 1 }, headers: { Authorization: `Bearer ${authToken.token}` } }),
                    axios.get(`http://localhost:3001/api/deptLeaderBoard`, { headers: { Authorization: `Bearer ${authToken.token}` } })
                ]);

                const sortedBenchmark = benchmark.data.people.sort((a, b) => b.shortage - a.shortage);
                const newData = {
                    cosc: cosc.data.courses,
                    math: math.data.courses,
                    phys: phys.data.courses,
                    stat: stat.data.courses,
                    benchmark: sortedBenchmark,
                    leaderboard: leaderboard.data
                };

                setAllData(newData);
            } catch (error) {
                console.error('Error fetching all data:', error);
            }
        };

        fetchAllData();
    }, [authToken, accountLogInType, navigate]);

    return (
        <div className="dp-container">
            <CreateSideBar sideBarType="Department" />

            <div className="container">
                <CreateTopBar />
                <div className="main">
                    <div className="performanceD-title">
                        <h1>Department Performance Overview</h1>
                        <button className='icon-button' onClick={() => exportAllToPDF(allData)}>
                            <Download size={20} color="black" />
                        </button>
                    </div>

                    <div className="division-top-table">
                        <div className="division">
                            <DeptDivisionTable departmentName="Computer Science" courses={allData.cosc} prefix="COSC" />
                        </div>

                        <div className="division">
                            <DeptDivisionTable departmentName="Mathematics" courses={allData.math} prefix="MATH" />
                        </div>
                    </div>

                    <div className="division-mid-table">
                        <div className="division">
                            <DeptDivisionTable departmentName="Physics" courses={allData.phys} prefix="PHYS" />
                        </div>

                        <div className="division">
                            <DeptDivisionTable departmentName="Statistics" courses={allData.stat} prefix="STAT" />
                        </div>
                    </div>

                    <div className="bottom-sectin">
                        <div className="division">
                            <DeptBenchMark benchmark={allData.benchmark} />
                        </div>

                        <div className="division">
                            <DeptGoodBadBoard leaderboard={allData.leaderboard} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerformanceDepartmentPage;