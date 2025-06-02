-- Tabla: post_comments
-- Almacena los comentarios realizados por usuarios en las publicaciones
CREATE TABLE public.post_comments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT content_not_empty CHECK (char_length(content) > 0),
    CONSTRAINT content_max_length CHECK (char_length(content) <= 5000)
);

COMMENT ON TABLE public.post_comments IS 'Comentarios realizados por usuarios en las publicaciones.';
COMMENT ON COLUMN public.post_comments.post_id IS 'La publicación a la que pertenece este comentario.';
COMMENT ON COLUMN public.post_comments.user_id IS 'El usuario que creó el comentario.';
COMMENT ON COLUMN public.post_comments.content IS 'El contenido del comentario. Máximo 5000 caracteres.';

-- Crear un trigger para actualizar el campo updated_at automáticamente
CREATE TRIGGER on_post_comments_updated
BEFORE UPDATE ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Políticas RLS para post_comments
-- Habilitar RLS en la tabla
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Permitir a todos leer los comentarios
CREATE POLICY "Permitir lectura pública de comentarios"
ON public.post_comments
FOR SELECT
USING (true);

-- Permitir a usuarios autenticados crear comentarios
CREATE POLICY "Permitir a usuarios autenticados crear comentarios"
ON public.post_comments
FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Permitir al propietario actualizar su propio comentario
CREATE POLICY "Permitir al propietario actualizar su propio comentario"
ON public.post_comments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permitir al propietario borrar su propio comentario
CREATE POLICY "Permitir al propietario borrar su propio comentario"
ON public.post_comments
FOR DELETE
USING (auth.uid() = user_id);
