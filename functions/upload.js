const { neon } = require('@neondatabase/serverless');
const { nanoid } = require('nanoid');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { image, isPrivate } = JSON.parse(event.body);
    
    // Gera um ID curto (ex: V1StGXR8_Z5jdHi6B-myT)
    const id = nanoid(10);
    
    // Extrai o MIME type do base64 (ex: image/png)
    const mimeType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

    // Salva no Neon
    await sql`
      INSERT INTO images (id, image_data, is_private, mime_type) 
      VALUES (${id}, ${image}, ${isPrivate}, ${mimeType})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        id: id,
        url: `/img/${id}` // URL Amigável
      }),
    };

  } catch (error) {
    console.error('Erro:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao salvar imagem' }) };
  }
};
