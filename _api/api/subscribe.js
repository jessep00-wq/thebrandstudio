module.exports = async function handler(req, res) {
  try {
    const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const body = req.body || {};
    const firstName = (body.firstName || '').trim();
    const lastName  = (body.lastName  || '').trim();
    const email     = (body.email     || '').trim();

    if (!firstName || !email) {
      return res.status(400).json({ message: 'First name and email are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const AUDIENCE_ID   = process.env.RESEND_AUDIENCE_ID;
    const PDF_URL       = process.env.PDF_DOWNLOAD_URL || 'https://thebrandstudio.studio/30-caption-starters.pdf';

    if (!RESEND_API_KEY) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // Add to audience
    if (AUDIENCE_ID) {
      try {
        const ar = await fetch('https://api.resend.com/audiences/' + AUDIENCE_ID + '/contacts', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, first_name: firstName, last_name: lastName, unsubscribed: false }),
        });
        const ad = await ar.json();
        console.log('audience result:', JSON.stringify(ad));
      } catch (ae) {
        console.warn('audience error:', ae.message);
      }
    }

    // Send email
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [email],
        reply_to: 'jessep_00@hotmail.com',
        subject: 'Your 30 Caption Starters are here',
        html: '<p>Hi ' + firstName + ',</p><p>Download your free guide: <a href="' + PDF_URL + '">30 Caption Starters</a></p><p>- Jessica, Brand Voice Studio</p>',
      }),
    });

    const emailData = await emailRes.json();
    console.log('email result:', JSON.stringify(emailData));

    if (!emailRes.ok) {
      return res.status(500).json({ message: emailData.message || 'Email send failed.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('handler error:', err.message, err.stack);
    return res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};
