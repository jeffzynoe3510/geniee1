async function handler({
  difficultyPreference,
  preferredDurationMinutes,
  preferredCategories,
  equipmentAvailable,
  healthConditions,
  workoutFrequency,
  preferredMuscleGroups,
  notificationPreferences,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const userId = session.user.id;

    const existingPrefs = await sql`
      SELECT id FROM coach_preferences 
      WHERE user_id = ${userId}
    `;

    if (existingPrefs.length === 0) {
      const result = await sql`
        INSERT INTO coach_preferences (
          user_id,
          difficulty_preference,
          preferred_duration_minutes,
          preferred_categories,
          equipment_available,
          health_conditions,
          workout_frequency,
          preferred_muscle_groups,
          notification_preferences
        ) VALUES (
          ${userId},
          ${difficultyPreference},
          ${preferredDurationMinutes},
          ${preferredCategories},
          ${equipmentAvailable},
          ${healthConditions},
          ${workoutFrequency},
          ${preferredMuscleGroups},
          ${notificationPreferences}
        )
        RETURNING *
      `;
      return { preferences: result[0] };
    } else {
      const result = await sql`
        UPDATE coach_preferences
        SET 
          difficulty_preference = ${difficultyPreference},
          preferred_duration_minutes = ${preferredDurationMinutes},
          preferred_categories = ${preferredCategories},
          equipment_available = ${equipmentAvailable},
          health_conditions = ${healthConditions},
          workout_frequency = ${workoutFrequency},
          preferred_muscle_groups = ${preferredMuscleGroups},
          notification_preferences = ${notificationPreferences},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        RETURNING *
      `;
      return { preferences: result[0] };
    }
  } catch (error) {
    return { error: "Failed to save preferences" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}