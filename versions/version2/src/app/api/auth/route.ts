import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Ruta para iniciar sesión
export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const { email, password } = requestData;

        const supabase = createRouteHandlerClient({ cookies });

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({
            user: data.user,
            message: 'Inicio de sesión exitoso'
        });
    } catch (err: any) {
        console.error('Error en inicio de sesión:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
