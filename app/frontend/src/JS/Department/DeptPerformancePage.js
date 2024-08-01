import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import { Download } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import DeptDivisionTable from './PerformanceImports/DeptDivisionTable.js';
import DeptGoodBadBoard from './PerformanceImports/DeptGoodBadBoard.js';
import DeptBenchMark from './PerformanceImports/DeptBenchMark.js';
import { checkAccess, getCurrentMonthName, fetchWithAuth, getTermString, downloadCSV } from '../common/utils.js';
import '../../CSS/Department/DeptPerformancePage.css';

// helper function to format the time based on the left over minutes
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} hours ${remainingMinutes} minutes`;
}

function convertToCSV(data) {
    const array = [Object.keys(data[0])].concat(data);
    return array.map(it => {
        return Object.values(it).toString();
    }).join('\n');
}

function exportAllToCSV(data) {
    const termString = getTermString(20244); // will reaplce to curterm from db ######
    
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
        
    downloadCSV (allCSVData, `${termString} Performance Overview.csv`) // download csv with content and file name
}

function usePerformanceDepartmentData(currentTerm) {
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

    // fetch each division courses, benchmark and leaderboard and render it
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken);
                const [cosc, math, phys, stat, benchmark, leaderboard] = await Promise.all([ 
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=1`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=2`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=3`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/coursePerformance?divisionId=4`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/benchmark?currMonth=${new Date().getMonth() + 1}`, authToken, navigate),
                    fetchWithAuth(`http://localhost:3001/api/deptLeaderBoard`, authToken, navigate),
                ]);

                const sortedBenchmark = benchmark.people.sort((a, b) => b.shortage - a.shortage); // sort benchmark based on the shortage, desending order (from many to less)
                const newData = {
                    cosc: cosc.courses,
                    math: math.courses,
                    phys: phys.courses,
                    stat: stat.courses,
                    benchmark: sortedBenchmark,
                    leaderboard: leaderboard
                };

                setAllData(newData);
            } catch (error) {
                console.error('Error fetching all data:', error);
            }
        };

        fetchAllData();
    }, [authToken, accountLogInType, navigate, currentTerm]);

    return allData;
}

function PerformanceDepartmentPage() {
    const [currentTerm, setCurrentTerm] = useState(null);
    const allData = usePerformanceDepartmentData(currentTerm);

    const handleTermChange = (newTerm) => {
        setCurrentTerm(newTerm);
        console.log(currentTerm);
    };

    return (
        <div className="dp-container">
            <CreateSideBar sideBarType="Department" /> 

            <div className="container">
                <CreateTopBar onTermChange={handleTermChange} />
                <div className="main">
                    <div className="performanceD-title">
                        <h1>Department Performance Overview</h1>
                        <button className='icon-button' data-testid="download-button" onClick={() => exportAllToCSV(allData)}>
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