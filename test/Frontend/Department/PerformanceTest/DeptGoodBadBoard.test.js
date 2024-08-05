import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptGoodBadBoard from '../../../../app/frontend/src/JS/Department/PerformanceImports/DeptGoodBadBoard';
import { MemoryRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';

describe('DeptGoodBadBoard', () => {
  let element;
  const mockLeaderboardData = { // mock top and bottom data that will be used in DeptGoodBadBoard
    top: [
      { "name": "John", "score": "95" },
      { "name": "Doe", "score": "90" },
      { "name": "Martin", "score": "97" }
    ],
    bottom: [
      { "name": "Lucas", "score": "59" },
      { "name": "Bob", "score": "50" }
    ]
  };

  beforeEach(() => {
    render( // render leaderboard using mock data defined above
      <MemoryRouter>
        <DeptGoodBadBoard leaderboard={mockLeaderboardData} />
      </MemoryRouter>
    );
    element = document.getElementById('goodbad-test-content'); // set element with id
  });

  test('Testing rendering default people list on table', () => {
    // expect John, Doe, Martin in good board as goodbadboard sets default to top
    expect(element).toHaveTextContent("John");
    expect(element).toHaveTextContent("Doe");
    expect(element).toHaveTextContent("Martin");

    expect(element).toHaveTextContent("95");
    expect(element).toHaveTextContent("90");
    expect(element).toHaveTextContent("97");

    // expect not to show up because Lucas is supposed to be in bottom board
    expect(element).not.toHaveTextContent("Lucas");
  });

  test('Testing clicking bottom button to render bottom people list', async () => {
    const bottomButton = screen.getByRole('button', { name: 'Bottom' }); // find bottom button
    userEvent.click(bottomButton); // simulate clikcing bottom button

    await waitFor(() => { //expect 3 rows (2 from mock data, 1 from header)
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
    });

    // expect Lucas and Bob to be in bottom table
    expect(element).toHaveTextContent("Lucas");
    expect(element).toHaveTextContent("Bob");

    expect(element).toHaveTextContent("59");
    expect(element).toHaveTextContent("50");

    // expect not to show up because John is supposed to be in bottom board
    expect(element).not.toHaveTextContent("John");
  });

  test('Testing clicking top button to render top people list', async () => {
    const topButton = screen.getByRole('button', { name: 'Top' }); // find Top button
    userEvent.click(topButton); // simulate clicking Top button 

    await waitFor(() => { // expect row to be 4 (1 header, 3 from mock data)
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
    });

    // check top data rendered
    expect(element).toHaveTextContent("John");
    expect(element).toHaveTextContent("Doe");
    expect(element).toHaveTextContent("Martin");

    expect(element).toHaveTextContent("95");
    expect(element).toHaveTextContent("90");
    expect(element).toHaveTextContent("97");
  });
});
