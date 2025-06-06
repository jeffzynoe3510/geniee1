async function handler({ userId, preferences }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    // Check if profile exists
    const [existingProfile] = await sql`
      SELECT * FROM user_profiles 
      WHERE user_id = ${session.user.id}
    `;

    let profile;

    if (existingProfile) {
      // Update existing profile
      [profile] = await sql`
        UPDATE user_profiles 
        SET 
          preferences = ${preferences},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${session.user.id}
        RETURNING *
      `;
    } else {
      // Create new profile
      [profile] = await sql`
        INSERT INTO user_profiles (user_id, preferences)
        VALUES (${session.user.id}, ${preferences})
        RETURNING *
      `;
    }

    return { profile };
  } catch (error) {
    return { error: "Failed to update preferences" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}