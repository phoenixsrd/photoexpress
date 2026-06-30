const { saveImage, ValidationError } = require('../lib/imageStore');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { image, isPrivate } = body;

    if (!image) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const result = await saveImage(image, isPrivate);
    return res.status(200).json({ success: true, ...result });

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Erro ao salvar imagem:', error);
    return res.status(500).json({ error: 'Erro ao salvar imagem' });
  }
};