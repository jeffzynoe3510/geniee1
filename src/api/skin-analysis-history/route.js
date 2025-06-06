async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const history = await sql`
      SELECT * FROM skin_analysis_history 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return { success: true, data: history };
  } catch (error) {
    return { error: "Failed to fetch skin analysis history" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}