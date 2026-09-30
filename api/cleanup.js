const { list, del } = require('@vercel/blob');

const RETENTION_DAYS = 14;

module.exports = async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== 'Bearer ' + secret) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const limit = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  let cursor;
  let deleted = 0;
  try {
    do {
      const page = await list({ prefix: 'referencias/', cursor, limit: 500 });
      const old = page.blobs
        .filter(b => new Date(b.uploadedAt).getTime() < limit)
        .map(b => b.url);
      if (old.length) {
        await del(old);
        deleted += old.length;
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return res.status(200).json({ deleted });
  } catch (e) {
    return res.status(500).json({ error: 'cleanup_failed' });
  }
};
