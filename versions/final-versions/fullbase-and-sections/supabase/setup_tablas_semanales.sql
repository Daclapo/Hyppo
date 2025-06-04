-- Tabla para publicaciones semanales (creadas por admin)
CREATE TABLE public.weekly_posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL CHECK (char_length(title) > 0),
  content text NOT NULL,
  year integer NOT NULL,
  week_number integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT weekly_posts_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_posts_year_week_unique UNIQUE (year, week_number)
);

-- Tabla para reflexiones asociadas a publicaciones semanales
CREATE TABLE public.weekly_reflections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  weekly_post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL CHECK (char_length(title) > 0),
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT weekly_reflections_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reflections_weekly_post_id_fkey FOREIGN KEY (weekly_post_id) REFERENCES public.weekly_posts(id),
  CONSTRAINT weekly_reflections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Tabla para comentarios en reflexiones semanales
CREATE TABLE public.weekly_reflection_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  reflection_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (char_length(content) > 0),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT weekly_reflection_comments_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reflection_comments_reflection_id_fkey FOREIGN KEY (reflection_id) REFERENCES public.weekly_reflections(id),
  CONSTRAINT weekly_reflection_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Establecer políticas de seguridad RLS para weekly_posts
ALTER TABLE public.weekly_posts ENABLE ROW LEVEL SECURITY;

-- Políticas para weekly_posts
-- Cualquiera puede ver las publicaciones semanales
CREATE POLICY "Weekly posts are viewable by everyone"
ON public.weekly_posts FOR SELECT
USING (true);

-- Solo los usuarios autenticados con rol de administrador pueden crear, actualizar o eliminar publicaciones semanales
-- (Nota: Esta política asume que hay una forma de identificar a los administradores, que se debe implementar)
CREATE POLICY "Weekly posts can be created by admins only"
ON public.weekly_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE admin = true));

CREATE POLICY "Weekly posts can be updated by admins only"
ON public.weekly_posts FOR UPDATE
TO authenticated
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE admin = true));

CREATE POLICY "Weekly posts can be deleted by admins only"
ON public.weekly_posts FOR DELETE
TO authenticated
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE admin = true));

-- Establecer políticas de seguridad RLS para weekly_reflections
ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;

-- Políticas para weekly_reflections
-- Cualquiera puede ver las reflexiones
CREATE POLICY "Weekly reflections are viewable by everyone"
ON public.weekly_reflections FOR SELECT
USING (true);

-- Solo usuarios autenticados pueden crear reflexiones
CREATE POLICY "Weekly reflections can be created by authenticated users"
ON public.weekly_reflections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias reflexiones
CREATE POLICY "Users can update their own weekly reflections"
ON public.weekly_reflections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propias reflexiones
CREATE POLICY "Users can delete their own weekly reflections"
ON public.weekly_reflections FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Establecer políticas de seguridad RLS para weekly_reflection_comments
ALTER TABLE public.weekly_reflection_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para weekly_reflection_comments
-- Cualquiera puede ver los comentarios
CREATE POLICY "Weekly reflection comments are viewable by everyone"
ON public.weekly_reflection_comments FOR SELECT
USING (true);

-- Solo usuarios autenticados pueden crear comentarios
CREATE POLICY "Weekly reflection comments can be created by authenticated users"
ON public.weekly_reflection_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propios comentarios
CREATE POLICY "Users can update their own weekly reflection comments"
ON public.weekly_reflection_comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propios comentarios
CREATE POLICY "Users can delete their own weekly reflection comments"
ON public.weekly_reflection_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Añadir columna 'admin' a la tabla profiles (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'admin'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;
