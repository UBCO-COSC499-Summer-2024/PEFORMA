// dataImportService.js
const xlsx = require('xlsx');
const csv = require('fast-csv');
const fs = require('fs');
const Joi = require('joi');
const pool = require('../db/index.js');

// Validation Schemas (Adjust these to your exact schema and requirements)
const profileSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	// email: Joi.string().email().required(),
	// phoneNum: Joi.string().allow(null).allow(''),
	// officeBuilding: Joi.string().allow(null).allow(''),
	// officeNum: Joi.string().allow(null).allow(''),
	// position: Joi.string().required(),
	// divisionId: Joi.number().integer().required(),
	// UBCId: Joi.number().integer().required(),
	// serviceHourCompleted: Joi.number().allow(null).allow(''),
	// sRoleBenchmark: Joi.number().integer().allow(null).allow('')
});
// const courseSchema = Joi.object({
// 	courseId: Joi.number().integer().required(),
// 	ctitle: Joi.string().required(),
// 	description: Joi.string().allow(null).allow(''),
// 	divisionId: Joi.number().integer().required(),
// 	courseNum: Joi.number().integer().required(),
// });
// const serviceRoleSchema = Joi.object({
// 	serviceRoleId: Joi.number().integer().required(),
// 	stitle: Joi.string().required(),
// 	description: Joi.string().allow(null).allow(''),
// 	isActive: Joi.boolean().required(),
// 	divisionId: Joi.number().integer().required(),
// });

// const instructorTeachingAssignmentSchema = Joi.object({
// 	profileId: Joi.number().integer().required(),
// 	courseId: Joi.number().integer().required(),
// 	term: Joi.string().required()
// });
// const serviceRoleAssignmentSchema = Joi.object({
// 	profileId: Joi.number().integer().required(),
// 	serviceRoleId: Joi.number().integer().required(),
// 	year: Joi.number().integer().required()
// });

// const surveyTypeSchema = Joi.object({
// 	surveyTypeId: Joi.number().integer().required(),
// 	surveyType: Joi.string().required(),
// });

// const surveyQuestionSchema = Joi.object({
// 	surveyTypeId: Joi.number().integer().required(),
// 	surveyQuestionId: Joi.number().integer().required(),
// 	description: Joi.string().required(),
// });

// const surveyQuestionResponseSchema = Joi.object({
// 	sQResponseId: Joi.any().optional(), // Auto-incrementing
// 	surveyTypeId: Joi.number().integer().required(),
// 	surveyQuestionId: Joi.number().integer().required(),
// 	courseId: Joi.number().integer().required(),
// 	term: Joi.string().required(),
// 	profileId: Joi.number().integer().required(),
// 	studentId: Joi.number().integer().required(),
// 	response: Joi.string().allow('')
// });

async function importData(file) {
	const filePath = file.path;
	const fileExtension = file.originalname.split('.').pop();

	let data = [];

	if (fileExtension === 'xlsx') {
		const workbook = xlsx.readFile(filePath);
		const sheetName = workbook.SheetNames[0];
		data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
	} else if (fileExtension === 'csv') {
		data = await new Promise((resolve, reject) => {
			const parsedData = [];
			fs.createReadStream(filePath)
				.pipe(csv.parse({ headers: true }))
				.on('data', row => parsedData.push(row))
				.on('end', () => resolve(parsedData))
				.on('error', error => reject(error));
		});
	} else {
		throw new Error('Unsupported file format');
	}

	// Process and insert/update data
	for (const row of data) {
		// Determine data type (profile, course, etc.) based on column headers
		if ('firstName' in row && 'lastName' in row) {
			// Assuming instructor data
			const { error, value } = profileSchema.validate(row);
			if (error) {
				console.error('Profile validation error:', error);
				continue;
			}

			// Insert or update into database (using pg or your preferred method)
      await pool.query(`
        INSERT INTO public."Profile" (
          "firstName", "lastName"
        ) VALUES ($1, $2)
      `, [value.firstName, value.lastName]);

			// await pool.query(`
      //   INSERT INTO "Profile" (
      //     "firstName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark"
      //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      //   ON CONFLICT ("UBCId") DO UPDATE SET 
      //     "firstName" = EXCLUDED."firstName",
      //     "lastName" = EXCLUDED."lastName",
      //     "email" = EXCLUDED."email",
      //     "phoneNum" = EXCLUDED."phoneNum",
      //     "officeBuilding" = EXCLUDED."officeBuilding",
      //     "officeNum" = EXCLUDED."officeNum",
      //     "position" = EXCLUDED."position",
      //     "divisionId" = EXCLUDED."divisionId",
      //     "serviceHourCompleted" = EXCLUDED."serviceHourCompleted",
      //     "sRoleBenchmark" = EXCLUDED."sRoleBenchmark"
      // `, [value.firstName, value.lastName, value.email, value.phoneNum, value.officeBuilding, value.officeNum, value.position, value.divisionId, value.UBCId, value.serviceHourCompleted, value.sRoleBenchmark]);
		// } else if ('ctitle' in row && 'courseNum' in row) {
		// 	// Assuming course data
		// 	const { error, value } = courseSchema.validate(row);
		// 	if (error) {
		// 		console.error('Course validation error:', error);
		// 		continue;
		// 	}
		// 	await pool.query(`
    //     INSERT INTO "Course" ("courseId", "ctitle", "description", "divisionId", "courseNum")
    //     VALUES ($1, $2, $3, $4, $5)
    //     ON CONFLICT ("courseId") DO UPDATE SET
    //       "ctitle" = EXCLUDED."ctitle",
    //       "description" = EXCLUDED."description",
    //       "divisionId" = EXCLUDED."divisionId",
    //       "courseNum" = EXCLUDED."courseNum"
    //   `, [value.courseId, value.ctitle, value.description, value.divisionId, value.courseNum]);
		// } else if ('serviceRoleId' in row && 'stitle' in row) {
		// 	// Assuming service role data
		// 	const { error, value } = serviceRoleSchema.validate(row);
		// 	if (error) {
		// 		console.error('Service Role validation error:', error);
		// 		continue;
		// 	}

		// 	await pool.query(`
    //       INSERT INTO "ServiceRole" ("serviceRoleId", "stitle", "description", "isActive", "divisionId")
    //       VALUES ($1, $2, $3, $4, $5) 
    //       ON CONFLICT ("serviceRoleId") DO UPDATE SET
    //         "stitle" = EXCLUDED."stitle",
    //         "description" = EXCLUDED."description",
    //         "isActive" = EXCLUDED."isActive",
    //         "divisionId" = EXCLUDED."divisionId"
    //         `,
		// 		[value.serviceRoleId, value.stitle, value.description, value.isActive, value.divisionId] // Values from the validated data
		// 	);
		// } else if ('profileId' in row && 'serviceRoleId' in row && 'year' in row) {
		// 	// Assuming ServiceRoleAssignment data
		// 	const { error, value } = serviceRoleAssignmentSchema.validate(row);
		// 	if (error) {
		// 		console.error('Service Role Assignment validation error:', error);
		// 		continue; // Skip invalid rows
		// 	}

		// 	await pool.query(
		// 		'INSERT INTO "ServiceRoleAssignment" ("profileId", "serviceRoleId", "year") VALUES ($1, $2, $3) ON CONFLICT ("profileId", "serviceRoleId", "year") DO NOTHING',
		// 		[value.profileId, value.serviceRoleId, value.year]
		// 	);
		// } else if ('profileId' in row && 'courseId' in row && 'term' in row) {
		// 	// Assuming InstructorTeachingAssignment data
		// 	const { error, value } = instructorTeachingAssignmentSchema.validate(row);
		// 	if (error) {
		// 		console.error('Instructor Teaching Assignment validation error:', error);
		// 		continue;
		// 	}
		// 	// Insert or update into database (using pg or your preferred method)
		// 	await pool.query(
		// 		'INTO "InstructorTeachingAssignment" ("profileId", "courseId", "term") VALUES ($1, $2, $3) ON CONFLICT ("profileId", "courseId", "term") DO NOTHING',
		// 		[value.profileId, value.courseId, value.term] // Values from the validated data
		// 	);
		// } else if ('surveyTypeId' in row && 'surveyQuestionId' in row && 'profileId' in row && 'courseId' in row && 'term' in row && 'studentId' in row && 'response' in row) {
		// 	const { error, value } = surveyQuestionResponseSchema.validate(row);
		// 	if (error) {
		// 		console.error('Survey Response validation error:', error);
		// 		continue;
		// 	}
		// 	await pool.query(`
    //     INSERT INTO "SurveyQuestionResponse" ("surveyTypeId", "surveyQuestionId", "courseId", "term", "profileId", "studentId", "response")
    //     VALUES ($1, $2, $3, $4, $5, $6, $7) 
    //     ON CONFLICT ("surveyTypeId", "surveyQuestionId", "courseId", "term", "profileId", "studentId") DO UPDATE SET
    //       "response" = EXCLUDED."response"
    //       `,
		// 		[value.surveyTypeId, value.surveyQuestionId, value.courseId, value.term, value.profileId, value.studentId, value.response] // Values from the validated data
		// 	);
		// } else if ('surveyTypeId' in row && 'surveyType' in row) {
		// 	const { error, value } = surveyTypeSchema.validate(row);
		// 	if (error) {
		// 		console.error('SurveyType validation error:', error);
		// 		continue;
		// 	}

		// 	await pool.query(`
    //     INSERT INTO "SurveyType" ("surveyTypeId", "surveyType")
    //     VALUES ($1, $2) 
    //     ON CONFLICT ("surveyTypeId") DO UPDATE SET
    //       "surveyType" = EXCLUDED."surveyType"
    //       `,
		// 		[value.surveyTypeId, value.surveyType] // Values from the validated data
		// 	);
		// } else if ('surveyTypeId' in row && 'surveyQuestionId' in row && 'description' in row) {
		// 	const { error, value } = surveyQuestionSchema.validate(row);
		// 	if (error) {
		// 		console.error('SurveyQuestion validation error:', error);
		// 		continue;
		// 	}

		// 	await pool.query(`
    //     INSERT INTO "SurveyQuestion" ("surveyTypeId", "surveyQuestionId", "description")
    //     VALUES ($1, $2, $3) 
    //     ON CONFLICT ("surveyTypeId", "surveyQuestionId") DO UPDATE SET
    //       "description" = EXCLUDED."description"
    //       `,
		// 		[value.surveyTypeId, value.surveyQuestionId, value.description] // Values from the validated data
		// 	);
		}
	}
	return data;
}
module.exports = {
	importData
};
