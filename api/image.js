const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('ID da imagem não informado');
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT image_data, mime_type, is_private
      FROM images
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).send('Imagem não encontrada');
    }

    const img = result[0];
    const base64Data = img.image_data.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', img.mime_type);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return res.status(500).send('Erro interno ao buscar imagem');
  }
};