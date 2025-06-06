async function handler({ measurements, fitPreferences, confidenceScores }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const existingRecord = await sql`
      SELECT measurements, measurement_history 
      FROM user_measurements 
      WHERE user_id = ${session.user.id}
    `;

    if (existingRecord?.length) {
      const currentHistory = existingRecord[0].measurement_history || [];
      const updatedHistory = [
        ...currentHistory,
        {
          measurements: existingRecord[0].measurements,
          timestamp: new Date().toISOString(),
        },
      ];

      const result = await sql`
        UPDATE user_measurements 
        SET 
          measurements = ${measurements},
          fit_preferences = ${fitPreferences},
          confidence_scores = ${confidenceScores},
          measurement_history = ${JSON.stringify(updatedHistory)},
          last_updated = CURRENT_TIMESTAMP
        WHERE user_id = ${session.user.id}
        RETURNING *
      `;

      return { success: true, data: result[0] };
    }

    const result = await sql`
      INSERT INTO user_measurements (
        user_id,
        measurements,
        fit_preferences,
        confidence_scores,
        measurement_history
      )
      VALUES (
        ${session.user.id},
        ${measurements},
        ${fitPreferences},
        ${confidenceScores},
        ${JSON.stringify([])})
      RETURNING *
    `;

    return { success: true, data: result[0] };
  } catch (error) {
    return { error: "Failed to save measurements" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}