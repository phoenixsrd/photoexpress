const { neon } = require('@neondatabase/serverless');
const { nanoid } = require('nanoid');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { image, isPrivate } = body;

    if (!image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nenhuma imagem enviada' }) };
    }

    const id = nanoid(10);
    const mimeType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

    await sql`
      INSERT INTO images (id, image_data, is_private, mime_type)
      VALUES (${id}, ${image}, ${isPrivate ?? false}, ${mimeType})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        id: id,
        url: `/img/${id}`
      }),
    };

  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao salvar imagem' }),
    };
  }
};