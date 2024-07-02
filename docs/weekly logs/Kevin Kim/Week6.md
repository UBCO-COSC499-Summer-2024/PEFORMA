# Week 6
## Friday (6/21/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.19-6.20/6.2.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.19-6.20/6.2.2.png)

### Current Tasks
  * #1: Discuss what data would be used for department performance page
  * #2: Implement department performance page

### Progress Update (since 6/19/2024)
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
        <td>#183, #185: Service role list (Department view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Finished implementing service role list and added new feature of adding empty rows to match units of 10 (formatting table).
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#188, #185, #189: Course list (Department view)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Finished implementing course list for department view and added 2 more features of search function and formatting table by adding empty rows
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#195, #196: Update course list (Instructor view) 
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Updated implementing search function and formating function on the course list that was previosuly implemented
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Add progress chart in performance page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Added progress chart for benchmark as requested
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Testing service role list
        </td>
        <!-- Status -->
        <td>In progress
        </td>
        <!-- Notes -->
        <td>Tried testing service role list however, I encountered lots of errors. Could not fix it, I need more time to finish test.
        </td>
    </tr>
</table>

### Weekly Goal Review
  * Within 2 days of short cycle, my goal was to finish at least one page of MVP for FE however, I was able to manage two pages with new features which are search function and formating function. I think Im satisfied with what I have worked on this cycle.

### Next Cycle Goals
  * I am going to visit my family tomorrow until next monday so I hope I could work when I get back on tuesday. I will implement a performance page for department view on next tuesday and hopefully write at least one test code. I have noticed my team a month advance, no problems at all for now!

<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
## Wednesday (6/19/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.14-6.18/6.1.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.14-6.18/6.1.2.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.14-6.18/6.1.3.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.14-6.18/6.1.4.png)

### Current Tasks
  * #1: Publish one of the department page (Not defined yet) Probably showing service roles list.
  * #2: Let BE know what kind of data retrival is needed.

### Progress Update (since 6/14/2024)
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
        <td>#132: Showing 10 courses per page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Showing 10 courses per page and remain courses move on to next page.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#139, #140, #141, #142, #155: Performance instructor view
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Performance page contains 4 different features which are information section, bar chart (working hours), pie chart (department performance), and leaderboard (leaderboard for belonging division). All four different features are completely done, just need to get data from BE and good to go!
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#157: Show all instructors if there are more than 2 instructors teaching same course
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Requested by Adams, fixed it as how he requested. Changed json file format of just putting instructor, ubcid, and email as an array.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#162: Make a new divison called All
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Make new division called All under course list so that user can chooose another option that can view all current courses. Reason why adding this option is easier for search feature.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Saving token locally and send to BE
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Save token locally so that later on FE can send that token to BE. Task size is small however, had to go over all the codes and understand how token is generated, so took lots of time.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#170, #171: Saving profileId locally and send to BE 
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Save profiledId locally, send to BE so that BE can retrieve the data based on that logged in user profile id.
        </td>
    </tr>
</table>

### Weekly Goal Review
  * My goal was to finish performance instructor view and I manged it to finish before monday. Once I finish performance page, authentication feature was finished so I started to work on login FE which controlls the token and profileId and that was top priority because in order to retrieve based on the logged in user. Overall, I had lots of trobles with token and profileId however all the features that should done by FE is 100% done! I planned to visit my family starting from June 21 till 24th so I over worked not to slow the project down.

### Next Cycle Goals
  * Until friday, I hope I could finish one of the department view page for mvp. Not sure which page I will going to work on, but I assume I can manage one page at least.


