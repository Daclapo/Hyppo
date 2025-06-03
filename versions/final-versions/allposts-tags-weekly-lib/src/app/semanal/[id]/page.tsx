import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ClientWeeklyPost } from "./client-components"

export default async function WeeklyPostPage({ params }: { params: { id: string } }) {
  // Next.js 15 requiere esperar todo el objeto params
  const safeParams = await params;
  const postId = safeParams.id;
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  return (
    <ClientWeeklyPost postId={postId} />
  );
}
