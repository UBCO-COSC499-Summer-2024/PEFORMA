const xlsx = require('xlsx');
const csv = require('fast-csv');
const fs = require('fs');
const Joi = require('joi');
const pool = require('../db/index.js');

// --- Validation Schemas --- 

const profileSchema = Joi.object({
	firstName: Joi.string().required(),
	middleName: Joi.string().allow(null).allow(''),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	phoneNum: Joi.string().allow(null).allow(''),
	officeBuilding: Joi.string().allow(null).allow(''),
	officeNum: Joi.any().allow(null).allow(''),
	position: Joi.string().allow(null).allow(''),
	divisionId: Joi.number().integer().allow(null).allow(''),
	UBCId: Joi.number().integer().allow(null).allow(''),
	serviceHourCompleted: Joi.number().allow(null).allow(''),
	sRoleBenchmark: Joi.number().integer().allow(null).allow('')
});

const courseSchema = Joi.object({
	ctitle: Joi.string().required(),
	description: Joi.string().allow(null).allow(''),
	divisionId: Joi.number().integer().required(),
	courseNum: Joi.number().integer().required(),
});

const serviceRoleWithYearSchema = Joi.object({
	stitle: Joi.string().required(),
	description: Joi.string().allow(null).allow(''),
	divisionId: Joi.number().integer().required(),
	year: Joi.number().integer().min(2000).max(new Date().getFullYear())
		.required(),  // Assuming years from 2000 to current year
	JANHour: Joi.number().min(0).allow(null),
	FEBHour: Joi.number().min(0).allow(null),
	MARHour: Joi.number().min(0).allow(null),
	APRHour: Joi.number().min(0).allow(null),
	MAYHour: Joi.number().min(0).allow(null),
	JUNHour: Joi.number().min(0).allow(null),
	JULHour: Joi.number().min(0).allow(null),
	AUGHour: Joi.number().min(0).allow(null),
	SEPHour: Joi.number().min(0).allow(null),
	OCTHour: Joi.number().min(0).allow(null),
	NOVHour: Joi.number().min(0).allow(null),
	DECHour: Joi.number().min(0).allow(null)
});

// --- Import Data Function ---
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

	let successfullyImportedRows = []; // Array to store successful rows
	let result;
	let isInsert;

	// Process each data row
	for (const row of data) {
		const cleanedRow = {};

		try {
			// Determine data type (profile, course, etc.) based on column headers
			if ('firstName' in row && 'lastName' in row) {
				// Profile Data
				const profileData = { // Converting empty cells
					firstName: row.firstName || null,
					middleName: row.middleName || null,
					lastName: row.lastName || null,
					email: row.email || null,
					phoneNum: row.phoneNum || null,
					officeBuilding: row.officeBuilding || null,
					officeNum: row.officeNum || null,
					position: row.position || null,
					divisionId: row.divisionId || null,
					UBCId: row.UBCId || null,
					serviceHourCompleted: row.serviceHourCompleted || 0,
					sRoleBenchmark: row.sRoleBenchmark || 0
				};

				const { error, value } = profileSchema.validate(profileData); // Validate data  
				if (error) {
					console.error('Profile data validation error:', error);
					continue; // Skip invalid rows
				}

				// Insert or update into database 
				result = await pool.query(`
				INSERT INTO public."Profile" (
				  "firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark"
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
				ON CONFLICT ("email") DO UPDATE SET 
				  "firstName" = EXCLUDED."firstName",
				  "middleName" = EXCLUDED."middleName",
				  "lastName" = EXCLUDED."lastName",
				  "email" = EXCLUDED."email",
				  "phoneNum" = EXCLUDED."phoneNum",
				  "officeBuilding" = EXCLUDED."officeBuilding",
				  "officeNum" = EXCLUDED."officeNum",
				  "position" = EXCLUDED."position",
				  "divisionId" = EXCLUDED."divisionId",
				  "serviceHourCompleted" = EXCLUDED."serviceHourCompleted",
				  "sRoleBenchmark" = EXCLUDED."sRoleBenchmark"
			  `, Object.values(profileData));

				isInsert = result.command === 'INSERT' && result.rowCount === 1;

				if (isInsert) {
					successfullyImportedRows.push(row);
				} else if (result.rows.length > 0) {
					const returnedRow = result.rows[0]; // Get the returned row from the query

					// Compare original row with returned row (excluding system-generated fields)
					const originalRowWithoutId = { ...row };
					delete returnedRow.profileId;

					if (!isEqual(originalRowWithoutId, returnedRow)) {
						successfullyImportedRows.push(row);
					}
				}
			} else if ('ctitle' in row && 'courseNum' in row) {
				// Course Data
				const courseData = {
					ctitle: row.ctitle || null,
					description: row.description || null,
					divisionId: row.divisionId || null,
					courseNum: row.courseNum || null
				};

				const { error, value } = courseSchema.validate(courseData);
				if (error) {
					console.error('Course data validation error:', error);
					continue;
				}

				result = await pool.query(`
				INSERT INTO public."Course" ("ctitle", "description", "divisionId", "courseNum")
				VALUES ($1, $2, $3, $4)
				ON CONFLICT ("ctitle") DO UPDATE SET
				  "ctitle" = EXCLUDED."ctitle",
				  "description" = EXCLUDED."description",
				  "divisionId" = EXCLUDED."divisionId",
				  "courseNum" = EXCLUDED."courseNum"
			  `, Object.values(courseData));

				if (result.rowCount > 0) {
					successfullyImportedRows.push(row); // Add successful profile row
				}
			} else if ('stitle' in row && 'year' in row) { // ServiceRole and ServiceRoleByYear combined data
				// Assuming combined ServiceRole and ServiceRoleByYear data
				for (const key in serviceRoleWithYearSchema.describe().keys) {
					cleanedRow[key] = row[key] || null;
				}

				const { error, value } = serviceRoleWithYearSchema.validate(cleanedRow);
				if (error) {
					console.error('Service role data validation error:', error);
					continue;
				}

				// Insert or update ServiceRole
				const serviceRoleResult = await pool.query(`
				  INSERT INTO public."ServiceRole" ("stitle", "description", "isActive", "divisionId")
				  VALUES ($1, $2, $3, $4)
				  ON CONFLICT ("stitle", "divisionId") DO UPDATE SET
					"description" = EXCLUDED."description",
					"divisionId" = EXCLUDED."divisionId"
				  RETURNING "serviceRoleId" 
				`, [value.stitle, value.description, true, value.divisionId]);

				const serviceRoleId = serviceRoleResult.rows[0].serviceRoleId;

				// Insert or update ServiceRoleByYear (using the retrieved serviceRoleId)
				const months = ['JANHour', 'FEBHour', 'MARHour', 'APRHour', 'MAYHour', 'JUNHour', 'JULHour', 'AUGHour', 'SEPHour', 'OCTHour', 'NOVHour', 'DECHour'];
				const values = [serviceRoleId, value.year];
				months.forEach(month => {
					values.push(value[month] || 0); // Default to 0 if not provided
				});

				result = await pool.query(`
				  INSERT INTO public."ServiceRoleByYear" ("serviceRoleId", "year", "JANHour", "FEBHour", "MARHour", "APRHour", "MAYHour", "JUNHour", "JULHour", "AUGHour", "SEPHour", "OCTHour", "NOVHour", "DECHour")
				  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
				  ON CONFLICT ("serviceRoleId", "year") DO UPDATE SET
					"JANHour" = EXCLUDED."JANHour",
					"FEBHour" = EXCLUDED."FEBHour",
					"MARHour" = EXCLUDED."MARHour",
					"APRHour" = EXCLUDED."APRHour",
					"MAYHour" = EXCLUDED."MAYHour",
					"JUNHour" = EXCLUDED."JUNHour",
					"JULHour" = EXCLUDED."JULHour",
					"AUGHour" = EXCLUDED."AUGHour",
					"SEPHour" = EXCLUDED."SEPHour",
					"OCTHour" = EXCLUDED."OCTHour",
					"NOVHour" = EXCLUDED."NOVHour",
					"DECHour" = EXCLUDED."DECHour"
				`, values);

				isInsert = result.command === 'INSERT' && result.rowCount === 1;

				if (isInsert) {
					successfullyImportedRows.push(row);
				} else if (result.rows.length > 0) {
					const returnedRow = result.rows[0]; // Get the returned row from the query

					// Compare original row with returned row (excluding system-generated fields)
					const originalRowWithoutId = { ...row };
					delete returnedRow.profileId;

					if (!isEqual(originalRowWithoutId, returnedRow)) {
						successfullyImportedRows.push(row);
					}
				}
			}
		} catch (error) {
			console.error('Error importing row:', error);
		}
	}
	return successfullyImportedRows;
}

module.exports = {
	importData
};
