import { fireEvent, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptTeachingAssignmentDetail from '../../../app/frontend/src/JS/Department/DeptTeachingAssignmentDetail';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mocking axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: jest.fn(), // mocking useLocation to receive state
}));

describe('DeptTeachingAssignmentDetail', () => {
	let element;
	// set beforeEach function to set up every run of test
	beforeEach(async () => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' }, // mocking authToken
		});
		useLocation.mockReturnValue({ // mocking data receiving from useLocation
			state: {
				selectedDivision: 'computer-science',
				courses: [
					{
						courseCode: 'COSC 109',
						courseName: 'Introduction to Computer Science',
						id: 1,
						instructor: 'John Doe',
						ubcid: 123,
						email: 'john.doe@example.com',
						division: 'computer-science',
					},
					{
						courseCode: 'COSC 210',
						courseName: 'Data Structures',
						id: 2,
						instructor: 'Jane Smith',
						ubcid: 456,
						email: 'jane.smith@example.com',
						division: 'computer-science',
					},
					{
						courseCode: 'MATH 101',
						courseName: 'Calculus I',
						id: 3,
						instructor: 'Alice Johnson',
						ubcid: 789,
						email: 'alice.johnson@example.com',
						division: 'mathematics',
					},
					{
						courseCode: 'PHYS 201',
						courseName: 'Physics I',
						id: 4,
						instructor: 'Bob Smith',
						ubcid: 1011,
						email: 'bob.smith@example.com',
						division: 'physics',
					},
				],
				professors: [
					{
						instructor: 'John Doe',
						ubcid: 123,
						email: 'john.doe@example.com',
						division: 'computer-science',
					},
					{
						instructor: 'Jane Smith',
						ubcid: 456,
						email: 'jane.smith@example.com',
						division: 'computer-science',
					},
					{
						instructor: 'Alice Johnson',
						ubcid: 789,
						email: 'alice.johnson@example.com',
						division: 'mathematics',
					},
					{
						instructor: 'Bob Smith',
						ubcid: 1011,
						email: 'bob.smith@example.com',
						division: 'physics',
					},
				],
			},
		});
		await act(async () => {
			render( // render DeptTeachingAssignmentDetail page
				<MemoryRouter> 
					<DeptTeachingAssignmentDetail />
				</MemoryRouter>
			);
		});
		element = document.getElementById('detail-teaching-assignment-test-content'); // set element get by id from page
	});

	test('Testing rendering mock data in detail page using state', async () => {
		// cosc 109, 210 are cosc courses, should be present with following professors
		expect(element).toHaveTextContent('COSC 109');
		expect(element).toHaveTextContent('COSC 210');
		expect(element).toHaveTextContent('John Doe');
		expect(element).toHaveTextContent('Jane Smith');

		// other courses besides COSC, should not be present
		expect(element).not.toHaveTextContent('MATH 101');
		expect(element).not.toHaveTextContent('PHYS 201');
		expect(element).not.toHaveTextContent('Alice Johnson');
		expect(element).not.toHaveTextContent('Bob Smith');
	});
	test('Testing switching to different division', async () => {
		expect(element).toHaveTextContent('COSC 109');
		expect(element).toHaveTextContent('COSC 210');

		const select = screen.getByRole('combobox'); // find select module to change division

		// switch to math division
		await act(async () => {
			fireEvent.change(select, { target: { value: 'mathematics' } });
		});

    // check if data renders as expected
		expect(element).toHaveTextContent('MATH 101');
		expect(element).toHaveTextContent('Calculus I');
		expect(element).toHaveTextContent('Alice Johnson');
		expect(element).not.toHaveTextContent('PHYS 201');
    expect(element).not.toHaveTextContent('COSC 109');

    // switch to physics division
		await act(async () => {
			fireEvent.change(select, { target: { value: 'physics' } });
		});

    // check if data renders as expected
		expect(element).toHaveTextContent('PHYS 201');
    expect(element).not.toHaveTextContent('MATH 101');
		expect(element).not.toHaveTextContent('Calculus I');
		expect(element).not.toHaveTextContent('Alice Johnson');
    expect(element).not.toHaveTextContent('COSC 109');
	});
  test('Testing search functionality', async () => {
    const searchInput = screen.getByRole('textbox'); // find search input box
  
    await act(async () => { // search John Doe
      fireEvent.change(searchInput, { target: { value: 'John Doe' } });
    });
  
    // check John Doe is present, Jane is not present
    expect(element).toHaveTextContent('John Doe');
    expect(element).not.toHaveTextContent('Jane Smith');
  });
  test('Testing sorting functionality', async () => {
    const sortButton = screen.getByText('Instructor').querySelector('.sort-button'); //find sort button under instructor
  
    // check order of row before click sort button
    expect(element).toHaveTextContent('John Doe');
    expect(element).toHaveTextContent('Jane Smith');
  
    await act(async () => {
      fireEvent.click(sortButton); // click sort
    });
  
    const rows = screen.getAllByRole('row');

    // check if the order is sorted
    expect(rows[1]).toHaveTextContent('Jane Smith');
    expect(rows[2]).toHaveTextContent('John Doe');
  });
});
