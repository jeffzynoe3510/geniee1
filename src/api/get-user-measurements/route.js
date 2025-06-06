async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const results = await sql`
      SELECT 
        measurements,
        measurement_history,
        confidence_scores,
        fit_preferences
      FROM user_measurements 
      WHERE user_id = ${session.user.id}
    `;

    if (!results.length) {
      return {
        measurements: null,
        measurementHistory: null,
        confidenceScores: null,
        fitPreferences: null,
      };
    }

    const userMeasurements = results[0];

    return {
      measurements: userMeasurements.measurements,
      measurementHistory: userMeasurements.measurement_history,
      confidenceScores: userMeasurements.confidence_scores,
      fitPreferences: userMeasurements.fit_preferences,
    };
  } catch (error) {
    return { error: "Failed to fetch user measurements" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}