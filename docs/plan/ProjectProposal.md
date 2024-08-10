# Project Proposal for Project #1 - Department Management System

**Team Number:** 6

**Team Members:** Jeremy Adams, Kevin Kim, Subaru Sakashita, Zhiheng Zhang & Adams Chen

## Overview:

### Project purpose or justification (UVP)

    What is the purpose of this software? What problem does it solve? What is the unique value proposition? Why is your solution better than others?

#### <ins>Project Purpose</ins>

“To create a responsive web application that supports managing the CMPS department to enable quality student experiences by increasing visibility and efficiency of instructor activities.” 

#### <ins>Unique Value Proposition</ins>

Our Department Management System revolutionizes how one navigates through and manages the CMPS department. **No more scattered information or switching between systems.** Our centralized platform puts all the essential data at your fingertips – instructor workloads, teaching assignments, service contributions, and more – in one intuitive interface.

But it's not just about data; it's about making smarter decisions. Our software **analyzes SEI data, student grades, enrollment trends (such as student retention rate), and service hours** to reveal actionable insights. This empowers the CMPS department to strategically allocate resources, optimize course assignments, and ultimately elevate the student experience.

**With our system, you'll:**

- **Save time** on administrative tasks.
- **Make informed decisions** based on comprehensive data analytics.
- **Empower faculty** with transparency and feedback.
- Ultimately, **enhance student success** through optimized teaching and service role assignment..


### High-level project description and boundaries

    Describe your MVP in a few statements and identify the boundaries of the system. 

#### <ins>MVP (Minimum Viable Product) Description</ins>

The MVP will focus on the core functionalities essential for addressing the department's most pressing needs:

**Instructor Profile Management:**

* **Database:** Create a database to store instructor information (e.g., name, contact information, expertise) and their teaching and service role assignments.
* **Import Functionality:** Allow department staff to import a spreadsheet containing instructor data to populate the database.

**Course Management:**

* **Database:** Create a database to store course information (e.g., title, code, description, enrollment).
* **Import Functionality:** Allow department staff to import a spreadsheet containing course data to populate the database.

**Service Role Management:**

* **Database:** Create a database to store service role information (e.g., description, time commitment).
* **Import Functionality:** Allow department staff to import a spreadsheet containing service role data to populate the database.

**SEI Data Management:**

* **Database:** Create a database to store SEI data (e.g., student ratings, comments).
* **Import Functionality:** Allow department staff to import a spreadsheet containing SEI data to populate the database.

#### <ins>Boundaries of the System</ins>

**Functional Boundaries:**

* **No Automated Workload Balancing:** The MVP will not automatically optimize or balance instructor workloads based on complex algorithms. It will provide data and insights, but the decision-making and adjustments will be handled manually by department staff.
* **Limited Performance Metrics:** The MVP will focus on performance metrics derived from SEI data, enrollment numbers, and student grades. More advanced metrics and analysis (e.g., predictive modeling) will be excluded from the initial scope.
* **No External System Integration:** The MVP will not integrate with other systems like the Workday System. Data will be imported manually via spreadsheets.
* **Basic Reporting:** The MVP will provide simple list and table-based reports. More advanced visualization options (e.g., interactive dashboards, informative charts) may be considered for future enhancements.

**Technical Boundaries:**

* **Web-Based Only:** The MVP will be a web application accessible via desktop browsers. Mobile app development is not included in the initial scope.
* **Limited Scalability:** The system will be designed to handle the expected user load and data volume for the CMPS department. However, scalability for larger departments or institutions will require additional infrastructure and architectural considerations.
* **No Real-Time Updates:** Data updates will be triggered by manual imports or user actions. Real-time data synchronization with external systems is not included in the MVP.

**Data Boundaries:**

* **Limited Data Sources:** The system will rely on imported data from spreadsheets for instructor and course information, teaching/service role assignments and expected service hours, SEI data, enrollment, and other relevant information. Integration with external data sources is not in the MVP scope.
* **Data Privacy:** The system will adhere to UBC's data privacy policies and regulations, ensuring that sensitive data is handled appropriately and access is restricted to authorized personnel.

**User Boundaries:**

* **Primary Users:** The MVP will primarily focus on meeting the needs of department heads, staff, and instructors. Functionality for other stakeholders (e.g., students, external reviewers) will be limited or excluded.
* **Technical Support:** The MVP will not include dedicated technical support staff. Basic troubleshooting and assistance will be provided by the development team or designated departmental personnel.

**Performance Analysis and Basic Reporting:**

* **Instructor Performance Analysis and Report:** Calculate and display basic statistics on instructor performance based on SEI data (e.g., average ratings) in a text-based fashion.
* **Teaching and Service Assignments Report :** Generate simple (list-style) reports detailing each instructor's teaching and service role assignments.
* **Workload and Service Hours Report:** Generate simple (table-style) reports summarizing each instructor's teaching load and total service hours completed.

### Measurable project objectives and related success criteria (scope of project)

    Make sure to use simple but precise statement of goals for the project that will be included when it the project is completed.  Rememeber that goals must be clear and measurable and **SMART**.  It should be clearly understood what success means to the project and how the success will be measured (as a high level, what is success?). 

**Specific**

* Enhance the performance such as teaching effectiveness and administrative efficiency of department staff and instructors

**Measureable**

* Within a year of launching the system, 80% of department staff and instructors meet or exceed the established performance benchmarks based on a comprehensive evaluation system involving SEI survey, working hour, and other teaching-related data.

**Acceptable**

* Utilize the given data to analyze performance of each instructor, and visualize how much the actual performance exceeds or falls short of the benchmark using graphs and colors. 

**Realistic**

* Supports the university's strategic goal to enhance educational quality and student satisfaction, by improving the visibility and effectiveness of service roles within each department.

**Time-based**

* Finish the design by June 5th, complete MVP by July 5th, peer testing and feedback is completed by July 19th, the whole system is completed by August 9th. 


## Users, Usage Scenarios and High Level Requirements 

### Users Groups:
    Provide a a descriotion of the primary users in the system and when their high-level goals are with the system (Hint: there is more than one group for most projects).  Proto-personas will help to identify user groups and their wants/needs. 

1. **Department Head**

> **Goals:**
>    * Utilize the system's analytics and reports (e.g., instructor performance data, workload distribution) to make informed decisions on teaching and service role assignments.
>    * Review performance reports to identify areas for instructor growth and development, as well as to acknowledge their successes.
>    * Monitor teaching and service workload reports to ensure equitable distribution of responsibilities among faculty members. 

2. **Department Staff**

> **Goals:**
>    * Update and maintain instructor profiles, including contact information and expertise.
>    * Manage course information, ensuring accuracy and up-to-date details.
>    * Enter and update instructor service hours based on reported activities or records.
>    * Generate reports on instructor workload, service contributions, and performance metrics as requested by the department head. 

3. **Instructors**
 
> **Goals:**
>   * View a dashboard summarizing their current teaching assignments, service roles, and overall workload for the semester or year.
>    * Access their teaching evaluations and service contributions, comparing them to department benchmarks to assess their performance.
>    * Update their profile information, including contact details, office location, and areas of expertise. 

4. **IT/Administrators**
 
> **Goals**:
>    * Manage user accounts, permissions, and access levels to ensure authorized access and data security.
>    * Troubleshoot system issues, provide technical support to users, and ensure the system functions smoothly.
>    * Perform regular backups, monitor system performance, implement security updates, and proactively maintain the system's health and security.
>    * Collaborate with the department to identify and implement improvements, new features, or functionalities based on feedback and evolving needs. 

### Envisioned Usage
    What can the user do with your software? If there are multiple user groups, explain it from each of their perspectives. These are what we called *user scenarios* back in COSC 341. Use subsections if needed to make things more clear. Make sure you tell a full story about how the user will use your software. An MVP is a minimal and viable, so don’t go overboard with making things fancy (to claim you’ll put in a ton of extra features and not deliver in the end), and don’t focus solely on one part of your software so that the main purpose isn’t achievable. Scope wisely.  Don't forget about journey lines to describe the user scenarios.  

1. **Department Head** 

> * **Actor:** Dr. Nelson, Department Head of CMPS
> * **Motivator:** Needs to efficiently allocate resources for the upcoming semester.
> * **Intention:** Identify instructors with unbalanced workloads (overloaded or underutilized) in  teaching and service commitments.
> * **Action:**
>    1. Logs into the Department Management System.
>    2. Navigates to the dashboard and reviews the teaching workload distribution visualization.
>    3. Identifies instructors with significantly higher or lower workloads than average.
>    4. Uses this information to adjust teaching and service assignments for a more balanced distribution (outside of the system).
> * **Resolution:** Dr. Nelson achieved a more equitable allocation of teaching and service tasks among instructors for the upcoming semester. 

2. **Department Staff**

> * **Actor:** Ms. Keeler, Department Assistant
> * **Motivator:** Needs to prepare for the upcoming academic session.
> * **Intention:** Ensure instructor service hours are up-to-date and accurate.
> * **Action:**
>    1. Logs into the system.
>    2. Updates instructor profiles with the latest service hour information.
> * **Resolution:** Ms. Keeler successfully updates instructor records for the upcoming session. 

3. **Instructor**
   
> * **Actor:** Dr. Chipinski, Associate Professor of Computer Science
> * **Motivator:** An upcoming faculty evaluation where service hour contributions will be assessed.
> * **Intention:** Ensure all her service activities are accurately recorded in the system for the evaluation.
> * **Action:**
>    1. Logs into the Department Management System.
>    2. Navigates to her profile and reviews the "Service Roles & Hours" section.
>    3. Notices that a recent committee meeting she attended is not listed.
>    4. Contacts the department staff (e.g., via email) to inform them of the missing activity and provide relevant details (date, duration, committee name).
> * **Resolution:** The department staff receives Dr. Chipinski's message, verifies the information, and adds the missing service activity to her record. Dr. Chipinski's service hours are now accurately reflected in the system for the upcoming evaluation. 

4. **IT/Administrators**

> * **Actor:** Mr. Steinfeld, IT staff
> * **Motivator:** New faculty and staff members are joining the department.
> * **Intention:** Create and initialize accounts for the new hires.
> * **Action:**
>    1. Logs into the system.
>    2. Creates new accounts for each individual, entering their username, password, name, and other relevant information.
> * **Resolution:** New instructors and staff have their accounts set up and can now access the system.

### Requirements:
    In the requirements section, make sure to clearly define/describe the **functional** requirements (what the system will do), **non-functional** requirements (performane/development), **user requirements (what the users will be able to do with the system and **technical** requirements.  These requirements will be used to develop the detailed uses in the design and form your feature list.
#### <ins>Functional Requirements:</ins>
    - Describe the characteristics of the final deliverable in ordinary non-technical language
    - Should be understandable to the customers
    - Functional requirements are what you want the deliverable to do

**Authentication and Account Management:**

  1. The system will allow users to **log in** using their email and password.
  2. The system will provide a **password reset** mechanism via email for users who have forgotten their password.
  3. The system will allow administrators to **create user accounts** with username, password, first name, and last name (authentication mechanism needed for creation of new admin accounts).
  4. The system will allow administrators to **deactivate user accounts**.
  5. The system will allow users to **edit** their **personal information**, including office location, phone number, photo, and password.
  6. The system will allow users to **log out** securely.

**Analytics and Visualizations:**

  7. The system will **compute** ***individual*** **instructor performance** data based on SEI, enrollment (e.g. student retention rate), service hours, student grades and store it in the database.
  8. The system will **compute instructor performance data** by ***subject taught***(COSC, MATH, PHYS or STAT).
  9. The system will **compute** ***departmental average*** **of instructor performances** and store it in the database.
  10. The system will **create visualizations of departmental/individual performance trends** from previously computed data.

**Insight and Reporting:**

  11. The system will allow department head and staff/instructors to **view performance-related data and visualizations.**
  12. The system will allow department head and staff/instructors to **view teaching/service role assignments.**
  13. The system will allow department head and staff to **filter performance data** by ***instructor***.
  14. The system will allow users to **filter teaching/service role assignments** by ***instructor***.
  15. The system will allow users to **filter performance data** by ***subject*** (MATH, COSC, STAT or PHYS).
  16. The system will allow users to **filter teaching/service role assignments** by ***subject*** (MATH, COSC, STAT or PHYS).
  17. The system will allow department head and staff to **export performance data** in a spreadsheet (e.g. XLS, CSV; file type TBD).

**Data Management:**

  18. The system will allow administrators/department head and staff to **import** SEI, enrollment, service and teaching roles, and other relevant data from external files (e.g. XLS, CSV, PDF - to be discussed with the client).
  19. The system will **automatically create service/teaching roles and courses** based on imported data.
  20. The system will allow administrators/department head and staff to **edit  service/teaching roles and courses**.
  21. The system will allow administrators/department head and staff to **delete service/teaching roles and courses**.
  22. The system will allow department staff to re-upload updated external files to **modify service hours and teaching assignments**.

**User Support and Additional Features:**

  23. The system will **send **monthly** notifications** to the department head and staff, reminding them to enter any new data (e.g. service hours).
  24. The system will include a user-friendly **help section** with tutorials and documentation for user training. 
   

#### <ins>Non-functional Requirements:</ins>
    - Specify criteria that can be used to judge the final product or service that your project delivers
    - List restrictions or constraints to be placed on the deliverable and how to build it; remember that this is intended to restrict the number of solutions that will meet a set of requirements.

**Usability:**

  1. **Intuitive Interface:** The system will be easy to understand and navigate, even for users with limited technical experience. Clear labels, logical menus, and helpful tooltips will guide users through the system.
  2. **Minimal Learning Curve:** New users will be able to quickly grasp the basic functions without extensive training. This can be achieved through  well-designed tutorials and readily available help resources.
  3. **Responsive Design:** The system will adapt to different screen and window sizes ensuring optimal usability for users.
  4. **Accessibility:** The system will comply with accessibility standards (e.g., WCAG) to ensure inclusivity for users with disabilities, such as providing screen reader compatibility and keyboard navigation options.

**Performance:**

  5. **Response Time:** Users will be able to expect quick responses to their actions within the system. A typical response time of 2-3 seconds is a good target. This can be achieved through efficient database queries and optimized code.
  6. **Scalability:** The system will be able to handle a growing number of users and increasing amounts of data without significant slowdowns. This may involve using scalable technologies and architectures that can be easily expanded.

**Security:**

  7. **Data Encryption:** Sensitive data like passwords must be encrypted both during transmission and while stored in the database to prevent unauthorized access.
  8. **Role-Based Access Control (RBAC):** Different user types (e.g., admin, department head, instructor) will have different permissions within the system, ensuring that only authorized personnel can access and modify certain data.

**Maintainability:**

  9. **Modular Design:** By breaking the system into smaller, independent modules, it becomes easier to update, fix bugs, or add new features without affecting the entire system.
  10. **Clear Documentation:** Comprehensive documentation helps new developers or administrators understand how the system works, making it easier to maintain and extend its functionality in the future.
  11. **Error Handling:** The system will display clear and helpful error messages to users when issues arise.

**Project Constraints:**

  12. **Timeline:** The project will be completed by August 9th, 2024.
  13. **Budget:** The development cost is $0.
  14. **Quality:** All system tests must pass to ensure that the software functions correctly and reliably before deployment. 


#### <ins>User Requirements:</ins>
    - Describes what the user needs to do with the system (links to FR)
    - Focus is on the user experience with the system under all scenarios

**General Users (All Users):**

  1. The user will be able to **log in** securely using their email and password.
  2. The user will be able to **reset** their **password** if forgotten.
  3. The user will be able to **edit** their **personal information and profile** (e.g. office location, phone number, photo, password).
  4. The user will be able to access a user-friendly **help section** with tutorials and documentation to assist with learning how to use the system.
  5. The user will be able to **log out**.

**Department Head:**

  6. The department head will be able to **view data visualizations** of **department performance** and the **performance of individual instructors**.
  7. The department head will be able to **view teaching/service role assignments**, along with the corresponding service hours completed.
  8. The department head will be able to **filter performance data and teaching/service role assignments** by ***subject*** and **instructor** (MATH, COSC, STAT or PHYS).

**Department Staff (also enabled for Department Head):**

  9. The department staff will be able to **import new data**(SEI, enrollment, teaching assignments, etc.) from spreadsheets.
  10. The department staff will be able to **view and edit service/teaching role information** and **course information**.
  11. The department staff will be able to **delete** outdated or incorrect **service/teaching roles** and **courses**.
  12. The department staff will be able to **export performance data** in a spreadsheet (e.g. XLS, CSV; file type TBD).

> **Nice-To-Have (not for Department Head):** \
> 13. The department staff will receive monthly **reminders** to enter new data (e.g. service hours).

**Instructors:**

  14. The instructor will be able to **view personal performance reports** that compare their individual results to the department's overall benchmarks and averages.
  25. The instructor will be able to **view their teaching/service role assignment**, along with service hours completed.

**IT/Administrators:**

  16. The admin will be able to **create new user accounts** (admin or non-admin).
  17. The admin will be able to **deactivate user accounts** if necessary.
  18. (The admin will be able to **set benchmark working hours** for different service roles.) - To be discussed with the client 


#### <ins>Technical Requirements:</ins>
    - These emerge from the functional requirements to answer the questions: 
    - How will the problem be solved this time and will it be solved technologically and/or procedurally? 
    - Specify how the system needs to be designed and implemented to provide required functionality and fulfill required operational characteristics.

1. For logging in, our database will have a User table containing log-in information (username, password, account type). The system will check if the inputted email and password matches an entry in the database.  
2. For resetting passwords, we will send an email to the user, asking them for a new password. Their password will then be updated in the database. 
3. For creating accounts, the user inputted account information will be added as a new entry in the User table of the database. 
4. For deleting accounts, the system will delete the row in the User table, as well as any other rows that contain that user’s ID. 
5. For editing account information, the system will update the user’s row in the User table with the new information. 
6.+7. For uploading data, the system will ask for a csv file upload, read the file, then update the database with the results. 
8. For creating new service roles, the system will read the data file then create new entries in the service role table of our database. 
9. For deleting service roles, the system will find the entry the user wants deleted, and remove it from the database along with all other data entries related to that role.  
10. For viewing data, the system will pull the necessary information from the database and display it to the user in text form. 
11. For exporting data, the system will pull the required information from the database, convert it to an excel spreadsheet, and allow the user to download it. 
12. For generating data visualizations, the system will pull the necessary information from the database, then draw a simple graph on the screen using CSS or a similar concept. 
13. For separating the data, the system will provide buttons or tabs that immediately filter the data based on the current selection. 
14. For editing working hours, the system will provide a form that allows the user to edit any inaccurate data such as working hours. 
15. For viewing instructor assignments, the system will allow the user to select a professor and view all of the courses that they work on. 
16. For sending monthly notifications, the system will send out an email to the department staff on the 1st of each month (How to do this: TBD). 
17. For setting benchmarks, the system will allow the department head to select a role, and input their desired performance benchmark for that role. 
18. For helping new users, the system will have a “help” section that explains the basic functions of the system. 
19. For searching, the system will provide a search bar that will take in user input, query the database for whatever they’re looking for, and display the results to the user. 
20. The system will provide a text input section that allows an admin to create a new admin by inputting their email address.

Other Technical Requirements:

* The system will have tests for all functions
* There will be a mock database specifically made for testing
* The system will be dockerized
* The system will be run on a desktop web browser
* Data will be passed through the system in JSON objects
* The main database will:
    * Use mySQL
    * Have separate tables for each data object, including but not limited to:
        * Users
        * Service Roles
        * SEI Data
        * More of this will be solidified in the design phase
    * Tables will be connected via foreign keys 

  
## Tech Stack
    Identify the “tech stack” you are using. This includes the technology the user is using to interact with your software (e.g., a web browser, an iPhone, any smartphone, etc.), the technology required to build the interface of your software, the technology required to handle the logic of your software (which may be part of the same framework as the technology for the interface), the technology required to handle any data storage, and the programming language(s) involved. You may also need to use an established API, in which case, say what that is. (Please don’t attempt to build your API in this course as you will need years of development experience to do it right.) You can explain your choices in a paragraph, in a list of bullet points, or a table. Just make sure you identify the full tech stack.
    For each choice you make, provide a short justification based on the current trends in the industry. For example, don’t choose an outdated technology because you learned it in a course. Also, don’t choose a technology because one of the team members knows it well. You need to make choices that are good for the project and that meet the client’s needs, otherwise, you will be asked to change those choices.  Consider risk analysis. 

**Frontend (Client-Side):**

* **Languages:**

    * **HTML:** The standard markup language for structuring web pages.
    * **CSS:** The standard styling language for visually designing web pages.
    * **JavaScript:** The primary language for adding interactivity and dynamic behavior to web pages. 

* **Libraries:**

    * **React:** Allows component-based development, making the code more organized, reusable, and easier to maintain. Also, a popular choice in the industry nowadays, making scalability and maintainability possible.
    * **jQuery:** Simplifies common tasks like DOM manipulation and event handling. 

* **UI Design Tool:**

    * **Figma:** Allows easy prototyping, wireframing, and sharing of UI designs. 

* **Framework:**

    * **Bootstrap:** Provides a set of pre-styled UI components (buttons, forms, navigation) and responsive grid system, speeding up development and ensuring a consistent look and feel across different devices.

**Backend (Server-Side):**

* **Languages:**

    * **PHP:** A popular and mature scripting language often used for web development.
    * **Python:** Provides readability and strong libraries for data analysis and machine learning (which could be useful for future project enhancements).
    * **Java:** Has a wide range of libraries and frameworks, offering flexibility for building complex backend systems. 

* **Database:**
  
    * **MySQL:** Reliable, widely used and relational. We all have experience with it from COSC 304, making it a familiar choice for data storage and retrieval. 

* **API (Application Programming Interface):**
  
    * **Email Connection (specific API TBD):** Necessary for sending password reset links and notifications to users.

**Development Tools:**

* **IDE:**

    * **Visual Studio Code:** Popular, free, and versatile. It has extensive extensions and support for multiple languages. 

* **Containerization:**
  
    * **Docker:** Allows us to package our application and its dependencies into a container, ensuring consistent behavior across different environments and making deployment easier. 

* **Version Control:**
  
    * **Git (hosted on GitHub):** The standard for tracking code changes and collaborating on software projects.  GitHub provides cloud hosting and additional features such as the Kanban board and integration with TravisCI and Clockify.

**Coding Conventions:**

* **Variable Naming:** snake_case for Python/PHP and camelCase for Java to improve code readability and maintainability.

## High-level risks
    Describe and analyze any risks identified or associated with the project. 

**Technical Risks:**

* **Data Accuracy and Consistency:** Inconsistent data formats or infrequent updates could compromise the reliability of reports and analysis.
* **Security Vulnerabilities:** Unauthorized access or data breaches pose a risk to data integrity and user trust.

**User-Related Risks:**

* **Low Adoption Rate:** Faculty and staff may resist using the system if it's not user-friendly or perceived as valuable.
* **Data Entry Errors:** Manual data editing could introduce errors, impacting the accuracy of information.
* **Ranking System Limitations:** Gamification and the ranking system might not be suitable for all staff members or new instructors.

**Organizational Risks:**

* **Changing Requirements:** Shifting priorities or evolving needs within the department could lead to scope creep or delays.
* **Resource Constraints:** Limited time or expertise (e.g., use of React without prior knowledge) within the team could impact the project's progress.

## Assumptions and constraints
    What assumptions is the project team making and what are the constraints for the project?

**Assumptions:**

1. **Data Availability:** The department has access to accurate and up-to-date data on instructor profiles, course enrollments, SEI scores (even those who do not receive student evaluations), and service contributions. This data can be readily exported into a format compatible with the system (e.g., CSV, XLS). 

2. **Accurate Workload Data:** The actual amount of time each department member works aligns with the expected hours per week for their role. This assumes that instructors and staff accurately report their hours or that this data can be reliably obtained from other sources. 

3. **User Engagement:** Faculty and staff are willing to use the new system and provide feedback for its improvement. 

4. **Stable Environment:** The underlying technologies (React, MySQL, etc.) will remain relatively stable during the development and initial deployment period, requiring minimal adjustments to the system. 

5. **Limited Scope Creep:** The scope of the project will remain within the defined MVP boundaries, with minimal changes to requirements during development. 


**Constraints:**

1. **Timeline:** The project must be completed by August 9th, 2024. This requires careful planning and prioritization of features. 

2. **Budget:** The project has a budget of $0 for development. This may limit the scope of features and the amount of external support available. 

3. **Technical Expertise:** The development team's expertise is primarily in traditional web development technologies (HTML, CSS, vanilla JavaScript, PHP). This may necessitate learning new skills or seeking external help for specific tasks. 

4. **Data Privacy:** The system must adhere to UBC's data privacy policies and regulations, limiting the types of data that can be used. 

5. **Hardware/Software Limitations:** The system's performance and scalability may be constrained by the available hardware and software resources. 


## Summary milestone schedule

    Identify the major milestones in your solution and align them to the course timeline. In particular, what will you have ready to present and/or submit for the following deadlines? List the anticipated features you will have for each milestone, and we will help you scope things out in advance and along the way. Use the table below and just fill in the appropriate text to describe what you expect to submit for each deliverable. Use the placeholder text in there to guide you on the expected length of the deliverable descriptions. You may also use bullet points to clearly identify the features associated with each milestone (which means your table will be lengthier, but that’s okay).  The dates are correct for the milestones.  

<table>
  <tr>
   <td><strong>Milestone</strong>
   </td>
   <td><strong>Deliverable</strong>
   </td>
  </tr>
  <tr>
   <td>May 29th
   </td>
   <td>Project Plan Submission
   </td>
  </tr>
  <tr>
   <td>May 29th
   </td>
   <td>A short video presentation describing the user groups and requirements for the project. This will be reviewed by our client and the team will receive feedback.
   </td>
  </tr>
  <tr>
   <td>June 5th
   </td>
   <td>Design Submission: 
<ul>

<li>A plan for the design of the project and the system architecture (architecture diagram, DFD level 0 & 1) will be completed. 

<li>Use cases (use case diagram & use case descriptions) will be fully developed. 

<li>The general user interface design will be implemented (mock-ups), including consistent layout, color scheme, text fonts, etc.

<li>A diagram showing how the user will interact with the system will be demonstrated.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>June 5th
   </td>
   <td>A short video presentation describing the design for the project. This will be reviewed by our client and the team will receive feedback.
   </td>
  </tr>
  <tr>
   <td>June 14th
   </td>
   <td>Mini-Presentations: A short description of the parts of the envisioned usage we plan to deliver, with no additional explanation beyond what was already in our envisioned usage. We aim to have the following 3 features working and fully tested by this point:
<ol>

<li>Logging in/Logging out

<li>Importing spreadsheet

<li>Displaying list of instructors and service/teaching roles
</li>
</ol>
   </td>
  </tr>
  <tr>
   <td>July 5th
   </td>
   <td>MVP Mini-Presentations: A short description of the parts of the envisioned usage we plan to deliver for this milestone, with no additional explanation beyond what was already in our envisioned usage. We aim to have close to 50% of the features working and fully tested for this milestone. This is equal to roughly all the features we have in the MVP. Please see MVP description above for features expected to be implemented and fully tested by this date.
<p>
 *Clients will be invited to presentations
   </td>
  </tr>
  <tr>
   <td>July 19th
   </td>
   <td>Peer testing and feedback: We aim to have an additional two features implemented and tested per team member. Features to be implemented will depend on project progress and task priorities (TBD).
   </td>
  </tr>
  <tr>
   <td>August 2nd
   </td>
   <td>Test-O-Rama: Full scale system and user testing with everyone
   </td>
  </tr>
  <tr>
   <td>August 9th
   </td>
   <td>Final project submission and group presentations.
   </td>
  </tr>
</table>


## Teamwork Planning and Anticipated Hurdles
    Based on the teamwork icebreaker survey, talk about the different types of work involved in a software development project. Start thinking about what you are good at as a way to get to know your teammates better. At the same time, know your limits so you can identify which areas you need to learn more about. These will be different for everyone. But in the end, you all have strengths and you all have areas where you can improve. Think about what those are, and think about how you can contribute to the team project. Nobody is expected to know everything, and you will be expected to learn (just some things, not everything).
    Use the table below to help line up everyone’s strengths and areas of improvement together. The table should give the reader some context and explanation about the values in your table.

    For **experience** provide a description of a previous project that would be similar to the technical difficulty of this project’s proposal.  None, if nothing
    For **good At**, list of skills relevant to the project that you think you are good at and can contribute to the project.  These could be soft skills, such as communication, planning, project management, and presentation.  Consider different aspects: design, coding, testing, and documentation. It is not just about the code.  You can be good at multiple things. List them all! It doesn’t mean you have to do it all.  Don’t ever leave this blank! Everyone is good at something!

<table>
  <tr>
   <td><strong>Category</strong>
   </td>
   <td><strong>Jeremy Adams</strong>
   </td>
   <td><strong>Subaru Sakashita</strong>
   </td>
   <td><strong>Kevin Kim</strong>
   </td>
   <td><strong>Zhiheng Zhang</strong>
   </td>
   <td><strong>Adams Chen</strong>
   </td>
  </tr>
  <tr>
   <td>Experience
   </td>
   <td>Design
<p>
Front-end 
<p>
Logic 
<p>
Coding 
<p>
Git 
<p>
Project management
   </td>
   <td>Front-end & back-end coding
<p>
Kanban management
   </td>
   <td>Front-end & Back-end
<p>
Kanban management
<p>
Database
<p>
Project management
   </td>
   <td>Front-end
<p>
Back-end
<p>
UI design
<p>
Video editing
   </td>
   <td>Design
<p>
Front-end UI & logic 
<p>
Back-end logic and database connection
<p>
DBMS (DDL, DML)
<p>
Project management
   </td>
  </tr>
  <tr>
   <td>Good At
   </td>
   <td>Documentation 
<p>
Tests
   </td>
   <td>Coding
<p>
Debugging 
<p>
Giving ideas
   </td>
   <td>Coding
<p>
Design
<p>
Schedule management
   </td>
   <td>Coding
<p>
Debugging
   </td>
   <td>Design
<p>
Coding
<p>
Project management
   </td>
  </tr>
  <tr>
   <td>Expect to learn
   </td>
   <td>React 
<p>
More database related things
   </td>
   <td>New Framework and better understanding of programming languages 
<p>
Docker 
<p>
Project management
   </td>
   <td>Framework
<p>
PHP
<p>
To be more comfortable with workflows, backend system, getting used to the libraries
   </td>
   <td>React
<p>
PHP and other possible required new knowledge
   </td>
   <td>React
<p>
CI/GitHub Actions
<p>
Integration & Regression Testing
<p>
PyTest (if using Python)
<p>
Bootstrap 
<p>
Email sending API
<p>
Docker
   </td>
  </tr>
</table>


    Use this opportunity to discuss with your team who **may** do what in the project. Make use of everyone’s skill set and discuss each person’s role and responsibilities by considering how everyone will contribute.  Remember to identify project work (some examples are listed below at the top of the table) and course deliverables (the bottom half of the table). You might want to change the rows depending on what suits your project and team.  Understand that no one person will own a single task.  Recall that this is just an incomplete example.  Please explain how things are assigned in the caption below the table, or put the explanation into a separate paragraph so the reader understands why things are done this way and how to interpret your table. 

<table>
  <tr>
   <td><strong>Category of Work/Features</strong>
   </td>
   <td><strong>Jeremy Adams</strong>
   </td>
   <td><strong>Subaru Sakashita</strong>
   </td>
   <td><strong>Kevin Kim</strong>
   </td>
   <td><strong>Zhiheng Zhang</strong>
   </td>
   <td><strong>Adams Chen</strong>
   </td>
  </tr>
  <tr>
   <td>Project Management: Kanban Board Maintenance
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>System Architecture Design
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>User Interface Design 
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Instructor Profile Management
   </td>
   <td>X (FE)
   </td>
   <td>X (BE)
   </td>
   <td>X (FE)
   </td>
   <td>
   </td>
   <td>X (BE)
   </td>
  </tr>
  <tr>
   <td>Course Management
   </td>
   <td>X (FE)
   </td>
   <td>X (BE)
   </td>
   <td>X (FE)
   </td>
   <td>
   </td>
   <td>X (BE)
   </td>
  </tr>
  <tr>
   <td>Service Role Management
   </td>
   <td>X (FE)
   </td>
   <td>X (BE)
   </td>
   <td>X (FE)
   </td>
   <td>
   </td>
   <td>X (BE)
   </td>
  </tr>
  <tr>
   <td>Basic Analysis & Visualize
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Performance Analysis
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Login/Logout
   </td>
   <td>X (FE)
   </td>
   <td>X(BE)
   </td>
   <td>X (FE)
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Password Reset & Email Notification
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Import/Export file
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Database setup
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Presentation Preparation
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Design Video Creation
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Design Video Editing
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Design Report
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Final Video Creation
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Final Video Editing
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>X
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Final Team Report
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
  <tr>
   <td>Final Individual Report
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
   <td>X
   </td>
  </tr>
</table>

*FE = Front-end, BE = Back-end
