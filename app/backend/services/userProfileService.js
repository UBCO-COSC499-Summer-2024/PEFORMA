const pool = require('../db/index.js');

exports.getUserProfileById = async (profileId) => {
    console.log("Service reached. Executing query for profileId:", profileId);
    const query = `
    SELECT 
      p."profileId",
      p."firstName" || ' ' || p."lastName" AS name,
      p."email",
      p."UBCId",
      p."officeBuilding" || ' ' || p."officeNum" AS office_location,
      p."phoneNum" AS phone_number,
      d."dname" AS division,
      (SELECT string_agg(c."ctitle", ', ')
       FROM "InstructorTeachingAssignment" ita
       JOIN "Course" c ON ita."courseId" = c."courseId"
       WHERE ita."profileId" = p."profileId" AND ita."term" = (SELECT MAX("term") FROM "InstructorTeachingAssignment" WHERE "profileId" = p."profileId")
      ) AS current_courses,
      (SELECT string_agg(sr."stitle", ', ')
       FROM "ServiceRoleAssignment" sra
       JOIN "ServiceRole" sr ON sra."serviceRoleId" = sr."serviceRoleId"
       WHERE sra."profileId" = p."profileId" AND sra."year" = EXTRACT(YEAR FROM CURRENT_DATE)
      ) AS current_service_roles,
      p."serviceHourCompleted" AS working_hours,
      (SELECT AVG(stp."score")
       FROM "SingleTeachingPerformance" stp
       WHERE stp."profileId" = p."profileId"
      ) AS performance_score
    FROM "Profile" p
    JOIN "Division" d ON p."divisionId" = d."divisionId"
    WHERE p."profileId" = $1
  `;

    try {
        console.log("Executing database query...");
        const result = await pool.query(query, [profileId]);
        console.log("Query result:", result.rows[0]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getUserProfileById service:', error);
        throw error;
    }
};