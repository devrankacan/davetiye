import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface MailPayload {
  name: string;
  surname: string;
  note: string;
  type: "fotoğraf" | "video";
  fileCount: number;
  uploadedAt: string;
}

export async function sendUploadNotification(p: MailPayload) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

  const emoji = p.type === "fotoğraf" ? "🖼️" : "🎬";
  const dateStr = new Date(p.uploadedAt).toLocaleString("tr-TR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  await transporter.sendMail({
    from: `"Merve & Devran 💍" <${process.env.GMAIL_USER}>`,
    to: "devrankacan9@gmail.com",
    subject: `${emoji} ${p.name} ${p.surname} ${p.fileCount} ${p.type} yükledi`,
    html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4ede0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4ede0;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(45,74,45,0.10);">

        <!-- Başlık -->
        <tr>
          <td style="background:linear-gradient(135deg,#2d4a2d,#4a6b4a);padding:28px 32px;text-align:center;">
            <p style="color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 8px;">Nişan Daveti</p>
            <p style="color:#d4aa50;font-size:28px;margin:0;font-style:italic;">Merve &amp; Devran</p>
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:6px 0 0;">10 · 10 · 2026</p>
          </td>
        </tr>

        <!-- İçerik -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="color:#2d4a2d;font-size:22px;margin:0 0 4px;">${emoji} Yeni ${p.type}!</p>
            <p style="color:#7a9b7a;font-size:14px;margin:0 0 24px;">${dateStr}</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #ede5d5;">
              <tr>
                <td style="padding:14px 18px;background:#f8f3eb;color:#7a5c3a;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;width:100px;">Misafir</td>
                <td style="padding:14px 18px;color:#2d4a2d;font-size:15px;font-weight:600;">${p.name} ${p.surname}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;background:#f8f3eb;color:#7a5c3a;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;border-top:1px solid #ede5d5;">Dosyalar</td>
                <td style="padding:14px 18px;color:#2d4a2d;font-size:15px;border-top:1px solid #ede5d5;">${p.fileCount} ${p.type}</td>
              </tr>
              ${p.note ? `
              <tr>
                <td style="padding:14px 18px;background:#f8f3eb;color:#7a5c3a;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;border-top:1px solid #ede5d5;">Not</td>
                <td style="padding:14px 18px;color:#4a6b4a;font-size:14px;font-style:italic;border-top:1px solid #ede5d5;">"${p.note}"</td>
              </tr>` : ""}
            </table>

            <div style="margin-top:24px;text-align:center;">
              <a href="https://davetiye.taslak.site/admin" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#b8953a,#d4aa50);color:#fff;text-decoration:none;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:0.1em;">Admin Panelini Aç →</a>
            </div>
          </td>
        </tr>

        <!-- Alt -->
        <tr>
          <td style="padding:16px 32px;text-align:center;border-top:1px solid #ede5d5;">
            <p style="color:#b0a090;font-size:11px;margin:0;">Bu e-posta davetiye.taslak.site tarafından gönderildi.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
