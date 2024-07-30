import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptBenchMark from '../../../../app/frontend/src/JS/Department/PerformanceImports/DeptBenchMark';
import { MemoryRouter } from "react-router-dom";

// Date.getMonth() starts from 0 index (0 = January) so 6 means July 
const mockCurrentDate = new Date(2024, 6);
global.Date = jest.fn(() => mockCurrentDate);

describe('DeptBenchMark', () => {
  let element; 
  const mockBenchmarkData = [ // mock data
    { "name": "Kevin Kim", "shortage": 30 },
    { "name": "Asen Lee", "shortage": 148 },
    { "name": "Minsuk Oh", "shortage": 1 },
    { "name": "Hyunji", "shortage": 60 }
  ];

	beforeEach(() => {
    render( // render DeptBenchMark with parameter using mock data
      <MemoryRouter>
        <DeptBenchMark benchmark={mockBenchmarkData} />
      </MemoryRouter>
    );
    element = document.getElementById('benchmark-test-content'); // set element with id
	});

	test('Testing header components of current month', () => {
    expect(element).toHaveTextContent("Benchmark");
    expect(element).toHaveTextContent("Current Month: July");
	});

  test('Testing rendering with mock data', () => {
    expect(element).toHaveTextContent("Kevin Kim");
    expect(element).toHaveTextContent("Minsuk Oh");
    expect(element).toHaveTextContent("Asen Lee");
    expect(element).toHaveTextContent("Hyunji");

    expect(element).toHaveTextContent("30 Minutes");
    expect(element).toHaveTextContent("1 Minute");
    expect(element).toHaveTextContent("2 Hours 28 Minutes");
    expect(element).toHaveTextContent("1 Hour");
  });
});
