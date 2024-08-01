import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import { Download } from 'lucide-react';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import DeptDivisionTable from './PerformanceImports/DeptDivisionTable.js';
import DeptBenchMark from './PerformanceImports/DeptBenchMark.js';
import DeptGoodBadBoard from './PerformanceImports/DeptGoodBadBoard.js';
import { checkAccess, getCurrentMonthName, fetchWithAuth, getTermString, downloadCSV } from '../common/utils.js';
import '../../CSS/Department/DeptPerformancePage.css';

// helper function to format the time based on the left over minutes
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} hours ${remainingMinutes} minutes`;
}

function convertToCSV(data) {
    // if data is empty then return empty string
    if (!data || data.length === 0 || !data[0]) { 
        return '';
    }
    const array = [Object.keys(data[0])].concat(data);
    return array.map(it => {
        return Object.values(it).toString();
    }).join('\n');
}

function exportAllToCSV(data, currentTerm) {
    // create csv files for each tables
    const coscCSV = convertToCSV(data.cosc);
    const mathCSV = convertToCSV(data.math);
    const physCSV = convertToCSV(data.phys);
    const statCSV = convertToCSV(data.stat);
    const benchmarkCSV = convertToCSV(data.benchmark.map(item => ({ name: item.name, shortage: formatTime(item.shortage) })));
    const topInstructorsCSV = convertToCSV(data.leaderboard.top);
    const bottomInstructorsCSV = convertToCSV(data.leaderboard.bottom);

    // make into one csv data file in order to generate the table and download
    const allCSVData = `Computer Science Courses:\n${coscCSV}\n\n` + 
        `Mathematics Courses:\n${mathCSV}\n\n` +
        `Physics Courses:\n${physCSV}\n\n` +
        `Statistics Courses:\n${statCSV}\n\n` +
        `Benchmark - ${getCurrentMonthName()}:\n${benchmarkCSV}\n\n` +
        `Top 5 Instructors:\n${topInstructorsCSV}\n\n` +
        `Bottom 5 Instructors:\n${bottomInstructorsCSV}`;
        
    downloadCSV (allCSVData, `${currentTerm} Performance Overview.csv`) // download csv with content and file name
}


function usePerformanceDepartmentData() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [allData, setAllData] = useState({
        cosc: [],
        math: [],
        phys: [],
        stat: [],
        benchmark: [],
        leaderboard: { top: [], bottom: [] }
    });
    const [currentTerm, setCurrentTerm] = useState(''); // state for setting current term for csv import

    // fetch each division courses, benchmark and leaderboard and render it
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken); // check access with accountLogInType and authToken
                const [cosc, math, phys, stat, benchmark, leaderboard] = await Promise.all([
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=1`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=2`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=3`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=4`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/benchmark?currMonth=${new Date().getMonth() + 1}`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/deptLeaderBoard`, authToken, navigate),
                ]);
                setCurrentTerm(getTermString(cosc.currentTerm)); // set currentTerm using getTermString, 20244 => 2024 Summer Term 2
                const sortedBenchmark = benchmark.people.sort((a, b) => b.shortage - a.shortage); // sort benchmark based on the shortage, desending order (from many to less)
                const newData = {
                    cosc: cosc.courses,
                    math: math.courses,
                    phys: phys.courses,
                    stat: stat.courses,
                    benchmark: sortedBenchmark,
                    leaderboard: leaderboard
                };
                setAllData(newData); // set all relative datas into allData
            } catch (error) {
                console.error('Error fetching all data:', error);
            }
        };
        fetchAllData();
    }, [authToken, accountLogInType, navigate]);

    return { // return allData to render, currentTerm to exportToCSV
        allData, 
        currentTerm
    };
}

// main component to render each tables data
function PerformanceDepartmentPage() {
    const {
        allData, 
        currentTerm
    } = usePerformanceDepartmentData(); // use custom hook for datas

    return (
        <div className="dp-container">
            <SideBar sideBarType="Department" /> 

            <div className="container">
                <TopBar />
                <div className="main">
                    <div className="performanceD-title">
                        <h1>Department Performance Overview</h1>
                        <button className='icon-button' onClick={() => exportAllToCSV(allData, currentTerm)}>
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