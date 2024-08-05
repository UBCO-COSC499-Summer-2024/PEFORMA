const pool = require('../db/index');
const { getLatestTerm } = require('./latestTerm.js');

class DeptProfileService {
    async updateBenchmark(ubcId, benchmark) {
        const query = 'UPDATE "Profile" SET "sRoleBenchmark" = $1 WHERE "UBCId" = $2 RETURNING *';
        const values = [benchmark, ubcId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async updateServiceRoles(ubcId, serviceRoles) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const profileIdResult = await client.query('SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1', [ubcId]);
            if (profileIdResult.rows.length === 0) {
                throw new Error('Profile not found');
            }
            const profileId = profileIdResult.rows[0].profileId;

            for (let role of serviceRoles) {
                if (role.action === 'remove') {
                    await client.query('DELETE FROM "ServiceRoleAssignment" WHERE "profileId" = $1 AND "serviceRoleId" = $2 AND "year" = $3', 
                        [profileId, role.serviceRoleId, role.year]);
                } else if (role.action === 'add') {
                    // Check if the assignment already exists
                    const existingAssignment = await client.query('SELECT 1 FROM "ServiceRoleAssignment" WHERE "profileId" = $1 AND "serviceRoleId" = $2 AND "year" = $3',
                        [profileId, role.serviceRoleId, role.year]);
                    
                    if (existingAssignment.rows.length === 0) {
                        await client.query('INSERT INTO "ServiceRoleByYear" ("serviceRoleId", "year") VALUES ($1, $2) ON CONFLICT ("serviceRoleId", "year") DO NOTHING',
                            [role.serviceRoleId, role.year]);
                        await client.query('INSERT INTO "ServiceRoleAssignment" ("profileId", "serviceRoleId", "year") VALUES ($1, $2, $3)',
                            [profileId, role.serviceRoleId, role.year]);
                    }
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateCourseAssignments(ubcId, courses) {
        const client = await pool.connect();
        const latestTerm = await getLatestTerm(); 

        try {
            await client.query('BEGIN');
    
            const profileIdResult = await client.query('SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1', [ubcId]);
            if (profileIdResult.rows.length === 0) {
                throw new Error('Profile not found');
            }
            const profileId = profileIdResult.rows[0].profileId;
    
            for (let course of courses) {
                if (course.action === 'remove') {
                    await client.query('DELETE FROM "InstructorTeachingAssignment" WHERE "profileId" = $1 AND "courseId" = $2 AND "term" = $3', 
                        [profileId, course.courseId, latestTerm]);
                } else if (course.action === 'add') {
                    // Check if the assignment already exists
                    const existingAssignment = await client.query('SELECT 1 FROM "InstructorTeachingAssignment" WHERE "profileId" = $1 AND "courseId" = $2 AND "term" = $3',
                        [profileId, course.courseId, latestTerm]);
                    
                    if (existingAssignment.rows.length === 0) {
                        await client.query('INSERT INTO "CourseByTerm" ("courseId", "term") VALUES ($1, $2) ON CONFLICT ("courseId", "term") DO NOTHING',
                            [course.courseId, latestTerm]);
                        await client.query('INSERT INTO "InstructorTeachingAssignment" ("profileId", "courseId", "term") VALUES ($1, $2, $3)',
                            [profileId, course.courseId, latestTerm]);
                    }
                }
            }
    
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new DeptProfileService();