const { neon } = require('@neondatabase/serverless');
const { nanoid } = require('nanoid');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { image, isPrivate } = body;

    if (!image) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const id = nanoid(10);
    const mimeType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

    await sql`
      INSERT INTO images (id, image_data, is_private, mime_type)
      VALUES (${id}, ${image}, ${isPrivate ?? false}, ${mimeType})
    `;

    return res.status(200).json({
      success: true,
      id: id,
      url: `/img/${id}`
    });

  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    return res.status(500).json({ error: 'Erro ao salvar imagem' });
  }
};