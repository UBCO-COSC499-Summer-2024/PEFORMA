-- Dropping existing tables to clear
DROP TABLE IF EXISTS "SurveyType" CASCADE;
DROP TABLE IF EXISTS "Division" CASCADE;
DROP TABLE IF EXISTS "Image" CASCADE;
DROP TABLE IF EXISTS "Profile" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "ServiceRole" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TABLE IF EXISTS "SurveyQuestion" CASCADE;
DROP TABLE IF EXISTS "CourseByTerm" CASCADE;
DROP TABLE IF EXISTS "InstructorTeachingAssignment" CASCADE;
DROP TABLE IF EXISTS "SingleTeachingPerformance" CASCADE;
DROP TABLE IF EXISTS "ServiceRoleAssignment" CASCADE;
DROP TABLE IF EXISTS "AccountType" CASCADE;
DROP TABLE IF EXISTS "ServiceRoleByYear" CASCADE;
DROP TABLE IF EXISTS "SurveyQuestionResponse" CASCADE;


-- Create divisions
CREATE TABLE "Division" (
  "divisionId" SERIAL PRIMARY KEY,
  "dname" varchar(50)
);

-- Create images
CREATE TABLE "Image" (
  "imageId" SERIAL PRIMARY KEY,
  "file_type" varchar(3),
  "image_data" BYTEA
);

-- Create profiles
CREATE TABLE "Profile" (
  "profileId" SERIAL PRIMARY KEY,
  "firstName" varchar(20),
  "middleName" varchar(20),
  "lastName" varchar(20),
  "email" varchar(100),
  "phoneNum" varchar(20),
  "officeBuilding" varchar(10),
  "officeNum" varchar(10),
  "position" varchar(50),
  "divisionId" integer,
  "UBCId" integer,
  "serviceHourCompleted" double precision,
  "sRoleBenchmark" integer,
  "imageId" integer,
  FOREIGN KEY ("divisionId") REFERENCES "Division" ("divisionId"),
  FOREIGN KEY ("imageId") REFERENCES "Image" ("imageId"),
  UNIQUE ("profileId", "email")
);

-- Create accounts
CREATE TABLE "Account" (
  "accountId" SERIAL PRIMARY KEY,
  "profileId" integer,
  "email" varchar(100),
  "password" varchar(15),
  "isActive" boolean,
  FOREIGN KEY ("profileId", "email") REFERENCES "Profile" ("profileId", "email")
);

-- Create service roles
CREATE TABLE "ServiceRole" (
  "serviceRoleId" SERIAL PRIMARY KEY,
  "stitle" varchar(50),
  "description" varchar(1000),
  "isActive" boolean,
  "divisionId" integer,
  FOREIGN KEY ("divisionId") REFERENCES "Division" ("divisionId")
);

-- Create courses
CREATE TABLE "Course" (
  "courseId" SERIAL PRIMARY KEY,
  "ctitle" varchar(50),
  "description" varchar(1000),
  "divisionId" integer,
  "courseNum" int,
  FOREIGN KEY ("divisionId") REFERENCES "Division" ("divisionId")
);

-- Create course terms
CREATE TABLE "CourseByTerm" (
  "courseId" integer,
  "term" varchar(9),
  PRIMARY KEY ("courseId", "term"),
  FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId")
);

-- Create survey types
CREATE TABLE "SurveyType" (
  "surveyTypeId" SERIAL PRIMARY KEY,
  "surveyType" varchar(30)
);

-- Create survey questions
CREATE TABLE "SurveyQuestion" (
  "surveyTypeId" integer, 
  "surveyQuestionId" SERIAL,
  "description" varchar(1000),
  PRIMARY KEY ("surveyTypeId", "surveyQuestionId"),
  FOREIGN KEY ("surveyTypeId") REFERENCES "SurveyType" ("surveyTypeId")
);

CREATE TABLE "SurveyQuestionResponse" (
  "sQResponseId" SERIAL PRIMARY KEY,
  "surveyTypeId" integer,
  "surveyQuestionId" integer,
  "courseId" integer,
  "term" varchar(9),
  "profileId" integer,
  "studentId" integer,
  "response" varchar(500),
  FOREIGN KEY ("surveyTypeId", "surveyQuestionId") REFERENCES "SurveyQuestion" ("surveyTypeId", "surveyQuestionId"),
  FOREIGN KEY ("courseId", "term") REFERENCES "CourseByTerm" ("courseId", "term"),
  FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId")
);


-- Create instructor teaching assignments
CREATE TABLE "InstructorTeachingAssignment" (
  "profileId" integer,
  "courseId" integer,
  "term" varchar(9),
  PRIMARY KEY ("profileId", "courseId", "term"),
  FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId"),
  FOREIGN KEY ("courseId", "term") REFERENCES "CourseByTerm" ("courseId", "term")
);

-- Create single teaching performances
CREATE TABLE "SingleTeachingPerformance" (
  "profileId" integer,
  "courseId" integer,
  "term" varchar(9),
  "score" double precision,
  PRIMARY KEY ("profileId", "courseId", "term"),
  FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId"),
  FOREIGN KEY ("courseId", "term") REFERENCES "CourseByTerm" ("courseId", "term")
);

-- Create service role assignments
CREATE TABLE "ServiceRoleAssignment" (
  "profileId" integer,
  "serviceRoleId" integer,
  "year" integer,
  PRIMARY KEY ("profileId", "serviceRoleId", "year"),
  FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId"),
  FOREIGN KEY ("serviceRoleId") REFERENCES "ServiceRole" ("serviceRoleId")
);

-- Create account types
CREATE TABLE "AccountType" (
  "accountId" integer,
  "accountType" integer,
  PRIMARY KEY ("accountId", "accountType"),
  FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId")
);

-- Create service role by year
CREATE TABLE "ServiceRoleByYear" (
  "serviceRoleId" integer,
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
  PRIMARY KEY ("serviceRoleId", "year"),
  FOREIGN KEY ("serviceRoleId") REFERENCES "ServiceRole" ("serviceRoleId")
);