-- Division
INSERT INTO public."Division" ("divisionId", "dname") VALUES
(1, 'Computer Science'),
(2, 'Mathematics'),
(3, 'Physics'),
(4, 'Statistics');

-- Profile (add department staff and admin users)
INSERT INTO public."Profile" ("profileId", "firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark", "imageId") VALUES
(1, 'John', NULL, 'Doe', 'john.doe@ubc.ca', '250-555-1212', 'SCI', '101', 'Professor', 1, 12345678, 15, 50, NULL),
(2, 'Jane', 'Allison', 'Smith', 'jane.smith@ubc.ca', '250-555-3456', 'ASC', '215', 'Associate Professor', 1, 23456789, 8, 120, NULL),
(3, 'Robert', NULL, 'Brown', 'robert.brown@ubc.ca', '250-555-7890', 'SCI', '302', 'Sessional Instructor', 2, 34567890, 0, 100, NULL),
(4, 'Emily', NULL, 'Davis', 'emily.davis@ubc.ca', '250-555-2345', 'ART', '420', 'Professor Emeritus', 3, 45678901, 0, 0, NULL),
(5, 'Alice', NULL, 'Johnson', 'alice.johnson@ubc.ca', '250-555-9876', 'SCI', '200', 'Department Staff', 1, 56789012, 0, 0, NULL),
(6, 'Bob', NULL, 'Lee', 'bob.lee@ubc.ca', '250-555-5678', 'SCI', '200', 'Department Staff', 2, 67890123, 0, 0, NULL),
(7, 'Carol', NULL, 'Wilson', 'carol.wilson@maintenance.ca', '250-555-4321', NULL, NULL, 'Admin', NULL, NULL, 0, 0, NULL); 

-- Image 
-- INSERT INTO Image (imageId, fileType, image_data) VALUES
-- (1, 'jpg', '...'),
-- (2, 'png', '...');

-- Account (remember to hash passwords in a real system!)
INSERT INTO public."Account" ("accountId", "profileId", "email", "password", "isActive") VALUES
(1, 1, 'john.doe@ubc.ca', 'p@55word', true),
(2, 2, 'jane.smith@ubc.ca', 'p@55word', true),
(3, 3, 'robert.brown@ubc.ca', 'p@55word', true),
(4, 4, 'emily.davis@ubc.ca', 'p@55word', false),
(5, 5, 'alice.johnson@ubc.ca', 'p@55word', true),
(6, 6, 'bob.lee@ubc.ca', 'p@55word', true),
(7, 7, 'carol.wilson@maintenance.ca', 'p@55word', true);

-- AccountType (assuming 1 = Department Head, 2 = Department Staff, 3 = Instructor, 4 = Admin)
INSERT INTO public."AccountType" ("accountId", "accountType") VALUES
(1, 1),  -- John is the Department Head
(1, 2),  -- John is also an Instructor
(2, 3),  -- Jane is an Instructor
(3, 3),  -- Robert is an Instructor
(4, 3),  -- Emily is an Instructor
(5, 2),  -- Alice is a Department Staff
(6, 2),  -- Bob is a Department Staff
(7, 4);  -- Carol is an Admin

-- ServiceRole
INSERT INTO public."ServiceRole" ("serviceRoleId", "stitle", "description", "isActive", "divisionId") VALUES
(1, 'Undergraduate Advisor', 'Advises undergraduate students on academic matters.', true, 1),
(2, 'Graduate Admissions', 'Reviews and evaluates graduate program applications.', true, 1),
(3, 'Curriculum Committee', 'Develops and reviews curriculum proposals.', true, 2),
(4, 'Outreach Coordinator', 'Coordinates outreach activities to promote the department.', true, 3),
(5, 'Safety Committee Member', 'Ensures the safety of students, faculty, and staff in labs and facilities.', true, 4),
(6, 'Equity, Diversity, and Inclusion Committee', 'Promotes inclusivity and diversity within the department.', true, 1),
(7, 'Seminar Series Organizer', 'Organizes and manages the department''s seminar series.', true, 2),
(8, 'Awards Committee Member', 'Reviews and selects recipients for departmental awards and scholarships.', true, 3);

INSERT INTO public."ServiceRoleByYear" ("serviceRoleId", "year", "JANHour", "FEBHour", "MARHour", "APRHour", "MAYHour", "JUNHour", "JULHour", "AUGHour", "SEPHour", "OCTHour", "NOVHour", "DECHour") VALUES
(1, 2024, 5, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5),
(2, 2024, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2),
(3, 2023, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3),
(4, 2023, 10, 10, 10, 10, 10, 10, 0, 0, 10, 10, 10, 10),
(5, 2023, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2),
(6, 2024, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1),
(7, 2024, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4),
(8, 2023, 6, 6, 6, 6, 6, 0, 0, 0, 6, 6, 6, 6);

-- ServiceRoleAssignment
INSERT INTO public."ServiceRoleAssignment" ("profileId", "serviceRoleId", "year") VALUES
(1, 2, 2023),
(1, 2, 2024),
(2, 5, 2023),
(2, 3, 2024),
(2, 7, 2024),
(3, 1, 2024),
(3, 5, 2024),
(3, 4, 2023),
(3, 8, 2023);;

-- Course
INSERT INTO public."Course" ("courseId", "ctitle", "description", "divisionId", "courseNum") VALUES
(1, 'Calculus I', 'Introduction to differential calculus.', 2, 100),
(2, 'Data Structures', 'Fundamentals of data structures and algorithms.', 1, 222),
(3, 'Probability', 'Introduction to probability theory.', 4, 303),
(4, 'Quantum Mechanics', 'Fundamentals of quantum mechanics.', 3, 402),
(5, 'Linear Algebra', 'Introduction to linear algebra and its applications.', 2, 221),
(6, 'Algorithm Analysis', 'Design and analysis of algorithms.', 1, 320),
(7, 'Statistical Inference', 'Statistical methods for drawing conclusions from data.', 4, 401),
(8, 'Electricity and Magnetism', 'Study of electric and magnetic fields and their interactions.', 3, 301),
(9, 'Differential Equations', 'Techniques for solving differential equations and their applications.', 2, 225),
(10, 'Numerical Analysis', 'Numerical methods for solving mathematical problems.', 1, 302);

-- CourseByTerm
INSERT INTO public."CourseByTerm" ("courseId", "term") VALUES
(1, '2024-W1'),
(2, '2024-W2'),
(3, '2024-S1'),
(4, '2023-W1'),
(5, '2024-W2'),
(6, '2024-W1'),
(7, '2024-S2'),
(8, '2023-W1'),
(9, '2023-S12'),
(10, '2023-S2');

-- InstructorTeachingAssignment
INSERT INTO public."InstructorTeachingAssignment" ("profileId", "courseId", "term") VALUES
(1, 1, '2024-W1'),
(1, 2, '2024-W2'),
(2, 4, '2023-W1'),
(2, 5, '2024-W2'),
(3, 9, '2023-S12');

-- SingleTeachingPerformance
-- (Assuming you have some way to calculate the score)
INSERT INTO public."SingleTeachingPerformance" ("profileId", "courseId", "term", "score") VALUES
(1, 1, '2024-W1', 4.2),
(2, 4, '2023-W1', 4.5),
(3, 9, '2023-S12', 3.8);

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
(1, 1, 1, '2024-W1', 1, 55555555, '4'),  -- Rating scale 1-5
(1, 2, 1, '2024-W1', 1, 55555555, '5'),
(1, 3, 1, '2024-W1', 1, 55555555, '3'),
(1, 4, 1, '2024-W1', 1, 55555555, '4'),
(1, 5, 1, '2024-W1', 1, 55555555, '4'),
(1, 6, 1, '2024-W1', 1, 55555555, 'Agree');






