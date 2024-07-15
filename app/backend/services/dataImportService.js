const xlsx = require('xlsx');
const csv = require('fast-csv');
const fs = require('fs');
const Joi = require('joi');
const pool = require('../db/index.js');

// --- Validation Schemas --- 

const profileSchema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().allow(null, ''),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNum: Joi.string().allow(null, ''),
    officeBuilding: Joi.string().allow(null, ''),
    officeNum: Joi.any().allow(null, ''),
    position: Joi.string().allow(null, ''),
    divisionId: Joi.number().integer().allow(null, ''),
    UBCId: Joi.number().integer().allow(null, ''),
    serviceHourCompleted: Joi.number().allow(null, ''),
    sRoleBenchmark: Joi.number().integer().allow(null, '')
});

const courseSchema = Joi.object({
    ctitle: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    divisionId: Joi.number().integer().required(),
    courseNum: Joi.number().integer().required(),
});

const serviceRoleWithYearSchema = Joi.object({
    stitle: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    divisionId: Joi.number().integer().required(),
    year: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
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

async function importData(files) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let importedCount = 0;
        let errors = [];
        
        for (const file of files) {
            try {
                const fileData = await processFile(file, client);
                importedCount += fileData.length;
            } catch (error) {
                errors.push({ file: file.originalname, error: error.message });
            }
        }
        
        await client.query('COMMIT');

        return { 
            success: errors.length === 0,
            importedCount, 
            errors
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function processFile(file, client) {
    const filePath = file.path;
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

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

    let importedData = [];

    for (const row of data) {
        try {
            await processRow(row, client);
            importedData.push(row);
        } catch (error) {
            throw new Error(`Error processing row: ${error.message}`);
        }
    }

    return importedData;
}

async function processRow(row, client) {
    if ('firstName' in row && 'lastName' in row) {
        await processProfileData(row, client);
    } else if ('ctitle' in row && 'courseNum' in row) {
        await processCourseData(row, client);
    } else if ('stitle' in row && 'year' in row) {
        await processServiceRoleData(row, client);
    } else {
        throw new Error('Unknown data type');
    }
}

async function processProfileData(row, client) {
    const profileData = {
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

    const { error } = profileSchema.validate(profileData);
    if (error) {
        throw new Error(`Profile data validation error: ${error.message}`);
    }

    await client.query(`
        INSERT INTO public."Profile" (
            "firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT ("email") DO UPDATE SET 
            "firstName" = EXCLUDED."firstName",
            "middleName" = EXCLUDED."middleName",
            "lastName" = EXCLUDED."lastName",
            "phoneNum" = EXCLUDED."phoneNum",
            "officeBuilding" = EXCLUDED."officeBuilding",
            "officeNum" = EXCLUDED."officeNum",
            "position" = EXCLUDED."position",
            "divisionId" = EXCLUDED."divisionId",
            "serviceHourCompleted" = EXCLUDED."serviceHourCompleted",
            "sRoleBenchmark" = EXCLUDED."sRoleBenchmark"
    `, Object.values(profileData));
}

async function processCourseData(row, client) {
    const courseData = {
        ctitle: row.ctitle || null,
        description: row.description || null,
        divisionId: row.divisionId || null,
        courseNum: row.courseNum || null
    };

    const { error } = courseSchema.validate(courseData);
    if (error) {
        throw new Error(`Course data validation error: ${error.message}`);
    }

    await client.query(`
        INSERT INTO public."Course" ("ctitle", "description", "divisionId", "courseNum")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("ctitle") DO UPDATE SET
            "description" = EXCLUDED."description",
            "divisionId" = EXCLUDED."divisionId",
            "courseNum" = EXCLUDED."courseNum"
    `, Object.values(courseData));
}

async function processServiceRoleData(row, client) {
    const cleanedRow = {};
    for (const key in serviceRoleWithYearSchema.describe().keys) {
        cleanedRow[key] = row[key] || null;
    }

    const { error, value } = serviceRoleWithYearSchema.validate(cleanedRow);
    if (error) {
        throw new Error(`Service role data validation error: ${error.message}`);
    }

    const serviceRoleResult = await client.query(`
        INSERT INTO public."ServiceRole" ("stitle", "description", "isActive", "divisionId")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("stitle", "divisionId") DO UPDATE SET
        "description" = EXCLUDED."description",
        "divisionId" = EXCLUDED."divisionId"
        RETURNING "serviceRoleId" 
    `, [value.stitle, value.description, true, value.divisionId]);

    const serviceRoleId = serviceRoleResult.rows[0].serviceRoleId;

    const months = ['JANHour', 'FEBHour', 'MARHour', 'APRHour', 'MAYHour', 'JUNHour', 'JULHour', 'AUGHour', 'SEPHour', 'OCTHour', 'NOVHour', 'DECHour'];
    const values = [serviceRoleId, value.year];
    months.forEach(month => {
        values.push(value[month] || 0);
    });

    await client.query(`
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
}

module.exports = {
    importData
};