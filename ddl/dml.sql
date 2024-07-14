-- Division
INSERT INTO public."Division" ("divisionId", "dcode", "dname") VALUES
(1, 'COSC', 'Computer Science'),
(2, 'MATH', 'Mathematics'),
(3, 'PHYS', 'Physics'),
(4, 'STAT', 'Statistics');

-- Profile (add department staff and admin users)
INSERT INTO public."Profile" ("profileId", "firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark", "imageId") VALUES
-- Instructors 
    -- COSC
    (1, 'John', NULL, 'Doe', 'john.doe@ubc.ca', '250-555-1212', 'SCI', '101', 'Professor', 1, 00000001, 15, 50, 1),
    (2, 'Jane', 'Allison', 'Smith', 'jane.smith@ubc.ca', '250-555-3456', 'ASC', '215', 'Associate Professor', 1, 00000002, 8, 120, NULL),
    (3, 'Robert', NULL, 'Brown', 'robert.brown@ubc.ca', '250-555-7890', 'SCI', '302', 'Sessional Lecturer', 1, 00000003, 0, 10, NULL),
    (4, 'Emily', NULL, 'Davis', 'emily.davis@ubc.ca', '250-555-2345', 'ART', '420', 'Professor Emeritus', 1, 00000004, 0, 0, NULL),
    -- MATH
    (5, 'David', NULL, 'Kim', 'david.kim@ubc.ca', '250-555-6789', 'SCI', '123', 'Professor', 2, 00000005, 20, 80, 2),
    (6, 'Sarah', 'Lee', 'Chen', 'sarah.chen@ubc.ca', '250-555-9012', 'SCI', '234', 'Assistant Professor', 2, 00000006, 5, 110, 3),
    (7, 'Michael', NULL, 'Nguyen', 'michael.nguyen@ubc.ca', '250-555-3456', 'EME', '345', 'Associate Professor', 2, 00000007, 12, 90, NULL),
    (8, 'Olivia', 'Marie', 'Rodriguez', 'olivia.rodriguez@ubc.ca', '250-555-7890', 'ASC', '456', 'Assistant Professor', 2, 00000008, 8, 100, NULL),
    -- PHYS
    (9, 'Daniel', NULL, 'Taylor', 'daniel.taylor@ubc.ca', '250-555-1122', 'SCI', '124', 'Lecturer', 1, 00000009, 3, 50, NULL),
    (10, 'Sophia', 'Anne', 'Wilson', 'sophia.wilson@ubc.ca', '250-555-3344', 'ART', '235', 'Sessional Lecturer', 3, 00000010, 3, 10, NULL),
    (11, 'William', NULL, 'Anderson', 'william.anderson@ubc.ca', '250-555-5566', 'EME', '346', 'Professor of Teaching', 3, 00000011, 3, 45, NULL),
    (12, 'Aiden', NULL, 'Moore', 'adien.moore@ubc.ca', '236-555-8765', 'ASC', '213', 'Professor', 3, 00000012, 34, 80, NULL),
    -- STAT
    (13, 'Ava', NULL, 'Martinez', 'ava.martinez1@ubc.ca', '250-555-7788', 'ASC', '457', 'Professor Emeritus', 4, 00000013, 0, 0, NULL),       -- <-- People w/ the same name
    (14, 'Ava', NULL, 'Martinez', 'ava.martinez2@ubc.ca', '236-478-1590', 'SCI', '111', 'Asssitant Professor', 4, 00000014, 60, 120, NULL),   -- <--
    (15, 'Ethan', NULL, 'Anderson', 'ethan.anderson@ubc.ca', '236-555-9876', 'EME', '414', 'Asssitant Professor', 4, 00000015, 12, 95, NULL), 
-- Department Staff
(16, 'Alice', NULL, 'Johnson', 'alice.johnson@staff.ubc.ca', '250-555-9876', 'SCI', '200', NULL, NULL, 00000016, 0, 0, NULL),  
(17, 'Bob', NULL, 'Lee', 'bob.lee@staff.ubc.ca', '250-555-9876', 'SCI', '200', NULL, NULL, 00000017, 0, 0, NULL),
-- Admin
    -- UBC admins
    (18, 'Kevin', NULL, 'Kim', 'kkim9901@student.ubc.ca', '250-666-6661', NULL, NULL, NULL, NULL, 66666661, 0, 0, NULL),                              
    (19, 'Jeremy', NULL, 'Adams', 'jeremyadams166@gmail.com', '250-666-6662', NULL, NULL, NULL, NULL, 66666662, 0, 0, NULL),
    (20, 'Zhiheng', NULL, 'Zhang', 'm15601654187@163.com', '250-666-6663', NULL, NULL, NULL, NULL, 66666663, 0, 0, NULL),
    (21, 'Subaru', NULL, 'Sakashita', 'baruchan@student.ubc.ca', '250-666-6664', NULL, NULL, NULL, NULL, 66666664, 0, 0, NULL),
    (22, 'Adams', NULL, 'Chen', 'ayhchen@student.ubc.ca', '250-666-6665', NULL, NULL, NULL, NULL, 66666665, 0, 0, NULL),
    -- Non-UBC admin
    (23, 'Carol', NULL, 'Wilson', 'carol.wilson@maintenance.ca', '250-555-4321', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL),  
    (24, 'Amelia', 'June', 'Young', 'amelia.young@maintenance.ca', '250-555-4322', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL);    

-- Image 
-- Inserted through backend script

-- Account (remember to hash passwords in a real system!)
INSERT INTO public."Account" ("accountId", "profileId", "email", "password", "isActive") VALUES
-- Active
(1, 1, 'john.doe@ubc.ca', 'p@55word', true),
(2, 2, 'jane.smith@ubc.ca', 'someth!n9', true), -- different password for testing
(5, 5, 'david.kim@ubc.ca', 'p@55word', true),
(6, 6, 'sarah.chen@ubc.ca', 'p@55word', true),
(7, 7, 'michael.nguyen@ubc.ca', 'p@55word', true),
(8, 8, 'olivia.rodriguez@ubc.ca', 'p@55word', true),
(9, 9, 'daniel.taylor@ubc.ca', 'p@55word', true),
(10, 10, 'sophia.wilson@ubc.ca', 'p@55word', true),
(11, 11, 'william.anderson@ubc.ca', 'p@55word', true),
(12, 12, 'adien.moore@ubc.ca', 'p@55word', true),
(13, 13, 'ava.martinez1@ubc.ca', 'p@55word', true),       
(14, 14, 'ava.martinez2@ubc.ca', 'p@55word', true),  
(15, 15, 'ethan.anderson@ubc.ca', 'p@55word', true), 
(16, 16, 'alice.johnson@staff.ubc.ca', 'p@55word', true),  
(17, 17, 'bob.lee@staff.ubc.ca', 'p@55word', true),
(18, 18, 'kkim9901@student.ubc.ca', 'team6!x', true),                              
(19, 19, 'jeremyadams166@gmail.com', 'team6!x', true),
(20, 20, 'm15601654187@163.com', 'team6!x', true),
(21, 21, 'baruchan@student.ubc.ca', 'team6!x', true),
(22, 22, 'ayhchen@student.ubc.ca', 'team6!x', true),
(23, 23, 'carol.wilson@maintenance.ca', 'p@55word', true),
-- Inactive
(4, 4, 'emily.davis@ubc.ca', 'p@55word', false),
(24, 24, 'amelia.young@maintenance.ca', 'p@55word', false);
-- Person w/o account
    -- Robert Brown (profileId=3)

-- AccountType (assuming 1 = Department Head, 2 = Department Staff, 3 = Instructor, 4 = Admin)
INSERT INTO public."AccountType" ("accountId", "accountType") VALUES
(1, 1), (1, 3), -- John Doe: Department Head, Instructor
(2, 3),         -- Jane Smith: Instructor
(4, 3),         -- Emily Davis: Instructor
(5, 3), (5, 4), -- David Kim: Instructor, Admin
(6, 3),         -- Sarah Chen: Instructor
(7, 3),         -- Michael Nguyen: Instructor
(8, 3),         -- Olivia Rodriguez: Instructor
(9, 3),         -- Daniel Taylor: Instructor
(10, 3),        -- Sophia Wilson: Instructor
(11, 3),        -- William Anderson: Instructor
(12, 3),        -- Aiden Moore: Instructor
(13, 3),        -- Ava Martinez: Instructor
(14, 3),        -- Ava Martinez: Instructor
(15, 3),        -- Ethan Anderson: Instructor
(16, 2),        -- Alice Johnson: Department Staff
(17, 2),        -- Bob Lee: Department Staff
(18, 4),        -- Kevin: Admin
(19, 4),        -- Jeremy: Admin
(20, 4),        -- Zhiheng: Admin
(21, 4),        -- Subaru: Admin
(22, 4),        -- Adams: Admin
(23, 4),        -- Carol Wilson: Admin
(24, 4);        -- Amelia Young: Admin

-- ServiceRole
INSERT INTO public."ServiceRole" ("serviceRoleId", "stitle", "description", "isActive", "divisionId") VALUES
-- Active
    -- COSC
    (1, 'Undergraduate Advisor', 'Advises undergraduate students on academic matters.', true, 1),
    (3, 'Curriculum Committee', 'Develops and reviews curriculum proposals.', true, 1),
    (2, 'Graduate Admissions', 'Reviews and evaluates graduate program applications.', true, 1),
    (4, 'Graduate Program Director', 'Oversees the graduate program.', true, 1),
    -- MATH
    (5, 'Undergraduate Advisor', 'Advises undergraduate students on academic matters.', true, 2),
    (6, 'Curriculum Committee', 'Develops and reviews curriculum proposals.', true, 2),
    (7, 'Graduate Admissions', 'Reviews and evaluates graduate program applications.', true, 2),
    (8, 'Graduate Program Director', 'Oversees the graduate program.', true, 2),
    -- PHYS
    (9, 'Undergraduate Advisor', 'Advises undergraduate students on academic matters.', true, 3),
    (10, 'Curriculum Committee', 'Develops and reviews curriculum proposals.', true, 3),
    (11, 'Graduate Admissions', 'Reviews and evaluates graduate program applications.', true, 3),
    (12, 'Graduate Program Director', 'Oversees the graduate program.', true, 3),
    -- STAT
    (13, 'Undergraduate Advisor', 'Advises undergraduate students on academic matters.', true, 3),
    (14, 'Curriculum Committee', 'Develops and reviews curriculum proposals.', true, 3),
    (15, 'Graduate Admissions', 'Reviews and evaluates graduate program applications.', true, 3),
    (16, 'Graduate Program Director', 'Oversees the graduate program.', true, 3),
    -- All
    (17, 'Safety Committee Member', 'Ensures the safety of students, faculty, and staff in labs and facilities.', true, 1),
    (18, 'Equity, Diversity, and Inclusion Committee', 'Promotes inclusivity and diversity within the department.', true, 1),
    (19, 'Seminar Series Organizer', 'Organizes and manages the department''s seminar series.', true, 1),
    (20, 'Awards Committee Member', 'Reviews and selects recipients for departmental awards and scholarships.', true, 1),
    (21, 'Undergraduate Research Coordinator', 'Coordinates undergraduate research opportunities.', true, 1),
-- Inactive
    -- All
    (22, 'Outreach Coordinator', 'Coordinates outreach activities to promote the department.', false, 1);

-- ServiceRoleByYear
INSERT INTO public."ServiceRoleByYear" ("serviceRoleId", "year", "JANHour", "FEBHour", "MARHour", "APRHour", "MAYHour", "JUNHour", "JULHour", "AUGHour", "SEPHour", "OCTHour", "NOVHour", "DECHour") VALUES
-- 2023
(1, 2023, 5.5, 6.0, 8.5, 10.0, 12.0, 9.0, 4.0, 2.0, 6.5, 8.0, 10.0, 11.0),    
(2, 2023, 3.0, 2.5, 4.0, 5.5, 7.0, 4.5, 2.0, 1.0, 3.5, 4.0, 5.5, 6.0),
(3, 2023, 2.0, 1.5, 2.5, 3.0, 4.5, 3.0, 1.0, 0.5, 2.0, 2.5, 3.0, 3.5),
(4, 2023, 8.0, 8.5, 11.0, 13.5, 16.0, 12.0, 6.0, 4.0, 9.0, 11.5, 14.0, 16.5),
(5, 2023, 6.0, 6.5, 9.0, 10.5, 12.0, 9.5, 4.5, 2.5, 6.5, 8.0, 9.5, 11.0),
(6, 2023, 2.5, 2.0, 3.5, 4.0, 5.5, 3.0, 1.5, 0.5, 2.5, 3.0, 4.0, 4.5),
(7, 2023, 1.5, 1.0, 2.0, 2.5, 3.0, 2.0, 0.5, 0.0, 1.5, 2.0, 2.5, 3.0),
(8, 2023, 10.5, 11.0, 13.5, 16.0, 18.5, 14.5, 8.5, 6.5, 12.0, 14.5, 17.0, 19.5),
(9, 2023, 4.0, 4.5, 6.0, 7.5, 9.0, 6.5, 3.0, 1.5, 4.5, 5.5, 7.0, 8.5),
(10, 2023, 3.0, 4.0, 2.5, 1.5, 3.5, 5.0, 0.5, 0.0, 2.0, 3.5, 4.5, 5.0),
(11, 2023, 5.0, 6.5, 4.5, 3.0, 5.5, 7.0, 1.5, 1.0, 3.5, 5.0, 6.0, 6.5),
(12, 2023, 0.5, 1.0, 0.0, 0.5, 1.5, 2.0, 0.0, 0.0, 0.5, 1.0, 1.5, 2.0),
(13, 2023, 7.0, 8.5, 6.0, 4.5, 7.5, 9.0, 2.5, 2.0, 5.0, 7.0, 8.0, 8.5),
(14, 2023, 1.0, 1.5, 0.5, 0.0, 1.0, 2.5, 0.0, 0.0, 0.5, 1.5, 2.0, 2.5),
(15, 2023, 3.5, 4.5, 2.5, 1.5, 4.0, 5.0, 1.0, 0.5, 2.0, 3.5, 4.0, 4.5),
(16, 2023, 9.0, 10.5, 7.5, 6.0, 9.5, 11.0, 3.5, 3.0, 6.5, 9.0, 10.0, 10.5),
(17, 2023, 1.5, 2.0, 1.0, 0.5, 1.5, 2.5, 0.5, 0.0, 1.0, 1.5, 2.0, 2.5),
(18, 2023, 2.5, 3.0, 2.0, 1.5, 2.5, 3.5, 1.0, 0.5, 1.5, 2.5, 3.0, 3.5),
(19, 2023, 0.5, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0),
(20, 2023, 4.0, 5.0, 3.5, 2.5, 4.5, 6.0, 1.5, 1.0, 3.0, 4.5, 5.0, 5.5),
(21, 2023, 6.5, 7.5, 5.0, 3.5, 6.5, 8.0, 2.0, 1.5, 4.0, 6.0, 7.0, 7.5),
(22, 2023, 1.5, 1.0, 0.0, 0.5, 1.5, 2.0, 0.5, 0.0, 0.5, 1.0, 1.5, 1.0),
-- 2024
(1, 2024, 7.0, 6.5, 9.0, 11.5, 13.5, 10.5, 5.5, 3.5, 7.5, 9.5, 11.5, 12.5), 
(2, 2024, 4.5, 4.0, 5.5, 7.0, 8.5, 6.0, 3.5, 2.5, 5.0, 6.5, 8.0, 9.5), 
(3, 2024, 3.5, 3.0, 4.5, 6.0, 7.5, 4.5, 2.0, 1.5, 3.5, 4.5, 6.0, 7.5), 
(4, 2024, 9.5, 10.0, 12.5, 15.0, 17.5, 13.5, 7.5, 5.5, 10.5, 13.0, 15.5, 18.0),
(5, 2024, 7.5, 8.0, 10.5, 12.0, 13.5, 11.0, 6.0, 4.0, 8.0, 9.5, 11.0, 12.5),
(6, 2024, 4.0, 3.5, 5.0, 6.5, 8.0, 4.5, 3.0, 1.5, 4.0, 5.5, 7.0, 8.5), 
(7, 2024, 3.0, 2.5, 3.5, 5.0, 6.5, 3.5, 1.5, 1.0, 3.0, 4.0, 5.5, 7.0),
(8, 2024, 12.0, 12.5, 15.0, 17.5, 20.0, 16.0, 10.0, 8.0, 13.5, 16.0, 18.5, 21.0), 
(9, 2024, 5.5, 6.0, 7.5, 9.0, 10.5, 8.0, 4.5, 3.0, 6.0, 7.5, 9.0, 10.5),
(10, 2024, 2.5, 3.5, 2.0, 1.0, 3.0, 4.5, 0.0, 0.5, 1.5, 3.0, 4.0, 4.5), 
(11, 2024, 4.5, 6.0, 4.0, 2.5, 5.0, 6.5, 1.0, 1.5, 3.0, 4.5, 5.5, 6.0), 
(12, 2024, 0.0, 0.5, 0.5, 0.0, 1.0, 1.5, 0.5, 0.0, 0.0, 0.5, 1.0, 1.5), 
(13, 2024, 6.5, 8.0, 5.5, 4.0, 7.0, 8.5, 2.0, 2.5, 4.5, 6.5, 7.5, 8.0),
(14, 2024, 0.5, 1.0, 0.0, 0.5, 0.5, 2.0, 0.5, 0.0, 0.0, 1.0, 1.5, 2.0),
(15, 2024, 3.0, 4.0, 2.0, 1.0, 3.5, 4.5, 0.5, 1.0, 1.5, 3.0, 3.5, 4.0), 
(16, 2024, 8.5, 10.0, 7.0, 5.5, 9.0, 10.5, 3.0, 3.5, 6.0, 8.5, 9.5, 10.0),
(17, 2024, 1.0, 1.5, 0.5, 0.0, 1.0, 2.0, 0.0, 0.5, 0.5, 1.0, 1.5, 2.0), 
(18, 2024, 2.0, 2.5, 1.5, 1.0, 2.0, 3.0, 0.5, 1.0, 1.0, 2.0, 2.5, 3.0),
(19, 2024, 0.0, 0.5, 0.5, 0.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5), 
(20, 2024, 3.5, 4.5, 3.0, 2.0, 4.0, 5.5, 1.0, 1.5, 2.5, 4.0, 4.5, 5.0),
(21, 2024, 6.0, 7.0, 4.5, 3.0, 6.0, 7.5, 1.5, 2.0, 3.5, 5.5, 6.5, 7.0);

-- ServiceRoleAssignment
INSERT INTO public."ServiceRoleAssignment" ("profileId", "serviceRoleId", "year") VALUES
-- 2023
(1, 3, 2023),       -- John Doe: Curriculum Committee (2023)
(2, 2, 2023),       -- Jane Smith: Graduate Admissions (2023)
(3, 1, 2023),       -- Robert Brown: Undergraduate Advisor (2023)
(5, 8, 2023),       -- David Kim: Graduate Program Director (2023)
(6, 6, 2023),       -- Sarah Chen: Curriculum Committee (2023)
(7, 5, 2023),       -- Michael Nguyen: Undergraduate Advisor (2023)
(8, 7, 2023),       -- Olivia Rodriguez: Graduate Admissions (2023)
(9, 12, 2023),      -- Daniel Taylor: Graduate Program Director (2023)
(10, 11, 2023),     -- Sophia Wilson: Graduate Admissions (2023)
(11, 10, 2023),     -- William Anderson: Curriculum Committee (2023)
-- 2024
    -- John Doe
    (1, 1, 2024),       -- John Doe: Undergraduate Advisor (2024)
    (1, 17, 2024),      -- John Doe: Safety Committee Member (2024)
    -- Jane Smith
    (2, 3, 2024),       -- Jane Smith: Curriculum Committee (2024)
    (2, 19, 2024),      -- Jane Smith: Seminar Series Organizer (2024)
    -- Robert Brown 
    (3, 2, 2024),       -- Robert Brown: Graduate Admissions (2024)
    -- David Kim
    (5, 5, 2024),       -- David Kim: Undergraduate Advisor (2024)
    -- Sarah Chen
    (6, 7, 2024),       -- Sarah Chen: Graduate Admissions (2024)
    (6, 20, 2024),      -- Sarah Chen: Awards Committee Member (2024)
    -- Michael Nguyen
    (7, 6, 2024),       -- Michael Nguyen: Curriculum Committee (2024)
    -- Olivia Rodriguez
    (8, 8, 2024),       -- Olivia Rodriguez: Graduate Program Director (2024)
    -- Daniel Taylor
    (9, 10, 2024),      -- Daniel Taylor: Curriculum Committee (2024)
    -- Sofia Wilson
    (10, 9, 2024),      -- Sophia Wilson: Undergraduate Advisor (2024)
    -- William Anderson
    (11, 11, 2024),     -- William Anderson: Graduate Admissions (2024)
    -- Aiden Moore
    (12, 12, 2024),     -- Aiden Moore: Graduate Program Director (2024)
    (12, 20, 2024),     -- Aiden Moore: Awards Committee Member (2024)
    -- Ava Martinez
    (14, 13, 2024),     -- Ava Martinez: Undergraduate Advisor (2024)
    -- Ethan Anderson
    (15, 15, 2024),     -- Ethan Anderson: Graduate Admissions (2024)
    (15, 18, 2024),     -- Ethan Anderson: Equity, Diversity, and Inclusion Committee (2024)
    -- Olivia Rodriguez:
    (8, 21, 2024);      -- Olivia Rodriguez: Undergraduate Research Coordinator (2024)
-- Note: Awards Committee Member (2024) is assigned to 2 people

-- Course
INSERT INTO public."Course" ("courseId", "ctitle", "description", "divisionId", "courseNum") VALUES
-- COSC
(1, 'Computer Programming I', 'Introduction to the design, implementation, and understanding of computer programs. Topics include problem solving, algorithm design, and data and procedural abstraction, with emphasis on the development of working programs.', 1, 111),
(2, 'Computer Programming II', 'Advanced programming in the application of software engineering techniques to the design and implementation of programs manipulating complex data structures.', 1, 121),
(3, 'Machine Architecture', 'Organization and design of computer systems and their impact on the practice of software development. Instruction set architecture and assembly programming languages, design of central processing units (CPU), memory hierarchy and cache organization, input and output programming.', 1, 211),
(4, 'Discrete Structures in Computing', 'Discrete structures in computing and relevant mathematical techniques. Logic and applications in automated reasoning and programming; proof techniques and analysis of algorithms and computation models; graph theory and graph models in computing; counting principles and discrete probability.', 1, 221),
(5, 'Data Structures', 'Introduction to the design, implementation and analysis of data structures. Topics will include lists, stacks, queues, trees, and graphs.', 1, 222),
(6, 'Introduction to Data Analytics', 'Software development and techniques for computation, analysis, and visualization of data. Manipulation of small and large data sets. Automation using scripting.', 1, 301),
(7, 'Numerical Analysis', 'Numerical techniques for basic mathematical processes and their analysis. Taylor polynomials, root-finding, linear systems, eigenvalues, approximating derivatives, locating minimizers, approximating integrals, solving differential equations.', 1, 303),
(8, 'Introduction to Databases', 'Databases from a user''s perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.', 1, 304),
(9, 'Project Management', 'Examine tools and techniques to complete projects successfully, and within budget. Topics include Program Evaluation and Review Technique (PERT) and Critical Path Methods (CPM), and project management software.', 1, 305),
(10, 'Software Engineering', 'Techniques to construct large systems using fundamental activities of specification, design, implementation, testing, and maintenance. Various life cycle models, exposure to software development tools, modelling techniques, good development practices, and project management.', 1, 310),
(11, 'Introduction to Operating Systems', 'Introduction to batch, multiprogramming, and time-sharing systems. Process synchronization and communication. Main memory allocation techniques including virtual memory; process scheduling; deadlock avoidance and prevention; file organization and device management.', 1, 315),
(12, 'Analysis of Algorithms', 'Design and analysis of algorithms, illustrated from various problem areas. Models of computation, choice of data structures, space and time efficiency, computation complexity, algorithms for searching, sorting and graph-theoretic problems, NP-complete problems.', 1, 320),
(13, 'Introduction to Artificial Intelligence', 'AI and intelligent agents; state space search; game playing agents; logic and knowledge-based agents; constraint programming; planning; reasoning and decision making under uncertainty; machine learning; natural language understanding.', 1, 322),
(14, 'Introduction to Networks', 'The five-layer Internet architecture using TCP/IP: application, transport, network, link, and physical. Topics include web protocols, network programming, routing, addressing, congestion control, error handling, Ethernet, wireless networks, security, multimedia transmission, and network management.', 1, 328),
(15, 'Learning Analytics', 'Introduction to data analytics and machine learning techniques in the context of educational data. Focuses on user profiling, collaborative filtering, clustering, Bayesian user modeling, preference elicitation, and plagiarism detection.', 1, 329),
(16, 'Introduction to Medical Imaging and Imaging Informatics', 'Fundamental image analysis techniques. Image creation, manipulation, optimization, and analysis to aid in the diagnosis and treatment of human health conditions. Generation and display of X-ray, CT, MRI, Ultrasound and Nuclear Medicine images. Imaging Informatics and its place in the Electronic Medical Record.', 1, 335),
(17, 'Human Computer Interaction', 'History of human-computer interaction. Basic design principles, user-centered design, user task analysis, interaction models, input and output devices, graphical interface design, prototyping, and evaluation.', 1, 341),
(18, 'Image Processing and Applications', 'Fundamental theoretical and practical concepts for processing and analyzing real-world digital images and videos, image enhancement and filtering, frequency domain and other transform analysis, morphological image operations, image segmentation, and object recognition.', 1, 344),
(19, 'Web Programming', 'Design and implementation of web-based information systems and app development. Rich user interfaces, asynchronous updates, client-side and server-side scripting using standard technologies such as HTML, CSS, SVG, JavaScript, PHP. Data manipulation with SQL, JSON, XML. Modern scripting frameworks and libraries.', 1, 360),
(20, 'Database System Implementation', 'Fundamental concepts in constructing database systems including file organizations, storage management, system architectures, query processing/optimization, transaction management, recovery, and concurrency control. Additional topics may include distributed databases, mobile databases, and integration.', 1, 404),
(21, 'Modelling and Simulation', 'Numeric dynamic systems models and emphasis on discrete stochastic systems. State description of models, common model components, entities. Common simulation language. Simulation using algebraic languages. Simulation methodology: data collection, model design, output analysis, optimization, validation. Elements of queuing theory, relationship to simulation. Applications to computer systems models.', 1, 405),
(22, 'Numerical Optimization', 'Formulation and analysis of algorithms for continuous optimization problems; linear, quadratic, semi-definite, nonlinear (constrained and unconstrained), convex (smooth and non-smooth) optimization; large-scale problems; software packages and their implementation; elements of duality theory.', 1, 406),
(23, 'Introduction to Parallel Computing', 'Design and implementation of parallel programs including theoretical computer models, parallel architectures (distributed, multicore, GPU), and standard parallel libraries.', 1, 407),
(24, 'Computer Graphics', 'Human vision and colour, modelling, geometric transformations, algorithms for 2-D and 3-D graphics, hardware and system architectures, shading and lighting, animation.', 1, 414),
(25, 'Network Science', 'Graphs and complex networks in scientific research. Probabilistic and statistical models. Structures, patterns, and behaviors in networks. Algorithmic and statistical methods (online/mobile), social networks, and social media platforms. Social influence, information diffusion, and viral marketing. Sentiment analysis and opinion mining. Data privacy. Search engines and recommendation systems.', 1, 421),
(26, 'Advanced Human Computer Interaction', 'Computer interaction design principles, advanced methodologies and theories; novel interfaces and platforms, conceptualization from ideation to implementation, advanced techniques for evaluation including controlled quantitative evaluation, field evaluation, quantitative analysis; introduction to HCI research.', 1, 441),
(27, 'Computer Vision', 'Advanced vision methods that enable machines to analyze and understand images. Fundamental problems in computer vision and the state-of-the-art approaches that address them. Feature detection and matching, geometric and multi-view vision, structure from X, segmentation, object tracking and visual recognition, and deep learning methods.', 1, 444),
(28, 'Capstone Software Engineering Project', 'A capstone project requiring team software development for an actual client. Students must produce a comprehensive report and deliver a formal presentation.', 1, 499),
-- MATH
(29, 'Integral Calculus with Applications to Physical Sciences and Engineering', 'Definite integral, integration techniques, applications, modelling, linear ODE''s.', 2, 101),
(30, 'Calculus III', 'Analytic geometry in two and three dimensions, partial and directional derivatives, chain rule, maxima and minima, second derivative test, Lagrange multipliers, multiple integrals with applications.', 2, 200),
(31, 'Mathematical Proof', 'Sets and functions; induction; cardinality; properties of the real numbers; sequences, series, and limits. Logic, structure, style, and clarity of proofs emphasized throughout.', 2, 220),
(32, 'Matrix Algebra', 'Systems of linear equations, operations on matrices, determinants, eigenvalues and eigenvectors, diagonalization of symmetric matrices, and vector geometry.', 2, 221),
(33, 'Linear Algebra', 'Vector spaces, linear maps, change of basis, eigenvalues and eigenvectors, Jordan canonical forms, matrix decomposition, inner product spaces, orthogonality, linear operators.', 2, 223),
(34, 'Introduction to Differential Equations', 'First-order equations, initial value problems, existence and uniqueness theorems, second-order linear equations, superposition of solutions, independence, general solutions, non-homogeneous equations, phaseplane analysis, numerical methods, matrix methods for linear systems, and applications of differential equations to the physical, biological, and social sciences.', 2, 225),
(35, 'Applied Linear Algebra', 'LU-factorization, iterative estimates for eigenvalues, dynamical systems, orthogonality, QR-factorization, and applications of linear algebra.', 2, 307),
(36, 'Euclidean Geometry', 'Classical Euclidean, finite, modern, transformation geometry, and non-Euclidean geometry.', 2, 308),
(37, 'Abstract Algebra I', 'Properties of integers, the integers modulo n, groups, subgroups, cyclic groups, permutation groups, linear groups, quotient groups and homomorphisms, isomorphism theorems, direct products, and an introduction to rings and fields.', 2, 311),
(38, 'Introduction to Number Theory', 'Divisibility of integers, congruences, Euler''s Theorem, primitive roots, quadratic reciprocity, special Diophantine equations, distributions of primes.', 2, 312),
(39, 'Calculus IV', 'Parametrizations, inverse and implicit functions, integrals with respect to length and area; grad, div, and curl, and theorems of Green, Gauss, and Stokes.', 2, 317),
(40, 'Introduction to Partial Differential Equations', 'Methods of separation of variable, Fourier series, heat, wave and Laplace''s equations, boundary value problems, eigenfunction expansions, and Sturm-Liouville problems.', 2, 319),
(41, 'Applied Abstract Algebra', 'Congruences and groups, introduction to rings and fields, and topics chosen from: lattices, Boolean algebra and applications, balanced incomplete block designs, introduction to cryptography, applications to group theory.', 2, 323),
(42, 'Analysis I', 'The real number system, real Euclidean n-space; open, closed, compact, and connected sets; Bolzano-Weierstrass theorem; sequences and series; continuity and uniform continuity; differentiability and mean-value theorems; Riemann or Riemann-Stieltjes integrals.', 2, 327),
(43, 'Analysis II', 'Metric and normed vector spaces; limits in normed vector spaces, compactness; sequences and series of functions, approximation of continuous functions by polynomials; functions from Rm to Rn, inverse and implicit function theorems.', 2, 328),
(44, 'Abstract Algebra II', 'Covers properties of rings and fields, factorization, polynomials over a field, field extensions, field isomorphisms and automorphism, group of automorphisms, and Galois theory of unsolvability.', 2, 330),
(45, 'Introduction to Dynamical Systems', 'Non-linear systems and iteration of functions; flows, phase portraits, periodic orbits, chaotic attractors, fractals, and invariant sets.', 2, 339),
(46, 'Introduction to Linear Programming', 'Linear programming problems, dual problems, the simplex algorithm, solution of primal and dual problems, sensitivity analysis. Additional topics chosen from: Karmarkar''s algorithm, non-linear programming, game theory, applications.', 2, 340),
(47, 'Complex Variables and Applications', 'Covers analytic functions, Cauchy-Riemann equations, power series, Laurent series, elementary functions, contour integrals, and poles and residues. Introduction to conformal mapping and applications of analysis to problems in physics and engineering.', 2, 350),
(48, 'Differential Geometry', 'Local theory of curves, Frenet-Serret apparatus, fundamentals of the Gaussian theory of surface, normal curvature, geodesics, Gaussian and mean curvatures, theorema egregium, an introduction to Riemannian geometry, Gauss-Bonnet Theorem, and applications.', 2, 408),
(49, 'Mathematics of Financial Derivatives', 'Pricing theory of financial derivative securities. Options and markets, present and future values, price movement modeled by Brownian motion, Ito''s formula, parbolic partial differential equations, Black-Scholes model. Prices of European options as solutions of initial/boundary value problems for heat equations, American options, free boundary problems.', 2, 409),
(50, 'Introduction to General Topology', 'General (point-set) topology. Naive set theory, relations and functions, order relations, cardinality, Axiom of Choice, well-ordering, topological spaces, bases, subspaces, product spaces, limit points, continuous functions, homeomorphisms, metric spaces, connectedness, compactness, countability axioms, separation axioms, Urysohn lemma, Tietze extension theorem, Urysohn metrization theorem, Tychonoff theorem.', 2, 410),
(51, 'Real Analysis', 'Lebesgue measure, measurable functions, integration, convergence theorems, Lp spaces, Holder and Minkowski inequalities, Lebesgue-Radon-Nikodym theorem, Lebesgue differentiation.', 2, 427),
(52, 'Functional Analysis', 'Banach spaces, linear operators, bounded and compact operators, strong, weak, and weak* topology. Hahn-Banach, open mapping, and closed graph theorems. Hilbert spaces, symmetric and self-adjoint operators, spectral theory for bounded operators. ', 2, 428),
(53, 'Graph Theory', 'Introductory course in mostly non-algorithmic topics. Planarity and Kuratowski''s theorem, graph colouring, graph minors, random graphs, cycles in graphs, Ramsey theory, extremal graph theory. Proofs emphasized.', 2, 443),
(54, 'Mathematical Biology', 'Mathematical modelling in biological disciplines such as population dynamics, ecology, pattern formation, tumour growth, immune response, biomechanics, and epidemiology. Theory of such models formulated as difference equations, ordinary differential equations, and partial differential equations.', 2, 459),
(55, 'Continuous Optimization', 'Convex analysis, non-smooth optimization, Karush-Kuhn-Tucker theorem, iterative methods.', 2, 461),
-- PHYS
(56, 'Introductory Physics for the Physical Sciences I', 'Mechanics primarily for students majoring in the physical sciences (e.g. physics, chemistry, mathematics, computer science, geology, physical geography) or engineering. Particle kinematics and dynamics, work and energy, momentum, gravitation, rigid body motion, fluid statics and dynamics with applications to the physical sciences.', 3, 111),
(57, 'Introductory Physics for the Life Sciences I', 'Mechanics primarily for students majoring in the life sciences (e.g. biochemistry, biology, microbiology, pharmacy, human kinetics, human geography or psychology). Particle kinematics and dynamics, work and energy, momentum, gravitation, rigid body motion, fluid statics and dynamics with applications to the biological sciences.', 3, 112),
(58, 'Introductory Physics for the Physical Sciences II', 'Physics primarily for students majoring in the physical sciences. Simple harmonic motion, sound, physical and wave optics, electricity, electric circuits, and magnetism with applications to the physical sciences. Experimental laboratory investigations in electricity, magnetism, waves and optics.', 3, 121),
(59, 'Introductory Physics for the Life Sciences II', 'Physics primarily for students majoring in the life sciences. Simple harmonic motion, sound, physical and wave optics, electricity, electric circuits, and magnetism with biological applications. Experimental laboratory investigations in electricity, magnetism, waves and optics.', 3, 123),
(60, 'Relativity and Quanta', 'Special relativity: Lorentz transformation, dynamics, and conservation laws. Quantum physics: the experimental evidence for quantization; a qualitative discussion of the concepts of quantum mechanics and their application to simple systems of atoms and nuclei.', 3, 200),
(61, 'Thermodynamics', 'Thermodynamics at an intermediate level. Temperature, heat and work, the First Law, heat transfer, heat engines, entropy, and the Second Law.', 3, 215),
(62, 'Mechanics I', 'Review of kinematics, Newton''s laws, angular momentum, and fixed axis rotation. Rigid body motion, central forces, non-inertial frames of reference.', 3, 216),
(63, 'Intermediate Electricity and Magnetism', 'Electrostatics, Gauss'' law, electric potential, DC circuits, conduction models, strain gauges, RTD, circuit analysis theorems, magnetic fields, Hall effect, Ampere''s law, Faraday''s law, inductance, and semiconductors with basic applications.', 3, 225),
(64, 'Introduction to Electronics', 'Design and analysis of analog AC circuits, digital circuits, and analog-to-digital conversion methods. Basic physics laboratory skills including data collection, presentation of results, and analysis of uncertainties.', 3, 231),
(65, 'Modern Physics Laboratory', 'Selected experiments in relativity, quantum mechanics, thermodynamics, particle physics or nuclear physics. Quantitative analysis of data, methods of measurement, formal presentation of laboratory results.', 3, 232),
(66, 'Electricity and Magnetism', 'Electric fields and potentials of static charge distributions, current, fields of moving charges, magnetic field, electromagnetic induction, Maxwell''s equations.', 3, 301),
(67, 'Introduction to Quantum Mechanics', 'The beginnings of quantum mechanics, wave mechanics and the Schroedinger equation, one-dimensional potentials, the postulates of quantum mechanics, and applications to three-dimensional systems.', 3, 304),
(68, 'Introduction to Biophysics', 'Analysis of biological systems from a physicist''s perspective. Introduction to physics underlying biological phenomena, and range of applicability of simple physical principles. Form and size in animals, strength and energy storage in structural elements, thermal regulation, fluid motion within organisms, life in fluids, and molecular physics topics.', 3, 305),
(69, 'Introduction to Medical Physics', 'Radiation interactions with matter; use of ionizing and non-ionizing radiation to diagnose and treat disease; radiation dosimetry; introduction to radiobiology; radiation effects in healthy and tumour tissue; radiation protection; medical imaging in radiation therapy.', 3, 310),
(70, 'Fluids', 'Kinetic theory: diffusion, viscosity, and sound waves. Introduction to hydrodynamics: Laminar flow, capillary and gravity waves, convection, and turbulence. Dimensional analysis.', 3, 314),
(71, 'Environmental Physics', 'Contemporary environmental issues: physics of climate modification, ozone depletion, energy sources for electrical generation, energy storage, energy conservation strategies, transportation, pollutant transport, non-ionizing radiation, risk analysis, and other current topics of interest.', 3, 320),
(72, 'Waves', 'Intermediate treatment of wave production, propagation, reception. Acoustics, electrical transmission lines, electromagnetics, scalar wave equation. Finite difference time domain computer simulation, boundary conditions, normal modes, input impedance, energy density, power flux/propagation across boundaries at normal and oblique incidence, sonic transducers, alternating current sources, and antennae.', 3, 324),
(73, 'Advanced Mechanics', 'Variational calculus, the Lagrangian Method applied to a variety of problems, weak anharmonic perturbations of normal-mode systems, Hamilton''s equations of motion, phase space, Liouville''s theorem, chaos in Hamiltonian systems, rigid-body rotations in three dimensions, Lagrangian formulation of relativistic mechanics, and the Virial theorem.', 3, 328),
(74, 'Experimental Physics I', 'Selected advanced physics experiments in solid-state physics, fluid dynamics, particle physics, astrophysics, optics, nonlinear dynamics or electromagnetism. Experimental design, construction, and formal presentation of results.', 3, 331),
(75, 'Introduction to Elementary Particles', 'Standard model, classification of elementary particles and forces of nature, symmetries, conservation laws, quark model, quantum electrodynamics, quantum chromodynamics, and the theory of weak interactions.', 3, 400),
(76, 'Electromagnetic Theory', 'The application of Maxwell''s theory to the propagation of electromagnetic waves.', 3, 401),
(77, 'Advanced Quantum Mechanics', 'Quantum mechanical methods and concepts emphasizing operator algebra approaches. Commutation relations; quantum dynamics; approximation methods including stationary-state and time-dependent perturbation theory; interaction of radiation with matter; identical particles.', 3, 402),
(78, 'Introduction to General Relativity', 'Ensemble theory, application to classical and quantum gases, and Boltzmann equation. Principles and applications of statistical mechanics. Ideal gases, degenerate Fermi gases, Bose-Einstein condensation, black body radiation, fluctuations and phase transitions.', 3, 403),
-- STAT
(79, 'Elementary Statistics', 'Descriptive and inferential statistics, elementary probability, probability distributions, estimation of parameters, hypotheses testing, correlation, linear regression.', 4, 121),
(80, 'Introduction to Probability', 'Combinatorics. Axioms of probability. Discrete and continuous random variables, expectation, and variance. Transformations. Central limit theorem and applications. Weak law of large numbers.', 4, 203),
(81, 'Introduction to Mathematical Statistics', 'Sampling distribution theory. Likelihood. Parameter estimation. Confidence intervals and hypothesis testing; simple regression, analysis of variance and contingency table analysis.', 4, 205),
(82, 'Introductory Statistics', 'Applied statistics for students with a first-year calculus background. Estimation and testing of hypotheses, problem formulation, models and basic methods in analysis of variance, linear regression, and non-parametric methods. Descriptive statistics and probability are presented as a basis for such procedures.', 4, 230),
(83, 'Intermediate Probability', 'Multivariate probability distributions, moment and generating functions.', 4, 303),
(84, 'Mathematical Finance', 'Simple and compound interest, discount, force of interest, simple and general annuities, amortization of debts, bonds, depreciation, mortality tables, contingent payments, life annuities, insurance, and an introduction to financial derivatives.', 4, 324),
(85, 'Probability and Statistical Inference', 'Theory of statistical modelling: distributions of data, likelihood-based inference for learning unknown parameters, construction of confidence intervals and development of tests. Bayesian methods will be used to contrast standard statistical procedures.', 4, 401),
(86, 'Stochastic Processes', 'Random walks, Markov chains, Poisson processes, continuous time Markov chains, birth and death processes, exponential models, and applications of Markov chains.', 4, 403),
(87, 'Environmetrics', 'Statistical concepts and methods in environmental science and management. Scientific problem-solving using statistical methods. Integration of the formulation of objectives, study design, and quantitative methods appropriate for the design. The role and use of statistical software packages.', 4, 406);

-- CourseByTerm (Ex. 2024W1 = 20241, 2024W2 = 20242, 2024S1 = 20243, 2024S2 = 20244)
INSERT INTO public."CourseByTerm" ("courseId", "term") VALUES
-- 2023W1
(1, 20231),  -- Computer Programming I (2023W1)
(2, 20231),  -- Computer Programming II (2023W1)
(3, 20231),  -- Machine Architecture (2023W1)
(29, 20231), -- Integral Calculus with Applications to Physical Sciences and Engineering (2023W1)
(56, 20231), -- Introductory Physics for the Physical Sciences I (2023W1)
(57, 20231), -- Introductory Physics for the Life Sciences I (2023W1)
(79, 20231), -- Elementary Statistics (2023W1)
-- 2023W2
(32, 20232), -- Matrix Algebra (2023W2)
(11, 20232), -- Introduction to Operating Systems (2023W2)
(40, 20232), -- Introduction to Partial Differential Equations (2023W2)
(63, 20232), -- Intermediate Electricity and Magnetism (2023W2)
(83, 20232), -- Intermediate Probability (2023W2)
-- 2023S1
(19, 20233), -- Web Programming (2023S1)
(28, 20233), -- Capstone Software Engineering Project (2023S1)
(48, 20233), -- Differential Geometry (2023S1)
(72, 20233), -- Waves (2023S1)
-- 2023S2
(55, 20234), -- Continuous Optimization (2023S2)
(24, 20234), -- Computer Graphics (2023S2)
(51, 20234), -- Real Analysis (2023S2)
(78, 20234), -- Introduction to General Relativity (2023S2)
-- 2024W1
(87, 20241), -- Environmetrics (2024W1)
(8, 20241),  -- Introduction to Databases (2024W1)
(35, 20241), -- Applied Linear Algebra (2024W1)
(66, 20241), -- Electricity and Magnetism (2024W1)
-- 2024W2
(17, 20242), -- Human Computer Interaction (2024W2)
(45, 20242), -- Introduction to Dynamical Systems (2024W2)
(69, 20242), -- Introduction to Medical Physics (2024W2)
-- 2024S1
(26, 20243), -- Advanced Human Computer Interaction (2024S1)
(52, 20243), -- Functional Analysis (2024S1)
(75, 20243), -- Introduction to Elementary Particles (2024S1)
-- 2024S2
(4, 20244),  -- Discrete Structures in Computing (2024S2)
(5, 20244),  -- Data Structures (2024S2)
(6, 20244),  -- Introduction to Data Analytics (2024S2)
(7, 20244),  -- Numerical Analysis (2024S2)
(8, 20244),  -- Introduction to Databases (2024S2)
(9, 20244),  -- Project Management (2024S2)
(10, 20244), -- Software Engineering (2024S2)
(11, 20244), -- Introduction to Operating Systems (2024S2)
(12, 20244), -- Analysis of Algorithms (2024S2)
(13, 20244), -- Introduction to Artificial Intelligence (2024S2)
(14, 20244), -- Introduction to Networks (2024S2)
(15, 20244), -- Learning Analytics (2024S2)
(16, 20244), -- Introduction to Medical Imaging and Imaging Informatics (2024S2)
(17, 20244), -- Human Computer Interaction (2024S2)
(18, 20244), -- Image Processing and Applications (2024S2)
(19, 20244), -- Web Programming (2024S2)
(20, 20244), -- Database System Implementation (2024S2)
(21, 20244), -- Modelling and Simulation (2024S2)
(22, 20244), -- Numerical Optimization (2024S2)
(23, 20244), -- Introduction to Parallel Computing (2024S2)
(24, 20244), -- Computer Graphics (2024S2)
(25, 20244), -- Network Science (2024S2)
(26, 20244), -- Advanced Human Computer Interaction (2024S2)
(27, 20244), -- Computer Vision (2024S2)
(28, 20244), -- Capstone Software Engineering Project (2024S2)
(30, 20244), -- Calculus III (2024S2) 
(31, 20244), -- Mathematical Proof (2024S2)
(33, 20244), -- Linear Algebra (2024S2)
(34, 20244), -- Introduction to Differential Equations (2024S2)
(41, 20244), -- Applied Abstract Algebra (2024S2)
(47, 20244), -- Complex Variables and Applications (2024S2)
(58, 20244), -- Introductory Physics for the Physical Sciences II (2024S2)
(59, 20244), -- Introductory Physics for the Life Sciences II (2024S2)
(60, 20244), -- Relativity and Quanta (2024S2)
(61, 20244), -- Thermodynamics (2024S2)
(62, 20244), -- Mechanics I (2024S2)
(67, 20244), -- Introduction to Quantum Mechanics (2024S2)
(71, 20244), -- Environmental Physics (2024S2)
(80, 20244), -- Introduction to Probability (2024S2)
(81, 20244); -- Introduction to Mathematical Statistics (2024S2)

-- InstructorTeachingAssignment
INSERT INTO public."InstructorTeachingAssignment" ("profileId", "courseId", "term") VALUES
-- 2023W1
(1, 1, 20231),  -- John Doe: Computer Programming I (2023W1)
(2, 2, 20231),  -- Jane Allison Smith: Computer Programming II (2023W1)
(3, 3, 20231),  -- Robert Brown: Machine Architecture (2023W1)
(5, 29, 20231), -- David Kim: Integral Calculus with Applications to Physical Sciences and Engineering (2023W1)
(9, 56, 20231), -- Daniel Taylor: Introductory Physics for the Physical Sciences I (2023W1)
(10, 57, 20231),-- Sophia Anne Wilson: Introductory Physics for the Life Sciences I (2023W1)
(13, 79, 20231), -- Ava Martinez: Elementary Statistics (2023W1)
-- 2023W2
(6, 32, 20232), -- Sarah Lee Chen: Matrix Algebra (2023W2)
(7, 40, 20232), -- Michael Nguyen: Introduction to Partial Differential Equations (2023W2)
(11, 63, 20232),-- William Anderson: Intermediate Electricity and Magnetism (2023W2)
(14, 83, 20232), -- Ava Martinez: Intermediate Probability (2023W2)
-- 2023S1
(8, 48, 20233), -- Olivia Marie Rodriguez: Differential Geometry (2023S1)
(12, 72, 20233),-- Aiden Moore: Waves (2023S1)
-- 2023S2
(5, 51, 20234), -- David Kim: Real Analysis (2023S2)
(9, 78, 20234), -- Daniel Taylor: Introduction to General Relativity (2023S2)
-- 2024W1
(6, 8, 20241),  -- Sarah Lee Chen: Introduction to Databases (2024W1)
(7, 35, 20241), -- Michael Nguyen: Applied Linear Algebra (2024W1)
(10, 66, 20241),-- Sophia Anne Wilson: Electricity and Magnetism (2024W1)
(15, 87, 20241), -- Ethan Anderson: Environmetrics (2024W1)
-- 2024W2
(8, 45, 20242), -- Olivia Marie Rodriguez: Introduction to Dynamical Systems (2024W2)
(11, 69, 20242),-- William Anderson: Introduction to Medical Physics (2024W2)
-- 2024S1
(5, 52, 20243), -- David Kim: Functional Analysis (2024S1)
(12, 75, 20243),-- Aiden Moore: Introduction to Elementary Particles (2024S1)
-- 2024S2
    -- COSC 
    (1, 6, 20244),  -- John Doe: Introduction to Data Analytics (2024S2)  
    (2, 10, 20244), -- Jane Allison Smith: Software Engineering (2024S2)
    (3, 11, 20244), -- Robert Brown: Introduction to Operating Systems (2024S2)
    (1, 17, 20244), -- John Doe: Human Computer Interaction (2024S2)
    (2, 18, 20244), -- Jane Allison Smith: Image Processing and Applications (2024S2)
    (3, 19, 20244), -- Robert Brown: Web Programming (2024S2)
    (1, 20, 20244), -- John Doe: Database System Implementation (2024S2)
    (2, 22, 20244), -- Jane Allison Smith: Numerical Optimization (2024S2)
    (3, 23, 20244), -- Robert Brown: Introduction to Parallel Computing (2024S2)
    (1, 24, 20244), -- John Doe: Computer Graphics (2024S2)
    (2, 25, 20244), -- Jane Allison Smith: Network Science (2024S2)
    (1, 27, 20244), -- John Doe: Computer Vision (2024S2)
    (2, 47, 20244), -- Jane Allison Smith: Complex Variables and Applications (2024S2)
    -- MATH 
    (6, 30, 20244), -- Sarah Lee Chen: Calculus III (2024S2)
    (7, 31, 20244), -- Michael Nguyen: Mathematical Proof (2024S2)
    (8, 33, 20244), -- Olivia Marie Rodriguez: Linear Algebra (2024S2)
    (5, 34, 20244), -- David Kim: Introduction to Differential Equations (2024S2)
    (6, 41, 20244), -- Sarah Lee Chen: Applied Abstract Algebra (2024S2)
    -- PHYS 
    (9, 58, 20244), -- Daniel Taylor: Introductory Physics for the Physical Sciences II (2024S2)
    (10, 59, 20244),-- Sophia Anne Wilson: Introductory Physics for the Life Sciences II (2024S2)
    (11, 60, 20244),-- William Anderson: Relativity and Quanta (2024S2)
    (7, 61, 20244), -- Michael Nguyen: Thermodynamics (2024S2) - also taught by Ava Martinez
    (14, 61, 20244),-- Ava Martinez: Thermodynamics (2024S2) - also taught by Michael Nguyen
    (12, 62, 20244),-- Aiden Moore: Mechanics I (2024S2)
    (9, 67, 20244), -- Daniel Taylor: Introduction to Quantum Mechanics (2024S2) 
    (10, 71, 20244),-- Sophia Anne Wilson: Environmental Physics (2024S2)
    -- STAT 
    (13, 80, 20244), -- Ava Martinez: Introduction to Probability (2024S2)
    (14, 81, 20244); -- Ava Martinez: Introduction to Mathematical Statistics (2024S2)
-- Note: Thermodynamics (2024S2) is taught by 2 people

-- SurveyType (Assuming 1=SEI)
INSERT INTO public."SurveyType" ("surveyTypeId", "surveyType") VALUES
(1, 'SEI');

-- SurveyQuestion (Assuming 6 questions for SEI)
INSERT INTO public."SurveyQuestion" ("surveyTypeId", "surveyQuestionId", "description") VALUES
(1, 1, 'The instructor was well-prepared for class.'),
(1, 2, 'The instructor explained the material clearly.'),
(1, 3, 'The instructor was available for help outside of class.'),
(1, 4, 'The course assignments were valuable learning experiences.'),
(1, 5, 'The course workload was appropriate.'),
(1, 6, 'Overall, I would recommend this course to other students.');

-- SurveyQuestionResponse (Sample responses for John Doe's Calculus I)
INSERT INTO public."SurveyQuestionResponse" ("surveyTypeId", "surveyQuestionId", "courseId", "term", "profileId", "studentId", "response") VALUES
(1, 1, 75, 20243, 12, 55555555, '4'),  -- Rating scale 1-5
(1, 2, 75, 20243, 12, 55555555, '5'),
(1, 3, 75, 20243, 12, 55555555, '3'),
(1, 4, 75, 20243, 12, 55555555, '4'),
(1, 5, 75, 20243, 12, 55555555, '4'),
(1, 6, 75, 20243, 12, 55555555, 'Agree');

-- SingleTeachingPerformance
-- (Assuming you have some way to calculate the score)
INSERT INTO public."SingleTeachingPerformance" ("profileId", "courseId", "term", "score")
SELECT "profileId", "courseId", "term", (random() * 99 + 1) -- Random score between 1.0 and 100.0
FROM public."InstructorTeachingAssignment";