-- 1. Tabla: profiles
-- Almacena información pública del perfil del usuario, vinculada a auth.users
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    username text UNIQUE,
    bio text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT username_length CHECK ((char_length(username) >= 3) AND (char_length(username) <= 50)),
    CONSTRAINT bio_length CHECK (char_length(bio) <= 400)
);

-- Comentarios para la tabla profiles
COMMENT ON TABLE public.profiles IS 'Información del perfil para los usuarios, extendiendo auth.users.';
COMMENT ON COLUMN public.profiles.id IS 'Referencia al usuario en auth.users.';
COMMENT ON COLUMN public.profiles.username IS 'Nombre de usuario público y único para el usuario.';
COMMENT ON COLUMN public.profiles.bio IS 'Biografía corta del usuario, máximo 400 caracteres.';


-- 2. Tabla: tags
-- Almacena la definición de cada etiqueta única y su categoría
CREATE TABLE public.tags (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    category text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT tag_name_length CHECK ((char_length(name) > 0) AND (char_length(name) <= 20))
);

COMMENT ON TABLE public.tags IS 'Almacena etiquetas únicas y sus categorías opcionales.';
COMMENT ON COLUMN public.tags.name IS 'El nombre de la etiqueta, ej., "ciencia", "filosofia". Máximo 20 caracteres.';
COMMENT ON COLUMN public.tags.category IS 'Categoría opcional para la etiqueta, ej., "Tecnología", "Sociedad". Si es NULL, se considera "Misceláneo".';


-- 3. Tabla: posts
-- Almacena las publicaciones creadas por los usuarios
CREATE TABLE public.posts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- o ON DELETE CASCADE si prefieres
    title text NOT NULL,
    content text NOT NULL,
    upvote_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

COMMENT ON TABLE public.posts IS 'Publicaciones de contenido principal creadas por los usuarios.';
COMMENT ON COLUMN public.posts.user_id IS 'El usuario que creó la publicación.';
COMMENT ON COLUMN public.posts.upvote_count IS 'Contador de votos positivos (upvotes) en la publicación.';


-- 4. Tabla: post_tags
-- Tabla de unión para la relación muchos-a-muchos entre publicaciones y etiquetas
CREATE TABLE public.post_tags (
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id integer NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

COMMENT ON TABLE public.post_tags IS 'Asocia publicaciones con múltiples etiquetas. Relación muchos-a-muchos.';


-- 5. Tabla: post_upvotes
-- Rastrea los votos positivos (upvotes) únicos de los usuarios en las publicaciones
CREATE TABLE public.post_upvotes (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

COMMENT ON TABLE public.post_upvotes IS 'Rastrea los votos positivos (upvotes) únicos de usuarios en publicaciones para prevenir votos múltiples.';
