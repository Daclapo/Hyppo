ALTER TABLE public.debate_questions ALTER COLUMN question TYPE text;

-- Añadir columna de título a la tabla de preguntas de debate
ALTER TABLE public.debate_questions ADD COLUMN title text NOT NULL DEFAULT '';

-- Renombrar la columna question a content para mayor claridad
ALTER TABLE public.debate_questions RENAME COLUMN question TO content;

