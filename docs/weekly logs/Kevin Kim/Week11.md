<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
## Friday (7/26/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.24-7.25/11.2.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.24-7.25/11.2.2.png)

### Current Tasks
  * Refactor left over department views (teaching assignment, teaching assignment detail, SEI page, and instructor views (performance pages and performance imports)

### Progress Update (since 7/24/2024)
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
        <td><strong>NOTES</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#496: Refactor deptCourseList
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fully refactored, fixed export function
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#497: Refactor DeptMemberList
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fully refactored, modified some export function and refactored it
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#498: Refactor DeptPerformancePage
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Made huge refactoring progress on performance page, merging 4 different division tables to one file, removed redundant axios.get function in performance pages and imported pages, instead used state to send info to division table
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#499: Refactor DeptServiceRoleList
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fully refactored, fixed export function
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#502: Refactor DeptStatusChangeCourse
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fully refactored, toggleStatus
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#503: Refactor DeptStatusChangeServiceRole
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fully refactored, toggleStatus
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#504: Refactor AdminStatusChangeMember
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fully refactored, toggleStatus
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#505: Refactor InsCourseList
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Refactored and shorten to very clean code
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#506: Refactor InsProfilePage
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Added a case when fetchWithAuth in utils.js handling when params is sent as parameter in order to refactor and make it to reusable
        </td>
    </tr>
</table>

### Weekly Goal Review
In this two days of cycle, I have made a lot of progress in regarding refactoring my implementations. I have checked that there are 25+ pages I need to refactor because I implemented these files, and I have finished total 12 pages refactoring. I mostly covered all the redundant functions into utils.js so I hope the remaining files I need to refactor wouldnt be that painful.

### Next Cycle Goals
  * Until next wednesday, I am planning to finish refactoring all the files I have implemented. Also, I feel like there would be a new features that should be added by looking at the functional requirements list. I hope I can manage to hanlde new features as well.


<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
## Wednesday (7/24/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.19-7.23/11.1.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.19-7.23/11.1.2.png)


### Current Tasks
  * #1: Refactoring instructor views

### Progress Update (since 7/19/2024)
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
        <td><strong>NOTES</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#470: Reflect feedback on sidebar
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>After peer testing, I fixed the sidebar naming convention such that user wont able to find where the course creation is.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#471: Reflect feedback on Performance Page (Dept view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>User werent able to see the button 1, 2, 3, 4 as it represents a year code. So changed to 100, 200, 300, 400
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#474, #477: Top bar includes terms list
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Added a feature on fetching terms list from database (Worked FE and BE)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#476, #478: Set a new term from top bar
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Added a feature on selecting and set a new term as user wants
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#485: Refactoring admin views (Create Account, Member List)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Refactored these two pages to follow the rule of SRP and also refactored codes to be reusable
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#489: Refactoring admin member status controller
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Refactored filtering function pulling out to utils.js to be reusable
        </td>
    </tr>
</table>

### Weekly Goal Review
  * This week was tough for me to working on tasks because I receieved a bad news from my dad about family issue. However I was able to manage my assigned tasks and also did more than I planned. Our team found a huge problem that our system is not reusable so had a team meeting and found a solution to improve on that. I managed to finish updating ddl and dml and a new feature that user can select a term which the system will be worked based on the current term that user sets on. Also, I managed to finish working on refactoring admin views. I pretty much followed the rules of each function has one functionality and also refacotred a reusable codes. Im not sure when I can mentally recovered and fully focus on project to have better efficiency on working as before but I will finish my assigned tasks and wont affect to team progress.

### Next Cycle Goals
  * Until friday, which is next cycle date, I will finish refactoring instructor view pages. 
