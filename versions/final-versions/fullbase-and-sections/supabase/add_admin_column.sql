-- Añadir columna 'admin' a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS admin boolean NOT NULL DEFAULT false;

-- Establecer como administradores a los usuarios especificados
UPDATE public.profiles
SET admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN ('daclapo42@gmail.com', 'davidclarksonpostigo@gmail.com')
);

-- Verificar que los usuarios han sido actualizados
SELECT id, username, email, admin
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE admin = true;
