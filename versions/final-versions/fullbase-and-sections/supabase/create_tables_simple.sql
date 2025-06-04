-- Crear tabla weekly_posts
CREATE TABLE IF NOT EXISTS public.weekly_posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  year integer NOT NULL,
  week_number integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT weekly_posts_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_posts_year_week_unique UNIQUE (year, week_number)
);

-- Crear tabla weekly_reflections
CREATE TABLE IF NOT EXISTS public.weekly_reflections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  weekly_post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT weekly_reflections_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reflections_weekly_post_id_fkey FOREIGN KEY (weekly_post_id) REFERENCES public.weekly_posts(id),
  CONSTRAINT weekly_reflections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Crear tabla weekly_reflection_comments
CREATE TABLE IF NOT EXISTS public.weekly_reflection_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  reflection_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT weekly_reflection_comments_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reflection_comments_reflection_id_fkey FOREIGN KEY (reflection_id) REFERENCES public.weekly_reflections(id),
  CONSTRAINT weekly_reflection_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Habilitar RLS en las tablas
ALTER TABLE public.weekly_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reflection_comments ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para weekly_posts
CREATE POLICY "Weekly posts are viewable by everyone"
ON public.weekly_posts FOR SELECT
USING (true);

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

-- Crear políticas de seguridad para weekly_reflections
CREATE POLICY "Weekly reflections are viewable by everyone"
ON public.weekly_reflections FOR SELECT
USING (true);

CREATE POLICY "Weekly reflections can be created by authenticated users"
ON public.weekly_reflections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly reflections"
ON public.weekly_reflections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly reflections"
ON public.weekly_reflections FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Crear políticas de seguridad para weekly_reflection_comments
CREATE POLICY "Weekly reflection comments are viewable by everyone"
ON public.weekly_reflection_comments FOR SELECT
USING (true);

CREATE POLICY "Weekly reflection comments can be created by authenticated users"
ON public.weekly_reflection_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly reflection comments"
ON public.weekly_reflection_comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly reflection comments"
ON public.weekly_reflection_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
