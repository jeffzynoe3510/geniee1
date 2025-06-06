async function handler({
  outfitData,
  mirrorCalibration,
  userMeasurements,
  trackingPoints,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const result = await sql.transaction(async (sql) => {
      // Save or update user measurements with tracking points
      const measurementResult = await sql`
        INSERT INTO user_measurements (
          user_id, 
          measurements, 
          confidence_scores,
          fit_preferences
        )
        VALUES (
          ${session.user.id},
          ${userMeasurements},
          ${trackingPoints},
          ${outfitData.fitPreferences}
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          measurements = ${userMeasurements},
          confidence_scores = ${trackingPoints},
          fit_preferences = ${outfitData.fitPreferences},
          last_updated = CURRENT_TIMESTAMP
        RETURNING id
      `;

      // Update user profile with mirror calibration
      const profileResult = await sql`
        INSERT INTO user_profiles (
          user_id,
          mirror_settings
        )
        VALUES (
          ${session.user.id},
          ${mirrorCalibration}
        )
        ON CONFLICT (user_id)
        DO UPDATE SET 
          mirror_settings = ${mirrorCalibration},
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `;

      // Save the virtual try-on record
      const tryOnResult = await sql`
        INSERT INTO virtual_tryon_history (
          user_id,
          outfit_data,
          image_url
        )
        VALUES (
          ${session.user.id},
          ${outfitData},
          ${outfitData.imageUrl}
        )
        RETURNING id
      `;

      return {
        measurementId: measurementResult[0].id,
        profileId: profileResult[0].id,
        tryOnId: tryOnResult[0].id,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error saving mirror try-on data:", error);
    return {
      success: false,
      error: "Failed to save try-on data",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}