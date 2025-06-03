import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ClientWeeklyPost } from "./client-components"
import React from "react"

export default async function WeeklyPostPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const postId = React.use(Promise.resolve(params.id));

  return (
    <ClientWeeklyPost postId={postId} />
  );
}
