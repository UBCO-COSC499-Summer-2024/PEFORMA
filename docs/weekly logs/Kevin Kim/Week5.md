
# Week 5

## Friday (6/13/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.12-6.13/5.2.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/Kevin-weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.12-6.13/5.2.2.png)

### Current Tasks
  * #1: Showing 10 courses per page (Course list instructor view)
  * #2: Start working on publishing performance page (Instructor view)

### Progress Update (since 6/5/2024)
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
        <td>#91: Organizing file structure and routing 
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Our project files were under src file and not organized, had to make it clean by putting them as JS and CSS (Instructor view, department view, etc..). After moving all files into their position, did routing for each pages to be viewed easily. Merging all files (all pushed in different directory) into one and finalize took me to resolve merge conflicts.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#114: Set up course list page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Based on what I recieved from Zhiheng that he made a starting point for course list page, I continued that and setting up is done
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#116: Connection between course list page -> Instructor profile page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Connected a course list page to instructor profile view. User now will be able to view other instructor profile page from course list (Listed as course, whos teaching). Each individual instructor profile page will be viewed with their unique ubcid as a parameter. 
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#119: Show respective division course lists by selection
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Once user enter course list page by selecting division from dashboard, user will see each different division by divisionCode as parameter (Computer science will be COSC, etc...). User can easily navigate to different division from select button on the top right to see other divisions course lists. If user clicks COSC, it will only show computer science course lists, Math will be only showing math courses.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#115: Paginate function 
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>It reads the total number of courses from json file, and based on that it will show the total pages of the course lists. For example, if there are 27 courses, it will shouw total 3 pages. 
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#117: Styling course list page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>Stylied based on what we have defined from mock up design.
        </td>
    </tr>
</table>

### Weekly Goal Review
  * My goal for this cycle was to finish routing to show demo version on this friday and organizing files under right directories. Also, I started and finished except only one feature that showing 10 courses per page. Tried slicing courses to show 10 each but I encountered some errors that if there are courses less than 10, the array is empty. Overall I feel like I worked a lot within 2 days of short cycle and made a lot of progress. I also never forget to do pr reviews as well :)

### Next Cycle Goals
  * My next cycle goal is to finish last feature of course list, which is showing 10 courses per page. Once it is done, I will start working on performance page which I feel like it is going to be a lot hard because it has some graphs and other complicated features. I can't guarantee that performance page will be done by next cycle, but I will try my best.

## Wednesday (6/12/2024)

### Timesheet
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.7-6.11/5.1.1.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.7-6.11/5.1.2.png)
![alt text](https://github.com/UBCO-COSC499-Summer-2024/team-6-capstone-team_6ix/blob/weekly-logs/docs/weekly%20logs/Kevin%20Kim/Clockify%20images/6.7-6.11/5.1.3.png)
### Current Tasks
  * #1: Start working on publishing course list page (Instructor view)
  * #2: Make course list page to be responsive with json file, and also make a connection with instructor profile page 

### Progress Update (since 6/5/2024)
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
        <td>Record my portion for design video
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>
         I took part of recording UI desing mockup of performance dashboards pages for each Instructor and Department view
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Edit video
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td> Edited all team members to one video and trimmed to be in time limit which was 8 ~ 10 mins. Adjusted size of screen for each video, decibels of each videos to be more natural as one flow.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Help team to set up docker, combine Zhihengs file structrue with mine
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td>
         Gave team a guidline of how to set up the docker, combining Zhihengs file structure to my docker set up enviroment required us to communicate and make a lot of pr.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Instructor Profile Page (Instructor View)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td> Finished publishing instructor profile page as we designed in figma, ui mockups, defined web page using axios to be responsive with json file and shows the data on the container. It is all set it up, in the future, backend will shoot the json file as I have requested and will fetch and show the data.
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Sidebar (Common Area)
        </td>
        <!-- Status -->
        <td>Complete
        </td>
        <!-- Notes -->
        <td> Since sidebar is a common area where it shows all pages from instructor view and department view, we have seperated as its called sidebar.js to be imported from other files. Good to reduce code duplicates. Finished publishing for both instructor and department view for each sidebar with respective icons. URL redirection is not yet defined as we have not finished implementing all the baselines of each pages. 
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Orgainze and URL connection
        </td>
        <!-- Status -->
        <td>In progress
        </td>
        <!-- Notes -->
        <td> Since there are so many pull requests are open to be merged, still waiting them to be fully merged and adapt into new file directory. Once all files are set, will start working on URL connection
        </td>
    </tr>
</table>

### Weekly Goal Review
  * Overall we made a great progress on this project. I have started on publishing each pages and worked as frontend developer to connect and fetch the data to backend server. At first, it took me a learning curve of how to implement axios properly, but I managed and now its working.

### Next Cycle Goals
  * Since this week friday will be covering a mini presentation for each team to work on, so my top priority work for this cycle would be preparing on mini presentation, if time permits, I will work on url connection and publishing cousre list view.


<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->

