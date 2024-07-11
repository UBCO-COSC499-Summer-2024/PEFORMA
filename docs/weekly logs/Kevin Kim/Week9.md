<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
## Friday (7/12/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.10-7.11/9.2.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.10-7.11/9.2.2.png)


### Current Tasks
  * #1: Start testing of what I have implemented

### Progress Update (since 7/10/2024)
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
        <td>#374: Create account (admin view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#355: Side bar for admin view
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#375: Teaching assignment (department view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Having seperate landing page to show overview of current term showing what courses are there, whos assigned into each division. Detail page has all layouts of teaching assignments.
        </td>
    </tr>
</table>

### Weekly Goal Review
  * In terms of admin view, our team decided not to have course list, service role list, dashboard in admin view because it is going to be the same from department view. So I was able to manage my task with finishing create account admin page and teaching assignment in department view. My goal was to finish all implementation by July 12, friday so I can enter to testing phase. I feel like im on the right schedule, not delayed for a single step and making a good progress.

### Next Cycle Goals
  * I hope to finish at least 60 ~ 70% of tests that I have implemented so far. Meanwhile testing, I will start working on refactoring at the same time because refactoring sometimes affect on original test files as well. 

<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
## Wednesday (7/10/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.5-7.10/9.1.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.5-7.10/9.1.2.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.5-7.10/9.1.3.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/7.5-7.10/9.1.4.png)


### Current Tasks
  * #1: Implementing all admin views

### Progress Update (since 7/5/2024)
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
        <td>#325: Refactoring file names, path, variables, redundent features (fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearcChange, checkAccess)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Finished chaning all file names to be more intuitive, fixed all the pathts, fixed testing to be adjusted with new names and path, fixed variables to be more consistent and intutive. Refactored and made it to reusable under utils.js (fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#341: Switch Account
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Fixed BE to send accountType in access to FE, switch account saved under refactored topbar and checks possible switchable accounts that are in array (accountType), also made a new variable called accountLogInType that accessCheck checks this logintype.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#327: Refactoring sidebar
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>There were lots of redunent sidebars relying on different views, but merged and refactored into one file.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#328: Refactoring topbar
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>There were lots of different top bar files including if this top bar has search bar or not. Merged and refactored into one top bar which contains switch cases to show with respective parameter.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#322: Member list (department view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Show active member list under department view (no status controller)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#334: Service role status controller (department view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Now departmnet can controll the status activate/deactivate the specific service role.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#352: Member list + member account status controller (admin view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Show all member in database and let admin to control the account status of activate/deactivate.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#353: Course status controller (department view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Now department can activate/deactivate course with following courseid sent to BE
        </td>
    </tr>
</table>

### Weekly Goal Review
  * After MVP I felt that we dont have enough time to finish implementing, refactoring and documenting. So I decided to work a lot in this cycle in order to finish implementing all features. In this cycle, I have touched lots of parts in terms of refactoring, and I feel like most of the part that were implemented by me are all refactored, and just need to change some variable names. Also, I finished about more than 10 medium ~ big sized features so I think I made a great progress.

### Next Cycle Goals
  * Until friday, I will finish implementing all admin views (course list, service roles, dashboard, course lists) also teaching assignments under department veiw too.
