-- Verificar si las tablas existen
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('weekly_posts', 'weekly_reflections', 'weekly_reflection_comments');

-- Verificar permisos de administrador
SELECT id, email, admin
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE admin = true;
