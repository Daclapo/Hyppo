-- Modificar la tabla 'posts' para permitir contenido de gran tamaño
-- Verificamos si existe la tabla 'posts'
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        -- Alteramos la tabla solo si existe
        -- Verificamos si el tipo de la columna 'content' es text
        IF EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'posts'
            AND column_name = 'content'
            AND data_type = 'text'
        ) THEN
            -- Cambiamos el tipo de la columna 'content' a text sin límite de tamaño
            -- (En PostgreSQL, text ya es ilimitado, pero esto podría resolver problemas con clientes)
            ALTER TABLE public.posts ALTER COLUMN content TYPE text;

            -- Eliminamos cualquier restricción de tamaño si existiera
            ALTER TABLE public.posts ALTER COLUMN content DROP NOT NULL;
            ALTER TABLE public.posts ALTER COLUMN content SET NOT NULL;

            RAISE NOTICE 'Tabla posts modificada correctamente para permitir contenido de gran tamaño.';
        ELSE
            RAISE NOTICE 'La columna content ya tiene un tipo adecuado.';
        END IF;
    ELSE
        RAISE NOTICE 'La tabla posts no existe en el esquema public.';
    END IF;
END $$;
