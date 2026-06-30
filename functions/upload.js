const { saveImage, ValidationError } = require('../lib/imageStore');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { image, isPrivate } = body;

    if (!image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nenhuma imagem enviada' }) };
    }

    const result = await saveImage(image, isPrivate);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...result }),
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    }
    console.error('Erro ao salvar imagem:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao salvar imagem' }),
    };
  }
};