const { put } = require('@vercel/blob');

const MAX_BYTES = 1536 * 1024;
const ALLOWED = /^image\/(jpeg|png|webp|gif|heic|heif)$/i;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const type = String(req.headers['content-type'] || '');
  const length = Number(req.headers['content-length'] || 0);
  if (!ALLOWED.test(type)) return res.status(415).json({ error: 'invalid_type' });
  if (!length || length > MAX_BYTES) return res.status(413).json({ error: 'invalid_size' });
  const raw = String(req.headers['x-filename'] || 'referencia');
  const safe = raw.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'referencia';
  try {
    const blob = await put('referencias/' + safe, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: type
    });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    return res.status(500).json({ error: 'upload_failed' });
  }
};
