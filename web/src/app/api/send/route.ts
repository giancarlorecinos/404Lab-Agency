import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Instantiated at request time so the build doesn't fail when the env var is absent
  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await request.json();
  const { name, email, message } = body as { name: string; email: string; message: string };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    // Requires noreply@404lab.agency to be verified in the Resend dashboard.
    // Until verified, swap to: from: 'onboarding@resend.dev'
    from: 'noreply@404lab.agency',
    to: 'giancarlorecinos@gmail.com',
    replyTo: email,
    subject: `[404Lab] New Inquiry from ${name}`,
    html: `
      <div style="font-family:monospace;background:#0a0a0b;color:#e2e2e2;padding:32px;border:1px solid #222;max-width:600px">
        <p style="color:#8a2be2;font-size:11px;letter-spacing:0.3em;margin:0 0 24px;text-transform:uppercase">
          404Lab Agency // Incoming Inquiry
        </p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;width:80px">Name</td>
              <td style="padding:8px 0;color:#e2e2e2">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:0.2em;text-transform:uppercase">Email</td>
              <td style="padding:8px 0;color:#e2e2e2">${email}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;border-left:2px solid #8a2be2;background:#111">
          <p style="color:#888;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px">Message</p>
          <p style="color:#ccc;line-height:1.6;margin:0;white-space:pre-wrap">${message}</p>
        </div>
        <p style="margin-top:32px;font-size:10px;color:#333;letter-spacing:0.3em;text-transform:uppercase">
          Strategic Design Unit // Powered by Ixcore® Systems
        </p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
