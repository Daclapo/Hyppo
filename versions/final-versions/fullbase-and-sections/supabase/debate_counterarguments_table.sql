-- Tabla para contraargumentos
CREATE TABLE public.debate_counterarguments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  argument_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (char_length(content) > 0),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT debate_counterarguments_pkey PRIMARY KEY (id),
  CONSTRAINT debate_counterarguments_argument_id_fkey FOREIGN KEY (argument_id) REFERENCES public.debate_arguments(id),
  CONSTRAINT debate_counterarguments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Políticas de seguridad para contraargumentos
ALTER TABLE public.debate_counterarguments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver contraargumentos"
  ON public.debate_counterarguments FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear contraargumentos"
  ON public.debate_counterarguments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus propios contraargumentos"
  ON public.debate_counterarguments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios contraargumentos"
  ON public.debate_counterarguments FOR DELETE
  USING (auth.uid() = user_id);

-- Función para contar contraargumentos
CREATE OR REPLACE FUNCTION public.count_debate_counterarguments(argument_id uuid)
RETURNS bigint
LANGUAGE sql
AS $$
  SELECT COUNT(*)
  FROM public.debate_counterarguments
  WHERE debate_counterarguments.argument_id = count_debate_counterarguments.argument_id;
$$;
