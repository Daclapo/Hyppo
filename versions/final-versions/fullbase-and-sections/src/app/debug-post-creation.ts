// Debug script para probar la creación de publicaciones grandes
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Esta función intenta crear una publicación con diferentes tamaños de contenido
 * para identificar si hay un límite que causa problemas
 */
async function testPostCreation() {
  const supabase = createClientComponentClient();

  // Verificar sesión actual
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    console.error("No hay sesión activa. Por favor inicia sesión.");
    return;
  }

  const userId = session.session.user.id;
  console.log(`Usuario autenticado: ${userId}`);

  // Tamaños de contenido a probar (en caracteres)
  const contentSizes = [500, 1000, 5000, 10000, 20000, 50000];

  for (const size of contentSizes) {
    try {
      console.log(`\nProbando con contenido de ${size} caracteres...`);

      // Generar un título para esta prueba
      const title = `Prueba de tamaño: ${size} caracteres ${new Date().toISOString()}`;

      // Generar un contenido de texto con el tamaño especificado
      const content = "Lorem ipsum dolor sit amet ".repeat(Math.ceil(size / 30));
      console.log(`Tamaño real del contenido: ${content.length} caracteres`);

      console.time(`Creación de post de ${size} caracteres`);

      // Intentar crear la publicación
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: userId,
          title: title,
          content: content.substring(0, size),
          upvote_count: 0
        })
        .select()
        .single();

      console.timeEnd(`Creación de post de ${size} caracteres`);

      if (error) {
        console.error(`Error al crear post de ${size} caracteres:`, error);
      } else {
        console.log(`Post creado con éxito. ID: ${data.id}`);
      }

    } catch (err) {
      console.error(`Error inesperado con tamaño ${size}:`, err);
    }
  }
}

// Ejecutar la prueba cuando se cargue la página
window.addEventListener('DOMContentLoaded', () => {
  const testButton = document.createElement('button');
  testButton.textContent = 'Ejecutar prueba de creación de posts';
  testButton.style.position = 'fixed';
  testButton.style.bottom = '20px';
  testButton.style.right = '20px';
  testButton.style.zIndex = '9999';
  testButton.style.padding = '10px';
  testButton.style.backgroundColor = '#2563eb';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '5px';
  testButton.style.cursor = 'pointer';

  testButton.addEventListener('click', async () => {
    console.log('Iniciando prueba de creación de posts...');
    await testPostCreation();
    console.log('Prueba completada.');
  });

  document.body.appendChild(testButton);
});

export {};
