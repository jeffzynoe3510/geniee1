async function handler({ tryOnId }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const tryOnRecord = await sql`
      SELECT * FROM virtual_tryon_history 
      WHERE id = ${tryOnId} AND user_id = ${session.user.id}
    `;

    if (!tryOnRecord?.length) {
      return { error: "Try-on record not found" };
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/virtual-tryon/${tryOnId}`;

    await sql`
      UPDATE virtual_tryon_history 
      SET share_url = ${shareUrl}, is_public = true 
      WHERE id = ${tryOnId} AND user_id = ${session.user.id}
    `;

    return { shareUrl };
  } catch (error) {
    return { error: "Failed to generate share URL" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}