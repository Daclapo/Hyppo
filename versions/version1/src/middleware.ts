import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  // Versión simplificada del middleware
  // Puedes expandir esto más adelante cuando instales @supabase/auth-helpers-nextjs

  return res;
};
