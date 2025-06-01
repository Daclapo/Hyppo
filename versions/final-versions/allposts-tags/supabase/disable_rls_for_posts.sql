-- Desactivar RLS para la tabla posts
-- Esto permitirá que cualquier usuario autenticado pueda realizar operaciones CRUD en la tabla posts
-- NOTA: Esta es una solución temporal. Para una solución a largo plazo, se deberían configurar
-- políticas RLS más específicas.

ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
