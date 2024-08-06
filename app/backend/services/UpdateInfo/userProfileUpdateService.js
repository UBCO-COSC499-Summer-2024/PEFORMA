const pool = require('../../db/index.js');
const userProfileGetService = require('../ShowInfo/userProfileGetService');

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
    const updatedProfile = await userProfileGetService.getUserProfileById(profileId);
    return updatedProfile;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in updateUserProfile service:', error);
    throw error;
  } finally {
    client.release();
  }
};