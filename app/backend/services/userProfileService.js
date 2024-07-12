const pool = require('../db/index.js');

exports.getUserProfileById = async (profileId) => {
    const query = `
    SELECT 
      p."profileId",
      p."firstName" || ' ' || p."lastName" AS name,
      p."email",
      p."UBCId",
      p."officeBuilding" || ' ' || p."officeNum" AS office_location,
      p."phoneNum" AS phone_number,
      p."sRoleBenchmark" AS benchmark,
      p."imageId",
      i."file_type" AS image_type,
      encode(i."image_data", 'base64') AS image_data,
      d."dname" AS division,
      (SELECT string_agg(d2."dcode" || ' ' || c."courseNum" || ' (' || c."ctitle" || ')', E'\n' ORDER BY d2."dcode", c."courseNum")
       FROM "InstructorTeachingAssignment" ita
       JOIN "Course" c ON ita."courseId" = c."courseId"
       JOIN "Division" d2 ON c."divisionId" = d2."divisionId"
       WHERE ita."profileId" = p."profileId" AND ita."term" = (SELECT MAX("term") FROM public."CourseByTerm")
      ) AS current_courses,
      (SELECT string_agg(sr."stitle", E'\n')
       FROM "ServiceRoleAssignment" sra
       JOIN "ServiceRole" sr ON sra."serviceRoleId" = sr."serviceRoleId"
       WHERE sra."profileId" = p."profileId" AND sra."year" = EXTRACT(YEAR FROM CURRENT_DATE)
      ) AS current_service_roles,
      p."serviceHourCompleted" AS working_hours,
      ROUND(
        (SELECT AVG(stp."score")::numeric
        FROM "SingleTeachingPerformance" stp
        WHERE stp."profileId" = p."profileId"), 1
      ) AS performance_score
    FROM "Profile" p
    JOIN "Division" d ON p."divisionId" = d."divisionId"
    LEFT JOIN "Image" i ON p."imageId" = i."imageId"
    WHERE p."profileId" = $1
  `;

    try {
        const result = await pool.query(query, [profileId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getUserProfileById service:', error);
        throw error;
    }
};

exports.updateUserProfile = async (profileId, updatedData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { name, email, office_location, phone_number, image } = updatedData;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    const [officeBuilding, officeNum] = office_location.split(' ');

    let imageId = null;
    if (image) {
      const imageQuery = `
        INSERT INTO "Image" ("file_type", "image_data")
        VALUES ($1, $2)
        RETURNING "imageId"
      `;
      console.log(image.contentType.split('/')[1]);
      const imageResult = await client.query(imageQuery, [
        image.contentType.split('/')[1],
        image.data
      ]);
      imageId = imageResult.rows[0].imageId;
    }

    const query = `
      UPDATE "Profile"
      SET "firstName" = $1,
          "lastName" = $2,
          "email" = $3,
          "officeBuilding" = $4,
          "officeNum" = $5,
          "phoneNum" = $6,
          "imageId" = COALESCE($7, "imageId")
      WHERE "profileId" = $8
      RETURNING *
    `;

    const result = await client.query(query, [
      firstName,
      lastName,
      email,
      officeBuilding,
      officeNum,
      phone_number,
      imageId,
      profileId
    ]);

    await client.query('COMMIT');

    // After updating, fetch the full profile data to return
    const updatedProfile = await exports.getUserProfileById(profileId);
    return updatedProfile;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in updateUserProfile service:', error);
    throw error;
  } finally {
    client.release();
  }
};