const { getImage } = require('../lib/imageStore');

exports.handler = async (event) => {
  const id = (event.queryStringParameters && event.queryStringParameters.id)
    || event.path.split('/').pop();

  if (!id) {
    return { statusCode: 400, body: 'ID da imagem não informado' };
  }

  try {
    const img = await getImage(id);

    if (!img) {
      return { statusCode: 404, body: 'Imagem não encontrada' };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': img.mimeType,
        'Cache-Control': 'public, max-age=86400'
      },
      body: img.buffer.toString('base64'),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return { statusCode: 500, body: 'Erro interno ao buscar imagem' };
  }
};