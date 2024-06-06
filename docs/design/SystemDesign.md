# System Design

## Introduction

Start with a brief introduction of **what** you are building, reminding the reader of the high-level usage scenarios (project purpose).   Complete each section with the required components.  Don't forget that you can include [images in your markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).  

Start each section with a lead-in, detailing what it is.  Also, do not just have a collection of images.   Each diagram must be explained clearly. **Do not assume that the reader understands the intentions of your designs**.

## System Architecture Design

        Recall the system architecture slides and tell us which architecture pattern you are using and why (it may also be something not in the slides or be a combination). Provide more details about the components you have written, and where these components fit in the overall architecture so we can visualize how you have decomposed your system. Basically, this should all be captured in ONE diagram with the components on them and a few sentences explaining (i) why you chose this architecture and (ii) why the components are where you put them. If you want to just focus on a certain aspect of your system and not show the entire architecture for your system in the diagram, that should be fine as well.

### System Architecure Diagram

![Architecture Diagram](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/system-design/docs/design/diagrams/Architecture%20Diagrma.png)

### Why This Architecture?

This container-based microservices architecture offers several key advantages:

*    **Scalability:** Each component (frontend, backend, authentication, database) runs in its own container, allowing for independent scaling based on demand. This ensures optimal performance as the system grows.
*    **Modularity and Reusability:** Since components are loosely coupled, we can work on them in parallel, speeding up development. Testing is also more efficient as it can be focused on individual components rather than the entire system. Additionally, this modularity promotes code reusability, as components can be easily shared or adapted for other projects.
*    **Maintainability:** The independent nature of components simplifies maintenance tasks. If a specific component needs updates or fixes, it can be taken down and modified without affecting the entire system. This reduces downtime and simplifies troubleshooting.
*    **Security (Reduced Attack Surface):**  By isolating components into separate containers, we limit the potential impact of a security breach. If one component is compromised, the others remain isolated, reducing the overall risk to the system.
  
### Component Placements and Reasoning:

1. **Frontend (React):**  Isolated to enable independent UI updates and technology flexibility. 
2. **Backend (Express.js):**  Central hub for logic, data processing, and communication. Ensures security, data integrity, and scalability.
3. **Middleware (Backend):** A middleware layer is a set of functions within the backend that sit between the API endpoints and the database. It serves as an abstraction layer, providing a consistent interface for interacting with the database while encapsulating all the database-specific queries and operations. This improves code organization, maintainability, and testability.
4. **Authentication (JWT/OAuth2.0/OpenID Connect):**  Separate container for focused security implementation and potential reusability.
5. **Database (PostgreSQL):** Isolated for data persistence, independent scaling, and focused security measures.

## Use Case Models

    Extending from your requirements, the team will need to develop a set of usage scenarios for each user group documented as properly dressed use cases  (including diagrams following the UML syntax and descriptions as presented in class).   You may also want to include journey lines with some use cases. 

### Use Case Diagram
![UCD](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/system-design/docs/design/diagrams/Department%20management%20system%20use%20case%20diagram.png)

### Use Case Descriptions

***Use Case 1: View List of Instructors***

* **Primary Actor:** All Users (Department Head, Department Staff, Instructor, IT/Admin)
* **Description:** This use case allows users to view a list of all instructors in the department.
* **Precondition:** The user must be logged into the system.
* **Postcondition:** A list of instructors with their basic information is displayed.
* **Main Scenario:**
    * The user navigates to the "Instructors" page.
    * The system retrieves a list of all active instructors from the database.
    * The system displays a table containing each instructor's name, department, and a link to view their full profile.
* **Extensions (Alternative Flows):**
    * **No Instructors Found:** If there are no instructors in the database, the system displays a message indicating no results.
    * **Error Retrieving Data:** If there is an error retrieving the data from the database, the system displays an error message. 

***Use Case 2: View List of Courses***

* **Primary Actor:** All Users
* **Description:** This use case allows users to view a list of all courses offered by the department.
* **Precondition:** The user must be logged into the system.
* **Postcondition:** A list of courses with their basic information is displayed.
* **Main Scenario:**
    * The user navigates to the "Courses" page.
    * The system retrieves a list of all courses from the database.
    * The system displays a table containing each course's title, code, and instructor(s) assigned.
* **Extensions:**
    * **No Courses Found:** If there are no courses in the database, the system displays a message indicating no results.
    * **Error Retrieving Data:** If there is an error retrieving data, an error message is displayed.

***Use Case 3: View List of Service Roles***

* **Primary Actor:** All Users
* **Description:** This use case allows users to view a list of all service roles within the department.
* **Precondition:** The user must be logged into the system.
* **Postcondition:** A list of service roles with their descriptions is displayed.
* **Main Scenario:**
    * The user navigates to the "Service Roles" page.
    * The system retrieves a list of all service roles from the database.
    * The system displays a list or table containing each role's title and a brief description.
* **Extensions:**
    * **No Service Roles Found:** If there are no service roles in the database, the system displays a message indicating no results.
    * **Error Retrieving Data:** If there is an error retrieving data, an error message is displayed.

***Use Case 4: View Instructor Information***

* **Primary Actor:** All Users
* **Description:** This use case allows users to view detailed information about a specific instructor.
* **Precondition:** The user must be logged in and have selected an instructor from the list.
* **Postcondition:** The instructor's detailed information is displayed.
* **Main Scenario:**
    * The user clicks on an instructor's name from the list of instructors.
    * The system retrieves the instructor's information from the database.
    * The system displays the instructor's name, contact information, office location, expertise, and assigned courses/service roles.
* **Extensions:**
    * **Instructor Not Found:** If the selected instructor is not found in the database, an error message is displayed.
    * **Error Retrieving Data:** If there is an error retrieving data, an error message is displayed.

***Use Case 5: View Course Information***

* **Primary Actor:** All Users
* **Description:** This use case allows users to view detailed information about a specific course.
* **Precondition:** The user must be logged in and have selected a course from the list.
* **Postcondition:** The course's detailed information is displayed.
* **Main Scenario:**
    * The user clicks on a course title from the list of courses.
    * The system retrieves the course information from the database.
    * The system displays the course title, code, description, enrollment, and assigned instructor(s).
* **Extensions:**
    * **Course Not Found:** If the selected course is not found, an error message is displayed.
    * **Error Retrieving Data:** If there is an error retrieving data, an error message is displayed.

***Use Case 6: View Service Role Information***

* **Primary Actor:** All Users
* **Description:** This use case allows users to view detailed information about a specific service role.
* **Precondition:** The user must be logged in and have selected a service role from the list.
* **Postcondition:** The service role's detailed information is displayed.
* **Main Scenario:**
    * The user clicks on a service role title from the list of service roles.
    * The system retrieves the service role information from the database.
    * The system displays the service role title and description.
* **Extensions:**
    * **Service Role Not Found:** If the selected role is not found, an error message is displayed.
    * **Error Retrieving Data:** If there is an error retrieving data, an error message is displayed.

***Use Case 7: View Own Teaching Performance Visualization***

* **Primary Actor:** Instructor
* **Description:** This use case allows instructors to view a visualization of their teaching performance based on aggregated data from student evaluations, grades, and retention rates.
* **Precondition:**
    * The instructor must be logged into the system.
    * Relevant teaching performance data must be available in the system (imported via Excel or other methods).
* **Postcondition:** A visualization of the instructor's teaching performance is displayed.
* **Main Scenario:**
    * The instructor navigates to the "My Performance" or "Teaching Dashboard" section of the system.
    * The system retrieves the calculated teaching performance score or relevant data used to calculate the teaching performance score associated with the instructor.
        * The system processes the data using the defined algorithm (TBD) to calculate performance metrics.
    * The system presents a visual representation of the instructor's performance (e.g., bar chart, line graph) comparing their metrics to department benchmarks or averages.
* **Extensions (Alternative Flows):**
    * **Insufficient Data:** If there is not enough data to generate a meaningful visualization, the system displays a message indicating so.
    * **Algorithm Error:** If there's an error in the performance calculation algorithm, the system displays an error message.

***Use Case 8: View Any Instructor's Teaching Performance Visualization***

* **Primary Actor:** Department Head, Department Staff
* **Description:** This use case allows department heads and staff to view the teaching performance visualization of any instructor in the department.
* **Precondition:**
    * The user (department head or staff) must be logged into the system.
    * The user must have appropriate permissions to view instructor performance data.
    * Relevant teaching performance data for the selected instructor must be available in the system.
* **Postcondition:** A visualization of the selected instructor's teaching performance is displayed.
* **Main Scenario:**
    * The user navigates to the "Instructor Performance" or similar section.
    * The user selects the desired instructor from a list or search bar.
    * The system retrieves and processes the instructor's teaching performance data.
    * The system displays a visual representation of the instructor's performance.
* **Extensions:**
    * **Instructor Not Found:** If the selected instructor is not in the system, an error message is displayed.
    * **Insufficient Data/Algorithm Error:** If there is not enough data to generate a meaningful visualization, the system displays a message indicating so.
    * **Unauthorized Access:** If the user doesn't have permission, an "Access Denied" message is displayed.

***Use Case 9: View Average and Trend of Teaching Performance for a Subject***

* **Primary Actor:** Department Head, Department Staff
* **Description:** This use case allows users to view the average teaching performance and trends for instructors teaching a specific subject (COSC, MATH, PHYS, STAT).
* **Precondition:**
    * The user must be logged in and have appropriate permissions.
    * Relevant teaching performance data must be available for instructors in the selected subject.
* **Postcondition:** A visualization displaying average teaching performance and trends for the selected subject is shown.
* **Main Scenario:**
    * The user navigates to the "Subject Performance" or similar section.
    * The user selects the desired subject from a dropdown or list.
    * The system retrieves and aggregates teaching performance data for all instructors in that subject.
    * The system calculates average performance metrics and identifies trends over time.
    * The system displays the results visually (e.g., line chart for trends, bar chart for comparisons).
* **Extensions:**
    * **No Data for Subject:** If no instructors are found for the selected subject, a message is displayed.
    * **Insufficient Data/Algorithm Error:** If there is not enough data to generate a meaningful visualization, the system displays a message indicating so.

***Use Case 10: View Departmental Teaching Performance Visualization***

* **Primary Actor:** Department Head
* **Description:** This use case allows the department head to view a high-level overview of the department's teaching performance, including averages and trends.
* **Precondition:**
    * The department head must be logged in.
    * Relevant teaching performance data must be available for all instructors.
* **Postcondition:** A visualization summarizing the department's overall teaching performance is displayed.
* **Main Scenario:**
    * The department head navigates to the "Department Overview" or similar section.
    * The system retrieves and aggregates teaching performance data for all instructors.
    * The system calculates overall performance metrics and trends.
    * The system displays a visual summary (e.g., dashboard with multiple charts and graphs).
* **Extensions:**
    * **Insufficient Data/Algorithm Error:** If there is not enough data to generate a meaningful visualization, the system displays a message indicating so.

***Use Case 11: View Own Service Hour Completion and Comparison to Benchmark***

* **Primary Actor:** Instructor
* **Description:** This use case allows instructors to view their total completed service hours for the current period (e.g., semester, year) and compare it to the department benchmark for their role.
* **Precondition:**
    * The instructor is logged into the system.
    * Service hour data for the instructor has been entered into the system.
    * The department benchmark for the instructor's role is stored in the database.
* **Postcondition:** A visualization or summary of the instructor's service hour completion, including comparison to the benchmark, is displayed.
* **Main Scenario:**
    * The instructor navigates to the "My Service" or "Service Dashboard" section.
    * The system retrieves the instructor's total service hours from the database.
    * The system retrieves the benchmark service hours for the instructor's role from the database.
    * The system calculates the percentage of benchmark completion.
    * The system displays the instructor's service hours, benchmark, and completion percentage (e.g., using a progress bar or a simple table).
* **Extensions (Alternative Flows):**
    * **No Service Hours Recorded:** If there are no service hours recorded for the instructor, a message is displayed indicating no data available.
    * **Benchmark Not Found:** If the benchmark for the instructor's role is missing, an error message is displayed.

***Use Case 12: View Any Instructor's Service Hour Completion and Comparison to Benchmark***

* **Primary Actor:** Department Head, Department Staff
* **Description:** This use case allows department heads and staff to view the service hour completion and benchmark comparison for any instructor in the department.
* **Precondition:**
    * The user is logged into the system and has the necessary permissions to view instructor data.
    * Service hour data for the selected instructor is available.
    * The benchmark for the instructor's role is stored in the database.
* **Postcondition:** A visualization or summary of the selected instructor's service hour completion, including comparison to the benchmark, is displayed.
* **Main Scenario:**
    * The user navigates to the "Instructor Service" or similar section.
    * The user selects the desired instructor from a list or search bar.
    * The system retrieves and processes the instructor's service hour data and benchmark.
    * The system displays the same information as in Use Case 11.
* **Extensions:**
    * **Instructor Not Found/No Data/Benchmark Not Found:** If there are no service hours/benchmark recorded for the instructor, a message is displayed indicating no data available.
    * **Unauthorized Access:** If the user doesn't have permission, an "Access Denied" message is displayed.

***Use Case 13: View Average Service Hour Completion for a Subject***

* **Primary Actor:** Department Head, Department Staff
* **Description:** This use case allows users to view the average service hour completion for instructors teaching a specific subject.
* **Precondition:**
    1. The user is logged in and has appropriate permissions.
    2. Service hour data for instructors in the selected subject is available.
    3. Benchmarks for relevant service roles are stored in the database.
* **Postcondition:** A summary of the average service hour completion for the selected subject is displayed.
* **Main Scenario:**
    4. The user navigates to the "Subject Service Hours" or similar section.
    5. The user selects the desired subject.
    6. The system retrieves service hour data for all instructors teaching the subject.
    7. The system calculates the average service hour completion (taking into account different role benchmarks).
    8. The system displays the results in a table or summary format.

***Use Case 14: View Departmental Service Hour Completion Average***

* **Primary Actor:** Department Head, Department Staff
* **Description:** This use case allows users to view the overall average service hour completion for the entire department.
* **Precondition:**
    1. The user is logged in and has appropriate permissions.
    2. Service hour data for all instructors is available.
    3. Benchmarks for all relevant service roles are stored in the database.
* **Postcondition:** A summary of the department's overall average service hour completion is displayed.
* **Main Scenario:**
    4. The user navigates to the "Department Overview" or similar section.
    5. The system retrieves service hour data for all instructors in the department.
    6. The system calculates the overall average service hour completion (considering different role benchmarks).
    7. The system displays the result.

***Use Case 15: Log In***

* **Primary Actor:** All Users (Department Head, Department Staff, Instructor, IT/Admin)
* **Description:** This use case allows users to authenticate themselves and gain access to the system.
* **Precondition:** The user must have a valid account in the system.
* **Postcondition:** The user is successfully logged in and directed to their personalized dashboard or homepage.
* **Main Scenario:**
    * The user opens the login page.
    * The user enters their email and password.
    * The system validates the credentials against the database.
    * If the credentials are valid, the system logs the user in.
    * The system redirects the user to their dashboard or homepage.
* **Extensions:**
    * **Invalid Credentials:** If the email or password is incorrect, the system displays an error message and prompts the user to re-enter their credentials.
    * **Account Locked:** If the user exceeds the allowed number of failed login attempts, the system locks the account and informs the user to contact the administrator.
    * **Forgot Password:** If the user forgets their password, they can click the "Forgot Password" link to initiate the password reset process (see Use Case 3).

***Use Case 16: Edit Personal Information***

* **Primary Actor:** All Users
* **Description:** This use case allows users to modify their personal information in their profile.
* **Precondition:** The user must be logged into the system.
* **Postcondition:** The user's profile information is updated in the database.
* **Main Scenario:**
    * The user navigates to their profile page.
    * The user clicks the "Edit Profile" or similar button/link.
    * The system displays an edit form pre-filled with the user's current information (office location, phone number, photo, password).
    * The user modifies the desired information.
    * The user clicks "Save" or similar button.
    * The system validates the input.
    * If the input is valid, the system updates the user's information in the database.
    * The system displays a success message and redirects the user back to their profile page.
* **Extensions:**
    * **Invalid Input:** If any of the entered information is invalid (e.g., incorrect email format), the system displays an error message and highlights the incorrect fields.

***Use Case 17: Reset Password (if unable to log in)***

* **Primary Actor:** All Users
* **Description:** This use case allows users who have forgotten their password to reset it.
* **Precondition:** The user must have a valid account in the system but cannot remember their password.
* **Postcondition:** The user receives an email with a link to reset their password.
* **Main Scenario:**
    * The user clicks on the "Forgot Password" link on the login page.
    * The system prompts the user to enter their email address.
    * The system verifies that the email address is associated with an active account.
    * The system generates a unique password reset token and stores it in the database.
    * The system sends an email to the user's email address with a link containing the reset token.
    * The user clicks on the link in the email and is directed to a password reset page.
    * The user enters a new password and confirms it.
    * The system validates the new password and updates the user's password in the database.
    * The system displays a success message and redirects the user to the login page.
* **Extensions:**
    * **Invalid Email:** If the entered email address is not associated with an active account, the system displays an error message.
    * **Expired Token:** If the reset token has expired, the system prompts the user to request a new one.

***Use Case 18: Log Out***

* **Primary Actor:** All Users
* **Description:** This use case allows users to end their session and securely log out of the system.
* **Precondition:** The user must be logged into the system.
* **Postcondition:** The user's session is terminated, and they are redirected to the login page.
* **Main Scenario:**
    1. The user clicks the "Logout" button or link.
    2. The system invalidates the user's session token.
    3. The system redirects the user to the login page.

***Use Case 19: Add Course***

* **Primary Actors:** Department Head, Department Staff, IT/Admin
* **Description:** This use case allows authorized users to add a new course to the system.
* **Precondition:** The user must be logged into the system with appropriate permissions.
* **Postcondition:** A new course is added to the database and can be viewed and assigned to instructors.
* **Main Scenario:**
    * The user navigates to the "Courses" section.
    * The user clicks on the "Add Course" button.
    * The system presents a form for entering course details (title, code, description, etc.).
    * The user fills out the form and clicks "Save."
    * The system validates the input.
    * If valid, the system creates a new course entry in the database.
    * The system displays a success message and redirects to the course list or details page.
* **Extensions (Alternative Flows):**
    * **Invalid Input:** If any input is invalid, the system displays an error message and highlights the incorrect fields.
    * **Duplicate Course:** If a course with the same code already exists, the system displays an error message.

***Use Case 20: Add Service Role***

* **Primary Actors:** Department Head, Department Staff, IT/Admin
* **Description:** This use case allows authorized users to add a new service role to the system.
* **Precondition:** The user must be logged into the system with appropriate permissions.
* **Postcondition:** A new service role is added to the database and can be viewed and assigned to instructors.
* **Main Scenario:**
    * The user navigates to the "Service Roles" section.
    * The user clicks on the "Add Service Role" button.
    * The system presents a form for entering role details (title, description, monthly service hours).
    * The user fills out the form and clicks "Save."
    * The system validates the input.
    * If valid, the system creates a new service role entry in the database.
    * The system displays a success message and redirects to the service role list or details page.
* **Extensions:**
    * **Invalid Input/Duplicate Role:** Similar to Use Case 19.

***Use Case 21: Edit Course Information***

* **Primary Actors:** Department Head, Department Staff, IT/Admin
* **Description:** This use case allows authorized users to modify the information of an existing course.
* **Precondition:** The user must be logged into the system with appropriate permissions and have selected a course to edit.
* **Postcondition:** The selected course's information is updated in the database if the user confirms the changes.
* **Main Scenario:**
    * The user navigates to the "Courses" section.
    * The user selects the course to edit.
    * The system displays the course details in an editable form.
    * The user modifies the desired information.
    * The user clicks "Save."
    * The system displays a warning pop-up: "Are you sure you want to save these changes?"
    * The user confirms by clicking "Yes."
    * The system validates the input.
    * If valid, the system updates the course information in the database.
    * The system displays a success message.
* **Extensions:**
    * **Invalid Input:** Similar to Use Case 19.
    * **Cancel Edit:** If the user clicks "No" in the warning pop-up, the changes are discarded, and the user is returned to the course details view.

***Use Case 22: Edit Service Role Information***

* **Primary Actors:** Department Head, Department Staff, IT/Admin
* **Description:** This use case allows authorized users to modify the information of an existing service role.
* **Precondition:** The user must be logged in with appropriate permissions and have selected a service role to edit.
* **Postcondition:** The selected service role's information is updated in the database if the user confirms the changes.
* **Main Scenario:**
    * The user navigates to the "Service Roles" section.
    * The user selects the service role to edit.
    * The system displays the role details in an editable form.
    * The user modifies the desired information.
    * The user clicks "Save."
    * The system displays a warning pop-up: "Are you sure you want to save these changes?"
    * The user confirms by clicking "Yes."
    * The system validates the input.
    * If valid, the system updates the service role information in the database.
    * The system displays a success message.
* **Extensions:**
    * **Invalid Input:** Similar to Use Case 19.
    * **Cancel Edit:** If the user clicks "No" in the warning pop-up, the changes are discarded, and the user is returned to the service role details view.

***Use Case 23: Delete Course***

* **Primary Actors:** Department Head, Department Staff, IT/Admin
* **Description:** This use case allows authorized users to delete an existing course from the system.
* **Precondition:** The user must be logged into the system with appropriate permissions and have selected a course to delete.
* **Postcondition:** The selected course is removed from the database if the user confirms the deletion.
* **Main Scenario:**
    * The user navigates to the "Courses" section.
    * The user selects the course to delete.
    * The system displays a warning pop-up: "Are you sure you want to delete this course? This action cannot be undone."
    * The user confirms by clicking "Yes."
    * The system deletes the course and associated data from the database.
    * The system displays a success message.
* **Extensions:**
    * **Course Not Found:** If the selected course is not found, an error message is displayed.
    * **Cancel Deletion:** If the user clicks "No" in the warning pop-up, the deletion is canceled.

***Use Case 24: Delete Service Role***

* **Primary Actors:** Department Head, Department Staff, IT/Admin
* **Description:** This use case allows authorized users to delete an existing service role from the system.
* **Precondition:** The user must be logged in with appropriate permissions and have selected a service role to delete.
* **Postcondition:** The selected service role is removed from the database if the user confirms the deletion.
* **Main Scenario:**
    * The user navigates to the "Service Roles" section.
    * The user selects the service role to delete.
    * The system displays a warning pop-up: "Are you sure you want to delete this service role? This action cannot be undone."
    * The user confirms by clicking "Yes."
    * The system deletes the service role and associated data from the database.
    * The system displays a success message.
* **Extensions:**
    * **Service Role Not Found:** If the selected service role is not found, an error message is displayed.
    * **Cancel Deletion:** If the user clicks "No" in the warning pop-up, the deletion is canceled.

***Use Case 25: Add/Edit Teaching Assignments***

* **Primary Actors:** Department Head, Department Staff
* **Description:** This use case allows authorized users to assign instructors to courses or modify existing teaching assignments. For instructors not assigned to any courses, their course assignment field will display "None." Assigning a course to them will be equivalent to editing their assignment from "None" to the course code.
* **Precondition:** The user must be logged in with appropriate permissions.
* **Postcondition:** The teaching assignments are updated in the database if the user confirms the changes.
* **Main Scenario:**
    * The user navigates to the "Teaching Assignments" section.
    * The user selects a course and an instructor to assign or modify an existing assignment.
    * The system displays a confirmation message: "Are you sure you want to assign [Instructor Name] to [Course Code]?" or "Are you sure you want to modify this teaching assignment?"
    * The user confirms the action by clicking "Yes."
    * The system updates the teaching assignments in the database.
    * The system displays a success message.
* **Extensions:**
    * **Instructor or Course Not Found:** If the selected instructor or course is not found, an error message is displayed.
    * **Conflict:** If the assignment conflicts with existing assignments (e.g., scheduling conflicts), the system displays an error message.
    * **Cancel Action:** If the user clicks "No" in the confirmation pop-up, the action is canceled.

***Use Case 26: Add/Edit Service Role Assignments***

* **Primary Actors:** Department Head, Department Staff
* **Description:** This use case allows authorized users to assign instructors to service roles or modify existing assignments. For instructors not assigned to any service roles, their service role field will display "None." Assigning a role to them will be equivalent to editing their assignment from "None" to the service role title.
* **Precondition:** The user must be logged in with appropriate permissions.
* **Postcondition:** The service role assignments are updated in the database if the user confirms the changes.
* **Main Scenario:**
    * The user navigates to the "Service Role Assignments" section.
    * The user selects a service role and an instructor to assign or modify an existing assignment.
    * The system displays a confirmation message: "Are you sure you want to assign [Instructor Name] to [Service Role Title]?" or "Are you sure you want to modify this service role assignment?"
    * The user confirms the action by clicking "Yes."
    * The system updates the service role assignments in the database.
    * The system displays a success message.
* **Extensions:**
    * **Instructor or Service Role Not Found:** If the selected instructor or service role is not found, an error message is displayed.
    * **Conflict:** If the assignment conflicts with existing assignments (e.g., workload limits), the system displays an error message.
    * **Cancel Action:** If the user clicks "No" in the confirmation pop-up, the action is canceled.

***Use Case 27: Set Service Hour Benchmark for Instructors***

* **Primary Actors:** Department Head, Department Staff
* **Description:** This use case allows authorized users to set the expected yearly service hour benchmark for the desired instructor.
* **Precondition:**
    * The user must be logged into the system with appropriate permissions (department head or staff).
* **Postcondition:** The benchmark for the desired instructor is stored in the database if the user confirms the changes.
* **Main Scenario:**
    * The user navigates to the "Instructors" page or similar section of the system.
    * The system displays a list of active instructors.
    * For the desired instructor, the user enters the desired yearly service hour benchmark.
    * The user clicks "Save" or a similar button.
    * The system displays a confirmation message: "Are you sure you want to save these changes?"
    * The user confirms by clicking "Yes."
    * The system validates the input (e.g., ensures it's a positive numerical value).
    * If valid, the system updates the benchmark for the desired instructor in the database.
    * The system displays a success message.
* **Extensions (Alternative Flows):**
    * **Invalid Input:** If the entered value for an instructor is not a valid number, the system displays an error message and prompts the user to re-enter the benchmark.
    * **Cancel Changes:** If the user clicks "No" on the confirmation dialog, the changes are discarded, and the previous benchmark values are retained.
    * **Unauthorized Access:** If the user doesn't have the necessary permissions, the system displays an "Access Denied" message.

***Use Case 28: Edit Service Hour Benchmark for Instructor Positions***

* **Primary Actors:** Department Head, Department Staff
* **Description:** This use case allows authorized users to modify the existing yearly service hour benchmark for the desired instructor.
* **Precondition:**
    * The user must be logged into the system with appropriate permissions.
    * The existing benchmark for the desired instructor must be stored in the database.
* **Postcondition:** The benchmark for the selected instructor is updated in the database if the user confirms the changes.
* **Main Scenario:**
    * The user navigates to the "Instructors" or similar section.
    * The system displays a list of instructors with their current benchmark values.
    * The user selects the instructor to edit and modifies the benchmark value.
    * The user clicks "Save" or a similar button.
    * The system displays a confirmation message: "Are you sure you want to save these changes?"
    * The user confirms by clicking "Yes."
    * The system validates the input.
    * If valid, the system updates the benchmark for the selected instructor in the database.
    * The system displays a success message.
* **Extensions:**
    * **Invalid Input/Unauthorized Access:** Same as Use Case 27.
    * **Cancel Changes:** If the user clicks "No" on the confirmation dialog, the changes are discarded, and the previous benchmark value is retained.

***Use Case 29: Create Account***

* **Primary Actors:** Admin/IT
* **Description:** This use case allows administrators or IT personnel to create new user accounts with their initial account types (flags).
* **Precondition:** The admin/IT user must be logged into the system.
* **Postcondition:** A new user account is created in the database with the specified details and initial account types.
* **Main Scenario:**
    * The admin/IT user navigates to the "User Management" section.
    * The admin/IT user clicks on the "Create New Account" button.
    * The system presents a form for entering the new user's details:
        * Name (First and Last)
        * Email
        * Password
        * Initial Account Type(s) (selected from a list of checkboxes, e.g., Department Head, Staff, Instructor)
    * The admin/IT user fills in all the required fields and clicks "Save."
    * The system validates the input.
    * If valid, the system creates the new user account in the database, associating the selected account types (flags).
    * The system displays a success message indicating that the account has been created.
* **Extensions (Alternative Flows):**
    * **Invalid Input:** If any of the required fields are not filled in or if the input is invalid (e.g., invalid email format), the system displays an error message prompting the user to correct the input.
    * **Duplicate Account:** If the email address entered for a new account is already associated with an existing account, the system displays an error message.
    * **Unauthorized Access:** If the user attempting to create an account does not have the necessary admin/IT permissions, the system denies access and displays an appropriate error message.

***Use Case 30: Add/Edit Account Types***

* **Primary Actors:** Admin/IT
* **Description:** This use case allows administrators or IT personnel to modify the account types (flags) associated with an existing user account.
* **Precondition:**
    * The admin/IT user must be logged into the system.
    * The user account to be edited must exist in the database.
* **Postcondition:** The account types (flags) associated with the selected user account are updated in the database.
* **Main Scenario:**
    * The admin/IT user navigates to the "User Management" section.
    * The admin/IT user selects the user whose account types need to be edited from the list of existing users.
    * The system displays the selected user's details, including their current account types (flags) in a checkbox list.
    * The admin/IT user modifies the account types by selecting or deselecting the appropriate checkboxes.
    * The admin/IT user clicks "Save" to submit the changes.
    * The system validates the input.
    * If valid, the system updates the user's account types (flags) in the database.
    * The system displays a success message indicating that the account types have been updated successfully.
* **Extensions (Alternative Flows):**
    * **User Not Found:** If the selected user account does not exist in the database, the system displays an error message.
    * **Unauthorized Access:** If the user attempting to edit account types does not have the necessary admin/IT permissions, the system denies access and displays an appropriate error message.

***Use Case 31: Switch Account***

* **Primary Actor:** All Users (with multiple account types)
* **Description:** This use case allows users with multiple account types to switch between their different roles within the system (e.g., from Department Head to Instructor).
* **Precondition:**
    * The user must be logged into the system.
    * The user account must have multiple account types (flags) associated with it.
* **Postcondition:** The user's currently active account type is changed, and the system interface is updated to reflect the new role's permissions and features.
* **Main Scenario:**
    * The user clicks on their profile picture in the top-right corner of the navigation bar.
    * A dropdown menu appears, displaying the option "Switch Account."
    * The user clicks on "Switch Account."
    * A submenu appears, listing all the account types associated with the user's account.
    * The user selects the desired account type from the submenu.
    * The system updates the user's currently active account type in the session.
    * The system reloads the page or updates the interface elements to reflect the permissions and features associated with the newly selected account type.
* **Extensions:**
    * **Single Account Type:** If the user has only one account type associated with their profile, the "Switch Account" option is not displayed in the dropdown menu.

***Use Case 32: Deactivate Account***

* **Primary Actor:** IT/Admin
* **Description:** This use case allows IT/Admin users to deactivate an existing user account, preventing further access to the system.
* **Precondition:**
    * The IT/Admin user must be logged into the system.
    * The user account to be deactivated must exist in the system.
* **Postcondition:**
    * The selected user account is marked as inactive in the database.
    * The user can no longer log in to the system.
* **Main Scenario:**
    * The IT/Admin user navigates to the "User Management" section.
    * The IT/Admin user searches for or selects the user account to be deactivated.
    * The system displays a confirmation message: "Are you sure you want to deactivate this account?"
    * The IT/Admin user confirms the deactivation by clicking "Yes."
    * The system updates the account status to "Inactive" in the database.
    * The system logs the deactivation action (user, timestamp).
    * The system displays a success message: "Account has been deactivated."
* **Extensions (Alternative Flows):**
    * **User Not Found:** If the selected user account does not exist in the database, the system displays an error message: "User not found."
    * **Cancel Deactivation:** If the IT/Admin user clicks "No" on the confirmation dialog, the deactivation is canceled, and the user account remains active.
    * **Unauthorized Access:** If a user other than IT/Admin attempts to deactivate an account, the system denies access and displays an "Unauthorized Access" message.
    * **System Error:** If there is a system error during the deactivation process, the system displays a generic error message and logs the technical details.

***Use Case 33: Import New Data (Spreadsheet)***

* **Primary Actors:** Department Head, Department Staff
* **Description:** This use case enables authorized users to import new data into the system from a standardized spreadsheet format. The data may include student surveys, updated service hours, or any other relevant information.
* **Precondition:**
    * The user is logged in with appropriate permissions (department head or staff).
    * The data is prepared in a compatible spreadsheet format (e.g., CSV) with correct headers and data types.
* **Postcondition:** The imported data is successfully validated, processed, and stored in the relevant database tables.
* **Main Scenario:**
    * The user navigates to the "Data Import" section.
    * The user selects the type of data to import (e.g., student surveys, service hours).
    * The user uploads the spreadsheet file.
    * The system validates the file format and data structure.
    * If valid, the system processes the data and updates the corresponding database tables.
    * The system displays a success message indicating the number of records imported.
* **Extensions (Alternative Flows):**
    * **Invalid File Format:** If the file format is not supported, the system displays an error message.
    * **Data Validation Errors:** If the data fails validation checks (e.g., missing required fields, incorrect data types), the system displays an error report with details.
    * **Import Failure:** If the import process encounters errors, the system displays an error message and rolls back any changes.

***Use Case 34: Export Performance Data***

* **Primary Actors:** Department Head, Department Staff
* **Description:** This use case allows authorized users to export performance data from the system in a specified format (e.g., Excel).
* **Precondition:** The user is logged in with appropriate permissions.
* **Postcondition:** The selected performance data is exported in the chosen format and downloaded to the user's device.
* **Main Scenario:**
    * The user navigates to the "Reports" or "Data Export" section.
    * The user selects the desired performance data to export (e.g., instructor performance metrics, course enrollment statistics).
    * The user selects the export format (e.g., Excel).
    * The system retrieves the selected data from the database.
    * The system formats the data according to the chosen export format.
    * The system provides a download link for the exported file.
* **Extensions:**
    * **No Data Available:** If there is no data available for the selected criteria, the system displays a message indicating no results.
    * **Export Error:** If the export process encounters an error, the system displays an error message.

***Use Case 35: Access Help Section***

* **Primary Actors:** Department Head, Department Staff, Instructor
* **Description:** This use case allows users to access the help section within the system to find information and guidance on how to use the system.
* **Precondition:** The user is logged into the system.
* **Postcondition:** The user is presented with relevant help content, such as tutorials, FAQs, or troubleshooting guides.
* **Main Scenario:**
    * The user clicks on the "Help" link or button (typically located in the navigation bar or footer).
    * The system displays the help section, which may include a search bar, a table of contents, or categories for different topics.
    * The user browses or searches for the desired help content.
    * The system displays the relevant information.
* **Extensions:**
    * **Search Not Found:** If the user's search query does not match any help content, the system displays a message indicating no results.

***Use Case 36: Get Monthly Notification (Add-on)***

* **Primary Actor:** Department Staff
* **Description:** This use case sends a monthly notification to department staff, reminding them to input any new expected service hours that have been decided by the department since service hours may vary from month to month and may not be announced beforehand.
* **Precondition:** The system has been configured to send monthly notifications on a specific date.
* **Postcondition:** The department staff receives an email notification reminding them to input new service hour data.
* **Main Scenario:**
    * The system checks if it's the specified date for sending notifications.
    * If it is, the system retrieves the department staff member responsible for inputting new expected service hours..
    * The system generates an email notification reminding staff to input new service hours.
    * The system sends the notification email to the staff member.
* **Extensions:**
    * **Notification Failure:** If the system encounters an error sending the notification, it logs the error for troubleshooting.

## Database Design 

Provide an ER diagram of the entities and relationships you anticipate having in your system (this will most likely change, but you need a starting point).  In a few sentences, explain why the data is modelled this way and what is the purpose of each table/attribute.  For this part, you only need to have ONE diagram and an explanation.

## Data Flow Diagram (Level 0/Level 1)

The team is required to create comprehensive Level 0 and Level 1 Data Flow Diagrams (DFDs) to visually represent the system’s data flow, including key processes, data stores, and data movements.  The deliverables will include a high-level context diagram, a detailed Level 1 DFD, and supporting documentation to facilitate the understanding of data movement within the system.   Remember that within a L1 DFD, the same general level of abstraction should apply to all processes (review 310 notes for guidance),

## User Interface (UI) Design

The team is required to put forward a series of UI mock-ups that will be used as starting points for the design of the system   They can be minimal but the team will need to  have at least made some choices about the interaction flow of the application.  You should consider the different major aspects of user interactions and develop UI mockups for those (think about the different features/use cases and what pages are needed; you will have a number most likely).  Additionally, create a diagram to explain the navigation flow for the MVP  prototype (and any alternate flows).  When considering your UI, think about usability, accessibility, desktop and mobile uses.  As a team, you will need to discuss design choices for the system.
