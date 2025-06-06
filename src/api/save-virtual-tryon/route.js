async function handler({ userId, outfitData, imageUrl }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [savedTryOn] = await sql`
      INSERT INTO virtual_tryon_history 
        (user_id, outfit_data, image_url)
      VALUES 
        (${session.user.id}, ${outfitData}, ${imageUrl})
      RETURNING *
    `;

    return { success: true, data: savedTryOn };
  } catch (error) {
    return { error: "Failed to save virtual try-on" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}