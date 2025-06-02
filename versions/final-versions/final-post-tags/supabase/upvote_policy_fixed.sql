-- Versión corregida: Agregar política RLS para permitir a usuarios autenticados actualizar el campo upvote_count

-- Primero eliminamos la política existente que restringe actualizaciones a solo el propietario
DROP POLICY IF EXISTS "Permitir al propietario actualizar su propio post" ON public.posts;

-- Creamos dos políticas: una para el propietario y otra para upvotes
CREATE POLICY "Permitir al propietario actualizar su propio post"
ON public.posts
FOR UPDATE
USING (auth.uid() = user_id);

-- Política separada para permitir cualquier actualización del contador de upvotes
CREATE POLICY "Permitir a usuarios autenticados actualizar upvote_count"
ON public.posts
FOR UPDATE
USING (auth.role() = 'authenticated');
