const { neon } = require('@neondatabase/serverless');
const { nanoid } = require('nanoid');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

class ValidationError extends Error {}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return null;
  return { mimeType: match[1], base64Data: match[2] };
}

async function saveImage(image, isPrivate) {
  const parsed = parseDataUrl(image);
  if (!parsed) {
    throw new ValidationError('Formato de imagem inválido');
  }
  if (!ALLOWED_MIME_TYPES.includes(parsed.mimeType)) {
    throw new ValidationError('Tipo de arquivo não permitido');
  }
  if (Buffer.byteLength(parsed.base64Data, 'base64') > MAX_IMAGE_SIZE_BYTES) {
    throw new ValidationError('Imagem maior que 5MB');
  }

  const sql = neon(process.env.DATABASE_URL);
  const id = nanoid(10);

  await sql`
    INSERT INTO images (id, image_data, is_private, mime_type)
    VALUES (${id}, ${image}, ${isPrivate ?? false}, ${parsed.mimeType})
  `;

  return { id, url: `/img/${id}` };
}

async function getImage(id) {
  const sql = neon(process.env.DATABASE_URL);
  const result = await sql`
    SELECT image_data, mime_type
    FROM images
    WHERE id = ${id}
  `;

  if (result.length === 0) return null;

  const img = result[0];
  const base64Data = img.image_data.split(',')[1];
  return { buffer: Buffer.from(base64Data, 'base64'), mimeType: img.mime_type };
}

module.exports = { saveImage, getImage, ValidationError };