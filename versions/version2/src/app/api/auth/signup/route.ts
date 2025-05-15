import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Ruta para registrar un nuevo usuario
export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const { email, password, name } = requestData;

        const supabase = createRouteHandlerClient({ cookies });

        // Crear el usuario en Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || '',
                }
            }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Opcional: crear un registro en una tabla personalizada de usuarios
        if (data?.user) {
            await supabase.from('users').insert({
                id: data.user.id,
                email: data.user.email,
                username: email.split('@')[0],
                name: name || ''
            });
        }

        return NextResponse.json({
            user: data.user,
            message: 'Registro exitoso. Por favor, revisa tu correo para confirmar tu cuenta.'
        });
    } catch (err: any) {
        console.error('Error en registro:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
