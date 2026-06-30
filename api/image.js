const { getImage } = require('../lib/imageStore');

module.exports = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('ID da imagem não informado');
  }

  try {
    const img = await getImage(id);

    if (!img) {
      return res.status(404).send('Imagem não encontrada');
    }

    res.setHeader('Content-Type', img.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(img.buffer);

  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return res.status(500).send('Erro interno ao buscar imagem');
  }
};