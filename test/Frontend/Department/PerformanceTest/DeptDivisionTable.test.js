import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import DeptDivisionTable from '../../../../app/frontend/src/JS/Department/PerformanceImports/DeptDivisionTable';

jest.mock('../../../../app/frontend/src/JS/common/AuthContext');

describe('DeptDivisionTable', () => {
  let element;
  const mockCoursesData = [
    { "courseCode": "COSC 101", "rank": "A", "score": 92 },
    { "courseCode": "COSC 123", "rank": "C", "score": 72 },
    { "courseCode": "COSC 290", "rank": "D", "score": 65 },
    { "courseCode": "COSC 391", "rank": "D", "score": 62 }
  ];

  beforeEach(() => {
    render(
      <MemoryRouter>
        <DeptDivisionTable departmentName="Computer Science" courses={mockCoursesData} prefix="COSC" />
      </MemoryRouter>
    );
    element = document.getElementById('division-table-test-content');
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
    const year1Button = screen.getByRole('button', { name: '100' });
    userEvent.click(year1Button);

    await waitFor(() => {
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
    const year3Button = screen.getByRole('button', { name: '300' });
    userEvent.click(year3Button);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2);
    });
    expect(element).toHaveTextContent('COSC 391');
    expect(element).toHaveTextContent('D');
    expect(element).toHaveTextContent('62');
  });

  test('Testing filter courses by clicking all button', async () => {
    const allYearButton = screen.getByRole('button', { name: 'All' });
    userEvent.click(allYearButton);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(5);
    });
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
