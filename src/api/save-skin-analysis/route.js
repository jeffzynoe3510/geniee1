async function handler({ userId, imageUrl, analysisResults, recommendations }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [savedAnalysis] = await sql`
      INSERT INTO skin_analysis_history 
      (user_id, image_url, analysis_results, recommendations)
      VALUES 
      (${session.user.id}, ${imageUrl}, ${analysisResults}, ${recommendations})
      RETURNING *
    `;

    return { success: true, data: savedAnalysis };
  } catch (error) {
    return { error: "Failed to save skin analysis" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}