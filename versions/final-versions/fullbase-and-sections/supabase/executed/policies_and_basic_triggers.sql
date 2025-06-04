-- POLÍTICAS RLS --

-- Políticas para: profiles

CREATE POLICY "Permitir lectura publica a los perfiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Permitir a usuarios actualizar su propio perfil"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir a usuarios insertar su propio perfil"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id AND auth.role() = 'authenticated');


-- Políticas para: posts

CREATE POLICY "Permitir lectura publica a los posts"
ON public.posts
FOR SELECT
USING (true);

CREATE POLICY "Permitir a usuarios autenticados crear posts"
ON public.posts
FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Permitir al propietario actualizar su propio post"
ON public.posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir al propietario borrar su propio post"
ON public.posts
FOR DELETE
USING (auth.uid() = user_id);


-- Políticas para: tags

CREATE POLICY "Permitir lectura publica a los tags"
ON public.tags
FOR SELECT
USING (true);

CREATE POLICY "Permitir a usuarios autenticados insertar tags"
ON public.tags
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');


-- Políticas para: post_tags

CREATE POLICY "Permitir lectura publica a las asociaciones post_tags"
ON public.post_tags
FOR SELECT
USING (true);

-- Esta política permite al dueño del post gestionar sus tags.
-- El backend (API route usando la sesión del usuario) es responsable de esta lógica.
CREATE POLICY "Permitir al propietario del post gestionar sus tags"
ON public.post_tags
FOR ALL -- Cubre INSERT y DELETE, que son las operaciones típicas aquí
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.id = post_tags.post_id AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.id = post_tags.post_id AND p.user_id = auth.uid()
  )
);


-- Políticas para: post_upvotes

CREATE POLICY "Permitir al usuario ver sus propios upvotes"
ON public.post_upvotes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Permitir a usuarios insertar sus propios upvotes"
ON public.post_upvotes
FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Permitir a usuarios borrar sus propios upvotes"
ON public.post_upvotes
FOR DELETE
USING (auth.role() = 'authenticated' AND auth.uid() = user_id);


-- TRIGGERS --

-- 1. Crear la función del trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Aplicar el trigger a la tabla profiles
CREATE TRIGGER on_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 3. Aplicar el trigger a la tabla posts
CREATE TRIGGER on_posts_updated
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
