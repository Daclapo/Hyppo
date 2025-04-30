-- Tabla de usuarios (aprovecha la tabla auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de temas
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de publicaciones
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  topic_id UUID REFERENCES topics(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Configurar políticas de seguridad RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Profiles son visibles para todos" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden editar sus propios perfiles" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para categories
CREATE POLICY "Categories son visibles para todos" ON categories
  FOR SELECT USING (true);

-- Políticas para topics
CREATE POLICY "Topics son visibles para todos" ON topics
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden crear topics" ON topics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus propios topics" ON topics
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para posts
CREATE POLICY "Posts son visibles para todos" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden crear posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus propios posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);
