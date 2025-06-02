-- Esta función incrementa o decrementa el contador de upvotes de un post de forma atómica
-- y devuelve la información actualizada del post junto con los datos del autor
CREATE OR REPLACE FUNCTION public.increment_upvote(
    post_id_param UUID,
    increment_amount INT
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    upvote_count INT,
    created_at TIMESTAMPTZ,
    user_id UUID,
    username TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Actualizar el contador de votos
    UPDATE public.posts
    SET upvote_count = upvote_count + increment_amount
    WHERE id = post_id_param;

    -- Devolver los datos actualizados del post junto con información del autor
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.content,
        p.upvote_count,
        p.created_at,
        p.user_id,
        profiles.username
    FROM
        public.posts p
    JOIN
        public.profiles ON p.user_id = profiles.id
    WHERE
        p.id = post_id_param;
END;
$$;
