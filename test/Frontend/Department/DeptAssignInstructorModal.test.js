import { act, render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DeptDataEntry from '../../../app/frontend/src/JS/Department/DeptDataEntry';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';


jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
  profileId: { profileId: 'mocked-profileId'},
  accountType: { accountType: 'mocked-accountType' },
});

axios.get.mockImplementation(() => 
  Promise.resolve({
    data: {"currentPage":1, "perPage": 8, "instructorCount":9,
      "instructors":[
        {"id": 12312312, "name":"Kevin", "assigned":false},
        {"id": 12312313, "name":"Joe", "assigned":false},
        {"id": 12312314, "name":"Cheese", "assigned":false},
        {"id": 12312315, "name":"Turkey", "assigned":false},
        {"id": 12312316, "name":"Elephant", "assigned":false},
        {"id": 12312317, "name":"5", "assigned":false},
        {"id": 12312318, "name":"Fiftyfour", "assigned":false},
        {"id": 12312319, "name":"Paper", "assigned":false},
        {"id": 12312310, "name":"Cacahuate", "assigned":false}
      ]
    }
  })
);

beforeEach(async() => {
  const user = userEvent.setup();
  let { getByTestId } = ""; 
  await act(async () => {
      ({getByTestId} = render(<MemoryRouter><DeptDataEntry/></MemoryRouter>)); 
  });
  const dropdown = screen.getByLabelText("Create New:");
  fireEvent.change(dropdown, {target: {value:"Service Role"}}); // Select from drop down to make form appear
  let assignButton = screen.getByTestId("assign-button");
  await user.click(assignButton);
});

test('Checks if modal exists', async () => {
    let modal = screen.getByTestId("assignModal");
    expect(modal).toBeInTheDocument();
});

test('Checks instructor data is rendered properly', async () => {
  const user = userEvent.setup();
  let modal = screen.getByTestId("assignModal");
  expect(modal).toHaveTextContent("Cheese");
  expect(modal).toHaveTextContent("Paper");
  expect(modal).not.toHaveTextContent("Cacahuate");

  let next = screen.getByText(">");
  expect(next).toBeInTheDocument();
  await user.click(next);
  expect(modal).toHaveTextContent("Cacahuate");
});

test('Checks close button, checks add and remove buttons, and checks add and remove buttons of current instructors outside of modal', async() => {
  global.confirm = () => true;
  const user = userEvent.setup();
  let modal = screen.getByTestId("assignModal");
  
  let addButton = screen.getByText("UBC ID: 12312314").parentElement.querySelector("button");

  // Expect add button to change to remove when clicked
  expect(addButton).toHaveTextContent("Add");
  await user.click(addButton);
  expect(addButton).toHaveTextContent("Remove");

  // Checks close button functionality
  let closeButton = screen.getByTestId("close-button");
  await user.click(closeButton);
  expect(modal).not.toBeInTheDocument();

  // Checks that closing it from the X button doesn't save anything
  let form = screen.getByTestId("service-role-form");
  expect(form).not.toHaveTextContent("Cheese");

  await user.click(screen.getByTestId("assign-button"));
  
  addButton = screen.getByText("UBC ID: 12312314").parentElement.querySelector("button");
  expect(addButton).toBeInTheDocument();
  expect(addButton).toHaveTextContent("Add");
  await user.click(addButton);
  expect(addButton).toHaveTextContent("Remove");

  // Checks clicking the save button adds it to the list of currently assigned instructors
  let saveButton = screen.getByTestId("save-button");
  await user.click(saveButton);

  expect(modal).not.toBeInTheDocument();
  expect(form).toHaveTextContent("Cheese");

  // Checks that the remove button next to the instructor works
  let selectedInstructors = screen.getByTestId("selected-instructors");
  expect(selectedInstructors).toBeInTheDocument();
  let removeButton = selectedInstructors.querySelector("ul li button");
  await user.click(removeButton);
  expect(form).not.toHaveTextContent("Cheese");

  // Checks that the remove button reflects inside the modal as well
  await user.click(screen.getByTestId("assign-button"));
  addButton = screen.getByText("UBC ID: 12312314").parentElement.querySelector("button");
  expect(addButton).toHaveTextContent("Add");
});


