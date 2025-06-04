-- Tabla para preguntas de debate
CREATE TABLE public.debate_questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  question text NOT NULL CHECK (char_length(question) > 0),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT debate_questions_pkey PRIMARY KEY (id),
  CONSTRAINT debate_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Tabla para argumentos de debate
CREATE TABLE public.debate_arguments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  question_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (char_length(content) > 0),
  is_in_favor boolean NOT NULL, -- true para argumentos "a favor", false para "en contra"
  intensity smallint NOT NULL CHECK (intensity >= 1 AND intensity <= 3), -- 1: algo, 2: neutro, 3: muy
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT debate_arguments_pkey PRIMARY KEY (id),
  CONSTRAINT debate_arguments_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.debate_questions(id),
  CONSTRAINT debate_arguments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Tabla para sugerencias
CREATE TABLE public.suggestions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (char_length(content) > 0),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT suggestions_pkey PRIMARY KEY (id),
  CONSTRAINT suggestions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Políticas de seguridad (RLS) para debates
ALTER TABLE public.debate_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Políticas para preguntas de debate
CREATE POLICY "Cualquiera puede ver preguntas de debate"
  ON public.debate_questions FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear preguntas de debate"
  ON public.debate_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus propias preguntas de debate"
  ON public.debate_questions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias preguntas de debate"
  ON public.debate_questions FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para argumentos de debate
CREATE POLICY "Cualquiera puede ver argumentos de debate"
  ON public.debate_arguments FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear argumentos de debate"
  ON public.debate_arguments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus propios argumentos de debate"
  ON public.debate_arguments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios argumentos de debate"
  ON public.debate_arguments FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para sugerencias
CREATE POLICY "Cualquiera puede ver sugerencias"
  ON public.suggestions FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear sugerencias"
  ON public.suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus propias sugerencias"
  ON public.suggestions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias sugerencias"
  ON public.suggestions FOR DELETE
  USING (auth.uid() = user_id);

-- Función para contar argumentos a favor y en contra
CREATE OR REPLACE FUNCTION public.count_debate_arguments(question_id uuid)
RETURNS TABLE(in_favor_count bigint, against_count bigint)
LANGUAGE sql
AS $$
  SELECT
    COUNT(*) FILTER (WHERE is_in_favor = true) as in_favor_count,
    COUNT(*) FILTER (WHERE is_in_favor = false) as against_count
  FROM public.debate_arguments
  WHERE debate_arguments.question_id = count_debate_arguments.question_id;
$$;
