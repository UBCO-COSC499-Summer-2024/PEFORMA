-- Dropping existing tables to clear
DROP TABLE IF EXISTS "SurveyType" CASCADE;
DROP TABLE IF EXISTS "Division" CASCADE;
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
-- DROP TABLE IF EXISTS "Image" CASCADE;

-- Create divisions
CREATE TABLE "Division" (
  "divisionId"  SERIAL PRIMARY KEY,
  "dcode"       char(4),
  "dname"       varchar(100)
);
ALTER SEQUENCE "Division_divisionId_seq" RESTART WITH 1; 

-- Create profiles
CREATE TABLE "Profile" (
  "profileId"             SERIAL PRIMARY KEY,
  "firstName"             varchar(20),
  "middleName"            varchar(20),
  "lastName"              varchar(20),
  "email"                 varchar(100) UNIQUE NOT NULL,
  "phoneNum"              varchar(20),
  "officeBuilding"        varchar(10),
  "officeNum"             varchar(10),
  "position"              varchar(100),
  "divisionId"            integer REFERENCES "Division" ("divisionId") ON UPDATE CASCADE ON DELETE CASCADE,
  "UBCId"                 varchar(8),
  "serviceHourCompleted"  double precision,
  "sRoleBenchmark"        integer,
  -- "imageId"               integer,
  UNIQUE ("profileId", "email")
);
ALTER SEQUENCE "Profile_profileId_seq" RESTART WITH 1; 

-- -- Create images
-- CREATE TABLE "Image" (
--   "imageId"     SERIAL PRIMARY KEY,
--   "file_type"   char(3),
--   "image_data"  BYTEA
-- );

-- Create accounts
CREATE TABLE "Account" (
  "accountId"   SERIAL PRIMARY KEY,
  "profileId"   integer,
  "email"       varchar(100),
  "password"    varchar(100),
  "isActive"    boolean,
  FOREIGN KEY ("profileId", "email") REFERENCES "Profile" ("profileId", "email") ON UPDATE CASCADE ON DELETE CASCADE
);
ALTER SEQUENCE "Account_accountId_seq" RESTART WITH 1; 

-- Create account types
CREATE TABLE "AccountType" (
  "accountId"     integer REFERENCES "Account" ("accountId") ON UPDATE CASCADE ON DELETE CASCADE,
  "accountType"   integer,
  PRIMARY KEY ("accountId", "accountType")
);

-- Create service roles
CREATE TABLE "ServiceRole" (
  "serviceRoleId"   SERIAL PRIMARY KEY,
  "stitle"          varchar(100),
  "description"     varchar(1000),
  "isActive"        boolean,
  "divisionId"      integer REFERENCES "Division" ("divisionId") ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE("stitle", "divisionId")
);
ALTER SEQUENCE "ServiceRole_serviceRoleId_seq" RESTART WITH 1;

-- Create service role by year
CREATE TABLE "ServiceRoleByYear" (
  "serviceRoleId"   integer REFERENCES "ServiceRole" ("serviceRoleId") ON UPDATE CASCADE ON DELETE CASCADE,
  "year"            integer,
  "JANHour"         double precision,
  "FEBHour"         double precision,
  "MARHour"         double precision,
  "APRHour"         double precision,
  "MAYHour"         double precision,
  "JUNHour"         double precision,
  "JULHour"         double precision,
  "AUGHour"         double precision,
  "SEPHour"         double precision,
  "OCTHour"         double precision,
  "NOVHour"         double precision,
  "DECHour"         double precision,
  PRIMARY KEY ("serviceRoleId", "year"),
  UNIQUE("serviceRoleId", "year")
);

-- Create service role assignments
CREATE TABLE "ServiceRoleAssignment" (
  "profileId"       integer REFERENCES "Profile" ("profileId") ON UPDATE CASCADE ON DELETE CASCADE,
  "serviceRoleId"   integer REFERENCES "ServiceRole" ("serviceRoleId") ON UPDATE CASCADE ON DELETE CASCADE,
  "year"            integer,
  PRIMARY KEY ("profileId", "serviceRoleId", "year")
);

-- Create courses
CREATE TABLE "Course" (
  "courseId"      SERIAL PRIMARY KEY,
  "ctitle"        varchar(100) UNIQUE NOT NULL,
  "description"   TEXT,
  "divisionId"    integer REFERENCES "Division" ("divisionId") ON UPDATE CASCADE ON DELETE CASCADE,
  "courseNum"     integer
);
ALTER SEQUENCE "Course_courseId_seq" RESTART WITH 1;

-- Create courses by terms
CREATE TABLE "CourseByTerm" (
  "courseId"      integer REFERENCES "Course" ("courseId") ON UPDATE CASCADE ON DELETE CASCADE,
  "term"          integer,    
  PRIMARY KEY ("courseId", "term")
);

-- Create instructor teaching assignments
CREATE TABLE "InstructorTeachingAssignment" (
  "profileId"   integer REFERENCES "Profile" ("profileId") ON UPDATE CASCADE ON DELETE CASCADE,
  "courseId"    integer,
  "term"        integer,
  PRIMARY KEY ("profileId", "courseId", "term"),
  FOREIGN KEY ("courseId", "term") REFERENCES "CourseByTerm" ("courseId", "term") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Create survey types
CREATE TABLE "SurveyType" (
  "surveyTypeId"  SERIAL PRIMARY KEY,
  "surveyType"    varchar(30)
);
ALTER SEQUENCE "SurveyType_surveyTypeId_seq" RESTART WITH 1;

-- Create survey questions
CREATE TABLE "SurveyQuestion" (
  "surveyTypeId"      integer REFERENCES "SurveyType" ("surveyTypeId") ON UPDATE CASCADE ON DELETE CASCADE,
  "surveyQuestionId"  SERIAL,
  "description"       varchar(1000),
  PRIMARY KEY ("surveyTypeId", "surveyQuestionId")
);
-- Create survey question responses
CREATE TABLE "SurveyQuestionResponse" (
  "sQResponseId"      SERIAL PRIMARY KEY,
  "surveyTypeId"      integer,
  "surveyQuestionId"  integer,
  "courseId"          integer,
  "term"              integer,
  "profileId"         integer REFERENCES "Profile" ("profileId") ON UPDATE CASCADE ON DELETE CASCADE,
  "studentId"         integer,
  "response"          varchar(500),
  FOREIGN KEY ("surveyTypeId", "surveyQuestionId") REFERENCES "SurveyQuestion" ("surveyTypeId", "surveyQuestionId") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("courseId", "term") REFERENCES "CourseByTerm" ("courseId", "term") ON UPDATE CASCADE ON DELETE CASCADE
);
ALTER SEQUENCE "SurveyQuestionResponse_sQResponseId_seq" RESTART WITH 1;

-- Create single teaching performances
CREATE TABLE "SingleTeachingPerformance" (
  "profileId"   integer REFERENCES "Profile" ("profileId") ON UPDATE CASCADE ON DELETE CASCADE,
  "courseId"    integer,
  "term"        integer,
  "score"       double precision,
  PRIMARY KEY ("profileId", "courseId", "term"),
  FOREIGN KEY ("courseId", "term") REFERENCES "CourseByTerm" ("courseId", "term") ON UPDATE CASCADE ON DELETE CASCADE
);