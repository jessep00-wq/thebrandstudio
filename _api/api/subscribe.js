/**
 * Brand Voice Studio — Lead Magnet Subscribe Endpoint
 * 
 * POST /api/subscribe
 * Body: { firstName, lastName, email }
 * 
 * Actions:
 * 1. Adds contact to Resend Audiences list
 * 2. Sends delivery email with PDF download link
 * 
 * Required env vars (set in Vercel dashboard):
 *   RESEND_API_KEY      — your Resend API key
 *   RESEND_AUDIENCE_ID  — Resend Audience ID for Brand Voice Studio subscribers
 *   PDF_DOWNLOAD_URL    — public URL of the PDF (hosted on GitHub Pages)
 *   ALLOWED_ORIGIN      — https://thebrandstudio.studio
 */

const { Resend } = require('resend');

const PDF_URL = process.env.PDF_DOWNLOAD_URL || 'https://thebrandstudio.studio/30-caption-starters.pdf';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://thebrandstudio.studio';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email } = req.body || {};

  if (!firstName || !email) {
    return res.status(400).json({ message: 'First name and email are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1. Add to Resend Audience
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName,
        lastName: lastName || '',
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      }).catch(err => {
        // Don't fail the whole request if audience add fails (e.g. duplicate)
        console.warn('Audience add warning:', err?.message);
      });
    }

    // 2. Send delivery email
    await resend.emails.send({
      from: 'Jessica Smith <hello@thebrandstudio.studio>',
      to: email,
      replyTo: 'jessep_00@hotmail.com',
      subject: 'Your 30 Caption Starters are here 🎉',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Free Download</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 12px rgba(26,18,8,0.08);">

        <!-- Top bar -->
        <tr><td style="background:#B8604A;height:6px;"></td></tr>

        <!-- Header -->
        <tr><td style="padding:36px 40px 28px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:#B8604A;">Brand Voice Studio</p>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;line-height:1.25;color:#1A1208;">
            Hi ${firstName} — your guide is ready.
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:0 40px 28px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a3c34;">
            Thank you for downloading <strong>30 Caption Starters for Personal Brands</strong>. 
            Inside you'll find copy/paste hooks for storytelling, promotional, and conversational posts — 
            plus the 4-part caption formula and a simple 7-day plan.
          </p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4a3c34;">
            Click the button below to access your free guide:
          </p>

          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr>
              <td style="background:#B8604A;border-radius:4px;">
                <a href="${PDF_URL}" target="_blank" 
                   style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;letter-spacing:0.02em;">
                  Download Your 30 Caption Starters →
                </a>
              </td>
            </tr>
          </table>

          <hr style="border:none;border-top:1px solid #E0D5CF;margin:0 0 24px;" />

          <p style="margin:0 0 12px;font-size:14px;font-weight:500;color:#1A1208;">What's inside:</p>
          <ul style="margin:0 0 24px;padding:0 0 0 18px;color:#4a3c34;font-size:14px;line-height:1.8;">
            <li>10 storytelling hooks that build real connection</li>
            <li>10 promotional starters that sell without sounding salesy</li>
            <li>10 conversational prompts that drive engagement</li>
            <li>The 4-part caption formula you can use for any post</li>
            <li>A simple 7-day content plan — no more blank screen</li>
          </ul>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#4a3c34;">
            If you'd like your captions <em>written for you</em> every month — in your voice, 
            consistently, without the guesswork — that's exactly what Brand Voice Studio does.
          </p>

          <table cellpadding="0" cellspacing="0" style="background:#F2E8E4;border:1px solid #E0D5CF;border-radius:5px;padding:20px;width:100%;margin-bottom:28px;">
            <tr><td>
              <p style="margin:0 0 4px;font-size:13px;font-weight:500;color:#1A1208;">Caption retainers starting at $500/month</p>
              <p style="margin:0 0 12px;font-size:13px;color:#6B5C54;line-height:1.6;">Monthly caption writing for founders, creators, and personal brands who want content that sounds like them at their best.</p>
              <a href="https://thebrandstudio.studio/#pricing" 
                 style="font-size:13px;color:#B8604A;font-weight:500;text-decoration:none;">
                View Plans at thebrandstudio.studio →
              </a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:14px;line-height:1.6;color:#4a3c34;">
            — Jessica Smith<br>
            <span style="font-size:13px;color:#6B5C54;">Brand Voice Studio</span>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F2E8E4;padding:20px 40px;border-top:1px solid #E0D5CF;">
          <p style="margin:0;font-size:11px;color:#6B5C54;line-height:1.6;text-align:center;">
            Brand Voice Studio &nbsp;·&nbsp; 
            <a href="https://thebrandstudio.studio" style="color:#B8604A;text-decoration:none;">thebrandstudio.studio</a>
            <br>
            You're receiving this because you requested the free guide. 
            No further emails unless you opt in.
          </p>
        </td></tr>

        <!-- Bottom bar -->
        <tr><td style="background:#B8604A;height:4px;"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
