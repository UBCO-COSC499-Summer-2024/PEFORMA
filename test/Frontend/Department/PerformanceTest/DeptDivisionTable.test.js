import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import DeptDivisionTable from '../../../../app/frontend/src/JS/Department/PerformanceImports/DeptDivisionTable';

describe('DeptDivisionTable', () => {
  let element;
  const mockCoursesData = [ // mock course data
    { "courseCode": "COSC 101", "rank": "A", "score": 92 },
    { "courseCode": "COSC 123", "rank": "C", "score": 72 },
    { "courseCode": "COSC 290", "rank": "D", "score": 65 },
    { "courseCode": "COSC 391", "rank": "D", "score": 62 }
  ];

  beforeEach(() => {
    render( // render DeptDivisionTable with paramater mock data, set prefix COSC to show COSC datas
      <MemoryRouter> 
        <DeptDivisionTable departmentName="Computer Science" courses={mockCoursesData} prefix="COSC" />
      </MemoryRouter>
    );
    element = document.getElementById('division-table-test-content'); // set element by id
  });

  test('Testing rendering cosc table with mock data', async () => {
    await waitFor(() => {
      expect(element).toHaveTextContent("COSC 101");
      expect(element).toHaveTextContent("COSC 123");
      expect(element).toHaveTextContent("COSC 290");
      expect(element).toHaveTextContent("COSC 391");

      expect(element).toHaveTextContent("A");
      expect(element).toHaveTextContent("C");
      expect(element).toHaveTextContent("D");
      expect(element).toHaveTextContent("D");

      expect(element).toHaveTextContent("92");
      expect(element).toHaveTextContent("72");
      expect(element).toHaveTextContent("65");
      expect(element).toHaveTextContent("62");
    });
  });

  test('Testing filter courses by clicking year number 100', async () => {
    const year1Button = screen.getByRole('button', { name: '100' }); // find 100 button (100 means first level year course)
    userEvent.click(year1Button); // simulate clikcing 100 button

    await waitFor(() => { // only 2 first year level course exists in mock data (1 is header) so row length should be 3
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
    });
    expect(element).toHaveTextContent('COSC 101');
    expect(element).toHaveTextContent('A');
    expect(element).toHaveTextContent('92');

    expect(element).toHaveTextContent('COSC 123');
    expect(element).toHaveTextContent('C');
    expect(element).toHaveTextContent('72');
  });

  test('Testing filter courses by clicking year number 300', async () => {
    const year3Button = screen.getByRole('button', { name: '300' }); // find 300 button (300 menas third level year course)
    userEvent.click(year3Button); // simulate clicking 300 button

    await waitFor(() => { // only 1 third year level course exists in mock data (1 is hearer) so row length should be 2
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2);
    });
    expect(element).toHaveTextContent('COSC 391');
    expect(element).toHaveTextContent('D');
    expect(element).toHaveTextContent('62');
  });

  test('Testing filter courses by clicking all button', async () => {
    const allYearButton = screen.getByRole('button', { name: 'All' }); // find All button (All means every level year course)
    userEvent.click(allYearButton); // simulate clikcing All button

    await waitFor(() => { // expect 5 rows to be in. 1 is header, 4 are from mock data
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(5);
    });

    // check the rendered data are from mock data
    expect(element).toHaveTextContent("COSC 101");
    expect(element).toHaveTextContent("COSC 123");
    expect(element).toHaveTextContent("COSC 290");
    expect(element).toHaveTextContent("COSC 391");

    expect(element).toHaveTextContent("A");
    expect(element).toHaveTextContent("C");
    expect(element).toHaveTextContent("D");
    expect(element).toHaveTextContent("D");

    expect(element).toHaveTextContent("92");
    expect(element).toHaveTextContent("72");
    expect(element).toHaveTextContent("65");
    expect(element).toHaveTextContent("62");

    // expect COSC 499 not to be rendered because COSC 499 is not in mock data
    expect(element).not.toHaveTextContent("COSC 499");
  });
});
