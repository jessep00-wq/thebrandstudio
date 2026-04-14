# thebrandstudio-api

Vercel serverless API for Brand Voice Studio.

## Endpoints

### POST /api/subscribe

Accepts a lead magnet opt-in. Adds the contact to Resend Audiences and sends a PDF delivery email.

**Request body:**
```json
{
  "firstName": "Jessica",
  "lastName": "Smith",
  "email": "jessica@example.com"
}
```

## Environment Variables (set in Vercel dashboard)

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (from resend.com dashboard) |
| `RESEND_AUDIENCE_ID` | The Audience ID in Resend for BVS subscribers |
| `PDF_DOWNLOAD_URL` | Public URL of the PDF: `https://thebrandstudio.studio/30-caption-starters.pdf` |
| `ALLOWED_ORIGIN` | `https://thebrandstudio.studio` |

## Deploy

1. Push this repo to GitHub
2. Import project in Vercel (vercel.com/new)
3. Set the 4 environment variables above
4. Deploy — the API will be live at `https://<your-project>.vercel.app/api/subscribe`
5. Update the `fetch()` URL in `/free/index.html` on the main site to match your Vercel domain
