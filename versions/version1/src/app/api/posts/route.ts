import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
    const { data, error } = await supabase
        .from('posts')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const { title, content, userId, roomId } = await request.json();

    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, user_id: userId, room_id: roomId }]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}