-- Asignar permisos de administrador a un usuario específico
-- Reemplaza 'tu_email@ejemplo.com' con el email del usuario que deseas hacer administrador
UPDATE public.profiles
SET admin = true
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'tu_email@ejemplo.com'
);

-- Alternativamente, si conoces el ID del usuario:
-- UPDATE public.profiles
-- SET admin = true
-- WHERE id = 'el-id-del-usuario';

-- Verificar que el usuario ha sido actualizado
SELECT id, username, admin
FROM public.profiles
WHERE admin = true;
