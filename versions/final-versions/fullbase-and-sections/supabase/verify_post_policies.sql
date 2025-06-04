-- Verificar y ajustar las políticas de seguridad para la tabla posts
-- Este script comprueba si existen políticas restrictivas y las modifica para permitir contenido de gran tamaño

-- 1. Verificamos las políticas actuales
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE 'Políticas actuales para la tabla posts:';

    FOR policy_record IN
        SELECT policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies
        WHERE tablename = 'posts' AND schemaname = 'public'
    LOOP
        RAISE NOTICE 'Política: %, Permisiva: %, Roles: %, Comando: %, Condición: %, With Check: %',
                    policy_record.policyname,
                    policy_record.permissive,
                    policy_record.roles,
                    policy_record.cmd,
                    policy_record.qual,
                    policy_record.with_check;
    END LOOP;

    -- 2. Verificamos si el RLS está habilitado para posts
    IF EXISTS (
        SELECT 1 FROM pg_tables
        WHERE tablename = 'posts'
        AND schemaname = 'public'
        AND rowsecurity = true
    ) THEN
        RAISE NOTICE 'El RLS está habilitado para la tabla posts';
    ELSE
        RAISE NOTICE 'El RLS está deshabilitado para la tabla posts';
    END IF;
END $$;

-- 3. Crear una política temporal que permita inserciones sin restricciones para depuración
DO $$
BEGIN
    -- Primero verificamos si la política ya existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'posts'
        AND schemaname = 'public'
        AND policyname = 'debug_allow_all_inserts'
    ) THEN
        -- Crear política temporal para permitir inserciones sin restricciones
        EXECUTE 'CREATE POLICY debug_allow_all_inserts ON public.posts FOR INSERT TO authenticated WITH CHECK (true)';
        RAISE NOTICE 'Política temporal creada para permitir inserciones sin restricciones';
    ELSE
        RAISE NOTICE 'La política temporal ya existe';
    END IF;
END $$;
