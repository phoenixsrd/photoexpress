const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const id = event.queryStringParameters.id;

  if (!id) return { statusCode: 400, body: 'ID Missing' };

  const sql = neon(process.env.DATABASE_URL);
  
  // Busca a imagem
  const result = await sql`SELECT image_data, mime_type, is_private FROM images WHERE id = ${id}`;

  if (result.length === 0) {
    return { statusCode: 404, body: 'Imagem não encontrada' };
  }

  const img = result[0];

  // Lógica Simples de Privacidade:
  // Se fosse um sistema complexo, verificaríamos tokens/cookies aqui.
  // Como o requisito é "URL privada", o próprio ID complexo (nanoid) já serve como "segredo".
  // Mas se você quiser bloquear listagens públicas no futuro, a flag 'is_private' já está salva.

  // Remove o cabeçalho do base64 (data:image/png;base64,) para enviar o binário
  const base64Data = img.image_data.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': img.mime_type,
      'Cache-Control': 'public, max-age=86400' // Cache de 1 dia
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
};
