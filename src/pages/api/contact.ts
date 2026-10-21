import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const bodyText = await request.text();
    if (!bodyText) {
      return new Response(JSON.stringify({ error: 'Empty request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { name, email, message, phone } = JSON.parse(bodyText);

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All required fields must be filled' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({ error: 'Email address is not valid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const RESEND_API_KEY = 're_4kt48oeP_BbzKvLDPdSBYuh9ZjQWEDtGZ';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const emailHtml = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Sent from laravelseo.com</small></p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'contact@laravelseo.com',
        to: 'info@laravelseo.com',
        subject: `New message from laravelseo.com – ${name}`,
        html: emailHtml
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend error:', errText);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'An internal error occurred. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
