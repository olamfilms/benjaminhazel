/*
 * Welcome email for newsletter signups on this site. Same wording and look as
 * the general welcome on salmonberrystudios.com/signup. CASL needs the sender,
 * a mailing address and a way to unsubscribe in every email, so the footer stays.
 */

const MAILING_ADDRESS = "3142 McNaughton Ave, Port Alberni BC  V9Y 7Z7";

const paragraphs = [
  "Thanks for signing up.",
  "I’m Ben, and I make documentaries about Vancouver Island and the rest of BC, the land and the people who live from it.",
  "I’ll write when a new film is out. When we hold community screenings, you’ll hear about them here first.",
  "That won’t be often.",
];

const footer = [
  "You’re getting this because you signed up at benjaminhazel.com for: New Salmonberry films.",
  "Reply “unsubscribe” and we’ll take you off the list.",
  `Salmonberry Studios, ${MAILING_ADDRESS}`,
];

export const welcomeSubject = "You’re on the list";

export const welcomeText = [...paragraphs, "", "Ben Hazel", "Salmonberry Studios, Port Alberni", "", "--", ...footer].join("\n\n");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const p = (s: string) => `<p style="margin:0 0 18px;font-size:17px;line-height:1.55;color:#111d26;">${esc(s)}</p>`;

export const welcomeHtml = `<!doctype html><html><body style="margin:0;padding:0;background:#f7f8f4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8f4;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:Helvetica,Arial,sans-serif;">
<tr><td style="padding:0 0 24px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5d737e;">Salmonberry Studios</td></tr>
<tr><td>
${paragraphs.map(p).join("\n")}
<p style="margin:28px 0 0;font-size:17px;line-height:1.4;color:#111d26;">Ben Hazel<br><span style="color:#5d737e;">Salmonberry Studios, Port Alberni</span></p>
</td></tr>
<tr><td style="padding:40px 0 0;border-top:1px solid #d6dbc4;">
${footer.map((f) => `<p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#5d737e;">${esc(f)}</p>`).join("\n")}
</td></tr>
</table></td></tr></table></body></html>`;
