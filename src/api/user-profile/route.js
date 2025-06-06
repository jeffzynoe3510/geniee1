async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [profile] = await sql`
      SELECT 
        up.id,
        up.user_id,
        up.preferences,
        up.created_at,
        up.updated_at,
        au.name,
        au.email,
        au.image
      FROM user_profiles up
      LEFT JOIN auth_users au ON au.id = up.user_id
      WHERE up.user_id = ${session.user.id}
    `;

    if (!profile) {
      const [newProfile] = await sql`
        INSERT INTO user_profiles (user_id, preferences)
        VALUES (${session.user.id}, '{}')
        RETURNING *
      `;
      return { profile: newProfile };
    }

    return { profile };
  } catch (error) {
    return { error: "Failed to fetch user profile" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}