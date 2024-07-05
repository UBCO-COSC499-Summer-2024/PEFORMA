const courseService = require('../../../app/backend/services/courseService');
const pool = require('../../../app/backend/db/index.js');
// const testPool = require('../../../app/backend/db/testDb.js');

jest.setTimeout(10000); // 10 seconds

// Sample test data (matches database schema)
const sampleDivisions = [
	{ dcode: 'COSC', dname: 'Computer Science' },
	{ dcode: 'MATH', dname: 'Mathematics' },
	{ dcode: 'PHYS', dname: 'Physics' },
	{ dcode: 'STAT', dname: 'Statistics' },
];

const sampleCourses = [
	{ ctitle: 'xxx', description: 'Introduction to the design, implementation, and understanding of computer programs. Topics include problem solving, algorithm design, and data and procedural abstraction, with emphasis on the development of working programs.', divisionId: 1, courseNum: 500 },
	{ ctitle: 'Matrix Algebra', description: 'Systems of linear equations, operations on matrices, determinants, eigenvalues and eigenvectors, diagonalization of symmetric matrices, and vector geometry.', divisionId: 2, courseNum: 221 },
	{ ctitle: 'Machine Architecture', description: 'Organization and design of computer systems and their impact on the practice of software development. Instruction set architecture and assembly programming languages, design of central processing units (CPU), memory hierarchy and cache organization, input and output programming.', divisionId: 1, courseNum: 211 }
];

const sampleProfiles = [
	{ firstName: 'John', middleName: null, lastName: 'Doe', email: 'johndoe@example.com', phoneNum: '250-555-1212', officeBuilding: 'SCI', officeNum: '101', position: 'Professor', divisionId: 1, UBCId: 11111111, serviceHourCompleted: 15, sRoleBenchmark: 50 },
	{ firstName: 'Jane', middleName: 'Allison', lastName: 'Smith', email: 'janesmith@example.com', phoneNum: '250-555-3456', officeBuilding: 'ASC', officeNum: '215', position: 'Associate Professor', divisionId: 1, UBCId: 11111112, serviceHourCompleted: 8, sRoleBenchmark: 120 },
	{ firstName: 'Robert', middleName: null, lastName: 'brown', email: 'robert.brown@ubc.ca', phoneNum: '250-555-7890', officeBuilding: 'SCI', officeNum: '302', position: 'Sessional Lecturer', divisionId: 1, UBCId: 11111113, serviceHourCompleted: 0, sRoleBenchmark: 10 },
];

const sampleInstructorTeachingAssignments = [
	{ profileId: 1, courseId: 1, term: 20244 },
	{ profileId: 1, courseId: 2, term: 20244 },
	{ profileId: 2, courseId: 2, term: 20244 },
	{ profileId: 3, courseId: 3, term: 20243 },
];

describe('courseService.getFormattedCourseData', () => {
	// --- Integration Tests (Real Database) ---
	describe('Integration Tests (Real Database)', () => {
		beforeAll(async () => {
			// Seed the database with a subset of your sample data
			for (const division of sampleDivisions) {
				await pool.query('INSERT INTO public."Division" ("dcode", "dname") VALUES ($1, $2)', Object.values(division));
			}
			for (const profile of sampleProfiles) {
				await pool.query('INSERT INTO public."Profile" ("firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', Object.values(profile));
			}
			for (const course of sampleCourses) {
				await pool.query('INSERT INTO public."Course" ("ctitle", "description", "divisionId", "courseNum") VALUES ($1, $2, $3, $4)', Object.values(course));
			}
			for (const assignment of sampleInstructorTeachingAssignments) {
				await pool.query('INSERT INTO "CourseByTerm" ("courseId", "term") VALUES ($1, $2)', [assignment.courseId, assignment.term]);
				await pool.query('INSERT INTO "InstructorTeachingAssignment" ("profileId", "courseId", "term") VALUES ($1, $2, $3)', Object.values(assignment));
			}
		});

		// afterAll(async () => {
		// 	// Clean up the test data (optional if you're using a separate test database)
		// 	await testPool.query('TRUNCATE TABLE "InstructorTeachingAssignment", "CourseByTerm", "Course", "Profile", "Division" CASCADE;');
		// 	// await testPool.end();
		// });

		it('should fetch and format course data correctly from the database for a specific division', async () => {
			const divisionCode = 'COSC';
			const expectedData = {
				division: divisionCode,
				divisionLabel: 'Computer Science',
				currentPage: 1,
				perPage: 10,
				divisionCoursesCount: 1,
				courses: [
					{ id: 'COSC 111', title: 'Computer Programming I', instructor: ['John Doe'], ubcid: ['11111111'], email: ['john.doe@ubc.com'] },]
			};

			const result = await courseService.getFormattedCourseData(divisionCode);
			expect(result).toEqual(expectedData);
		});

		it('should fetch and format course data correctly from the database for ALL divisions', async () => {
			const divisionCode = 'ALL';
			const expectedData = {
				division: divisionCode,
				divisionLabel: 'All',
				currentPage: 1,
				perPage: 10,
				divisionCoursesCount: 2,
				courses: [
					{ id: 'COSC 111', title: 'Computer Programming I', instructor: ['John Doe'], ubcid: ['11111111'], email: ['john.doe@ubc.com'] },
					{ id: 'MATH 221', title: 'Matrix Algebra', instructor: ['John Doe', 'Jane Smith'], ubcid: ['11111111', '11111112'], email: ['john.doe@ubc.com', 'jane.smith@ubc.ca'] },
				]
			};
			const result = await courseService.getFormattedCourseData(divisionCode);
			expect(result).toEqual(expectedData);
		});

		it('should return 200 status and empty array if no courses are found for the division', async () => {
			const divisionCode = 'PHYS'; // Division with no courses in test data
			const expectedData = {
				division: divisionCode,
				divisionLabel: 'Physics',
				currentPage: 1,
				perPage: 10,
				divisionCoursesCount: 0,
				courses: []
			};

			const result = await courseService.getFormattedCourseData(divisionCode);
			expect(result).toEqual(expectedData);
		});


		it('should throw an error for an invalid division code', async () => {
			await expect(courseService.getFormattedCourseData('INVALID')).rejects.toThrow('Invalid division code');
		});

	});
	// --- Unit Tests (Mocked Data) ---

	describe('Unit Test - Formatting (with Mocked Data)', () => {

		// Mock for isolating data formatting logic (for unit tests)
		jest.mock('../../../app/backend/db/index.js', () => ({
			query: jest.fn()
		}));

		it('should correctly format raw course data', async () => {
			// Mock raw data from the database query
			const rawCourseData = [
				{ course_number: 111, course_title: 'Computer Programming I', instructor: ['John Doe'], ubcid: [12345678], email: ['john.doe@ubc.ca'], division_id: 1 },
				{ course_number: 222, course_title: 'Data Structures', instructor: ['Jane Smith', 'Robert Brown'], ubcid: [23456789, 34567890], email: ['jane.smith@ubc.ca', 'robert.brown@ubc.ca'], division_id: 1 }
			];
			const divisionCode = 'COSC';
			const currentTerm = 20244;
			const divisionCoursesCount = rawCourseData.length;
			const expectedData = {
				division: divisionCode,
				divisionLabel: 'Computer Science',
				currentPage: 1,
				perPage: 10,
				divisionCoursesCount: divisionCoursesCount,
				courses: [
					{ id: 'COSC 111', title: 'Computer Programming I', instructor: ['John Doe'], ubcid: [12345678], email: ['john.doe@ubc.ca'] },
					{ id: 'COSC 222', title: 'Data Structures', instructor: ['Jane Smith', 'Robert Brown'], ubcid: [23456789, 34567890], email: ['jane.smith@ubc.ca', 'robert.brown@ubc.ca'] }
				]
			};

			const result = await courseService.getFormattedCourseData(divisionCode, rawCourseData, currentTerm, divisionCoursesCount); // Include additional arguments

			expect(result).toEqual(expectedData);
		});

		it('should return empty course data for an empty input', async () => {
			const rawCourseData = [];
			const divisionCode = 'COSC';
			const currentTerm = 20244;
			const divisionCoursesCount = rawCourseData.length;
			const expectedData = {
				division: divisionCode,
				divisionLabel: 'Computer Science',
				currentPage: 1,
				perPage: 10,
				divisionCoursesCount: 0,
				courses: []
			};

			const result = await courseService.getFormattedCourseData(divisionCode, rawCourseData, currentTerm, divisionCoursesCount);
			expect(result).toEqual(expectedData);
		});
	});
});

