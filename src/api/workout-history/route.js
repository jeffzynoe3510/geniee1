async function handler({
  exerciseId,
  durationSeconds,
  performanceRating,
  notes,
  postureFeedback,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const result = await sql`
      INSERT INTO workout_history 
      (user_id, exercise_id, duration_seconds, performance_rating, notes, posture_feedback)
      VALUES 
      (${session.user.id}, ${exerciseId}, ${durationSeconds}, ${performanceRating}, ${notes}, ${postureFeedback})
      RETURNING *
    `;

    return { workoutHistory: result[0] };
  } catch (error) {
    return { error: "Failed to save workout history" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}