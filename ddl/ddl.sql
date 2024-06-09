CREATE TABLE "SurveyType" (
  "surveyTypeId" integer,
  "surveyType" varchar(30),
  PRIMARY KEY ("surveyTypeId")
);

CREATE TABLE "Image" (
  "imageId" integer,
  "file type" varchar(3),
  "image" BLOB,
  PRIMARY KEY ("imageId")
  FOREIGN KEY ("imageId") 
  REFERENCES "Profile" ("imageId")
);

CREATE TABLE "Profile" (
  "profileId" integer,
  "firstName" varchar(20),
  "middleName" varchar(20),
  "lastName" varchar(20),
  "email" varchar(20),
  "phoneNum" varchar(20),
  "officeBuilding" varchar(3),
  "officeNum" varchar(5),
  "position" varchar(20),
  "divisionId" integer,
  "UBCId" integer,
  "serviceHourCompleted" double precision,
  "sRoleBenchmark" integer,
  "imageId" integer,
  PRIMARY KEY ("profileId")
);

CREATE TABLE "ServiceRole" (
  "serviceRoleId" integer,
  "stitle" varchar(50),
  "description" varchar(1000),
  "isActive" boolean,
  "divisionId" integer,
  PRIMARY KEY ("serviceRoleId")
  
);

CREATE TABLE "Course" (
  "courseId" integer,
  "ctitle" varchar(50),
  "description" varchar(1000),
  --"divisionId" integer,
  "courseNum" int,
  PRIMARY KEY ("courseId")
  FOREIGN KEY ("divisionId") 
  REFERENCES "Division" ("divisionId")
);

CREATE TABLE "SurveyQuestion" (
FOREIGN KEY ("surveyTypeId") 
REFERENCES "SurveyType" ("surveyTypeId"),
  --"surveyTypeId" integer,
  "surveyQuestionId" integer,
  "description" varchar(1000),
  PRIMARY KEY ("surveyTypeId", "surveyQuestionId")
);

CREATE TABLE "Division" (
  "divisionId" integer,
  "dname" varchar(50),
  PRIMARY KEY ("divisionId")
);

CREATE TABLE "InstructorTeachingAssignment" (
FOREIGN KEY ("profileId") 
REFERENCES "Profile" ("profileId"),
 -- "profileId" integer,
FOREIGN KEY ("courseId") 
REFERENCES "Course" ("courseId"),
  --"courseId" integer,
FOREIGN KEY ("term") 
REFERENCES "CourseByTerm" ("term"),
  --"term" varchar(7),
  PRIMARY KEY ("profileId", "courseId", "term")
);

CREATE TABLE "ServiceRoleAssignment" (
FOREIGN KEY ("profileId") 
REFERENCES "Profile" ("profileId"),
 -- "profileId" integer,
FOREIGN KEY ("serviceRoleId") 
REFERENCES "ServiceRole" ("serviceRoleId"),
 -- "serviceRoleId" integer,
FOREIGN KEY ("year") 
REFERENCES "ServiceRoleByYear" ("year"),
 -- "year" integer,
  PRIMARY KEY ("profileId", "serviceRoleId", "year")
);

CREATE TABLE "SingleTeachingPerformance" (
FOREIGN KEY ("profileId") 
REFERENCES "Profile" ("profileId"),
  --"profileId" integer,
FOREIGN KEY ("courseId") 
REFERENCES "Course" ("courseId"),
 -- "courseId" integer,
FOREIGN KEY ("term") 
REFERENCES "CourseByTerm" ("term"),
 -- "term" varchar(7),
  "score" double precision,
  PRIMARY KEY ("profileId", "courseId", "term")
);

CREATE TABLE "AccountType" (
FOREIGN KEY ("accountId") 
REFERENCES "Account" ("accountId"),
 -- "accountId" integer,
  "accountType" integer,
  PRIMARY KEY ("accountId", "accountType")
);

CREATE TABLE "ServiceRoleByYear" (
FOREIGN KEY ("serviceRoleId") 
REFERENCES "ServiceRole" ("serviceRoleId"),
 -- "serviceRoleId" integer,
  "year" integer,
  "JANHour" double precision,
  "FEBHour" double precision,
  "MARHour" double precision,
  "APRHour" double precision,
  "MAYHour" double precision,
  "JUNHour" double precision,
  "JULHour" double precision,
  "AUGHour" double precision,
  "SEPHour" double precision,
  "OCTHour" double precision,
  "NOVHour" double precision,
  "DECHour" double precision,
  PRIMARY KEY ("serviceRoleId", "year")
);

CREATE TABLE "SurveyQuestionResponse" (
  "sQResponseId" integer,
FOREIGN KEY ("surveyTypeId") 
REFERENCES "SurveyType" ("surveyTypeId"),
  --"surveyTypeId" integer,
FOREIGN KEY ("surveyQuestionId") 
REFERENCES "SurveyQuestion" ("surveyQuestionId"),
 -- "surveyQuestionId" integer,
FOREIGN KEY ("courseId") 
REFERENCES "Course" ("courseId"),
 -- "courseId" integer,
FOREIGN KEY ("term") 
REFERENCES "CourseByTerm" ("term"),
  --"term" varchar(9),
FOREIGN KEY ("profileId") 
REFERENCES "Profile" ("profileId"),
  --"profileId" integer,
  "studentId" integer,
  "response" varchar(500),
  PRIMARY KEY ("sQResponseId")
);

CREATE TABLE "CourseByTerm" (
FOREIGN KEY ("courseId") 
REFERENCES "Course" ("courseId"),
  --"courseId" integer,
  "term" varchar(9),
  PRIMARY KEY ("courseId", "term")
);

CREATE TABLE "Account" (
  "accountId" integer,
  FOREIGN KEY ("profileId") 
  REFERENCES "Profile" ("profileId"),
  --"profileId" varchar(20),
  "email" varchar(20),
  "password" varchar(15),
  "isActive" boolean,
  PRIMARY KEY ("accountId")
);

