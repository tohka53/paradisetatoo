const MAX_IMAGE_BASE64 = 1500000;
const ALLOWED = /^image\/(jpeg|png|webp|gif)$/i;

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (body.website) return res.status(200).json({ ok: true });

  const nombre = clean(body.nombre, 120);
  const email = clean(body.email, 160);
  const telefono = clean(body.telefono, 40);
  const diseno = clean(body.diseno, 4000);
  const artista = clean(body.artista, 80);

  if (!nombre || !diseno || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid_fields' });
  }

  const attachments = [];
  const img = body.imagen;
  if (img && img.data) {
    const type = String(img.type || '');
    const data = String(img.data);
    if (!ALLOWED.test(type) || data.length > MAX_IMAGE_BASE64 || !/^[A-Za-z0-9+/=]+$/.test(data)) {
      return res.status(400).json({ error: 'invalid_image' });
    }
    const ext = type.split('/')[1].replace('jpeg', 'jpg');
    const who = nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || 'cliente';
    attachments.push({ filename: who + '_referencia.' + ext, content: data });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('missing RESEND_API_KEY');
    return res.status(500).json({ error: 'not_configured' });
  }

  const html =
    '<h2>Nueva consulta - Paradise Tattoo</h2>' +
    '<table cellpadding="6" style="border-collapse:collapse">' +
    '<tr><td><b>Nombre</b></td><td>' + esc(nombre) + '</td></tr>' +
    '<tr><td><b>Email</b></td><td>' + esc(email) + '</td></tr>' +
    '<tr><td><b>Teléfono</b></td><td>' + esc(telefono || '-') + '</td></tr>' +
    '<tr><td><b>Artista</b></td><td>' + esc(artista || '-') + '</td></tr>' +
    '<tr><td><b>Idea</b></td><td>' + esc(diseno).replace(/\n/g, '<br>') + '</td></tr>' +
    '<tr><td><b>Foto de referencia</b></td><td>' + (attachments.length ? 'Adjunta a este correo' : 'No adjuntó') + '</td></tr>' +
    '</table>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Paradise Tattoo <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || 'paradisetattooantigua@gmail.com'],
        reply_to: email,
        subject: 'Nueva consulta - ' + nombre.replace(/[\r\n]+/g, ' '),
        html,
        attachments
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('resend_failed', r.status, detail);
      return res.status(502).json({ error: 'send_failed', status: r.status, detail: detail.slice(0, 300) });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('contact_failed', e);
    return res.status(500).json({ error: 'send_failed' });
  }
};
