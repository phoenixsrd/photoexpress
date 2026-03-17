const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const id = (event.queryStringParameters && event.queryStringParameters.id)
    || event.path.split('/').pop();

  if (!id) return { statusCode: 400, body: 'ID Missing' };

  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  
  const result = await sql`SELECT image_data, mime_type, is_private FROM images WHERE id = ${id}`;

  if (result.length === 0) {
    return { statusCode: 404, body: 'Imagem não encontrada' };
  }

  const img = result[0];

  const base64Data = img.image_data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': img.mime_type,
      'Cache-Control': 'public, max-age=86400'
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
};