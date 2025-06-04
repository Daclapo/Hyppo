-- Script simplificado para crear las tablas
DROP TABLE IF EXISTS public.weekly_reflection_comments;
DROP TABLE IF EXISTS public.weekly_reflections;
DROP TABLE IF EXISTS public.weekly_posts;

-- Crear tabla weekly_posts
CREATE TABLE public.weekly_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  year integer NOT NULL,
  week_number integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(year, week_number)
);

-- Crear tabla weekly_reflections
CREATE TABLE public.weekly_reflections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  weekly_post_id uuid REFERENCES public.weekly_posts(id) NOT NULL,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla weekly_reflection_comments
CREATE TABLE public.weekly_reflection_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  reflection_id uuid REFERENCES public.weekly_reflections(id) NOT NULL,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.weekly_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reflection_comments ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
-- weekly_posts
CREATE POLICY "Weekly posts are viewable by everyone"
  ON public.weekly_posts FOR SELECT USING (true);

CREATE POLICY "Weekly posts can be created by admins only"
  ON public.weekly_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE admin = true));

-- weekly_reflections
CREATE POLICY "Weekly reflections are viewable by everyone"
  ON public.weekly_reflections FOR SELECT USING (true);

CREATE POLICY "Weekly reflections can be created by users"
  ON public.weekly_reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- weekly_reflection_comments
CREATE POLICY "Weekly reflection comments are viewable by everyone"
  ON public.weekly_reflection_comments FOR SELECT USING (true);

CREATE POLICY "Weekly reflection comments can be created by users"
  ON public.weekly_reflection_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
