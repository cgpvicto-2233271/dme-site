const HTML = `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Session confirmee — DME</title>
  <!--[if mso]>
  <style>table,td,div,p,a{font-family:Arial,sans-serif !important;}</style>
  <![endif]-->
  <style>
    body{margin:0;padding:0;width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table{border-collapse:collapse;}
    img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
    a{text-decoration:none;}
    .mono{font-family:'SFMono-Regular',ui-monospace,Menlo,Consolas,'Liberation Mono',monospace;}
    @media only screen and (max-width:600px){
      .container{width:100% !important;}
      .px{padding-left:24px !important;padding-right:24px !important;}
      .stack{display:block !important;width:100% !important;}
      .stack-b{border-bottom:1px solid #20202a !important;border-right:0 !important;}
      .h1{font-size:38px !important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#070709;" bgcolor="#070709">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#070709;opacity:0;">
    Creneau verrouille. Tous les details de ta session de coaching DME a l'interieur.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#070709;" bgcolor="#070709">
    <tr>
      <td align="center" style="padding:34px 12px;" bgcolor="#070709">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#0c0c0f;border:1px solid #20202a;" bgcolor="#0c0c0f">
          <!-- HEADER -->
          <tr>
            <td class="px" style="padding:24px 34px;border-bottom:1px solid #20202a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:800;letter-spacing:2px;color:#ffffff;">DEATHMARK</span><span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:800;letter-spacing:2px;color:#ff3344;"> E-SPORTS</span>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span class="mono" style="font-size:10px;letter-spacing:1px;color:#5c5c66;">QC / NA — EST. 2025</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- EYEBROW + HEADLINE -->
          <tr><td class="px" style="padding:42px 34px 0;">
            <span class="mono" style="font-size:11px;letter-spacing:2px;color:#ff3344;text-transform:uppercase;">// Session confirmee</span>
          </td></tr>
          <tr><td class="px" style="padding:18px 34px 0;">
            <h1 class="h1" style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:46px;line-height:0.98;font-weight:800;color:#ffffff;letter-spacing:-1.5px;text-transform:uppercase;">
              Creneau<br>verrouille.
            </h1>
          </td></tr>
          <tr><td class="px" style="padding:22px 34px 0;">
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.6;color:#9a9aa4;max-width:430px;">
              {{elevePseudo}}, tu passes {{duration}} avec un coach Challenger. Viens avec un plan, repars avec des reponses. Pas de talent sans constance.
            </p>
          </td></tr>
          <!-- BLOC DETAILS -->
          <tr><td class="px" style="padding:36px 34px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="3" style="width:3px;background-color:#ff3344;font-size:0;line-height:0;">&nbsp;</td>
                <td style="padding-left:20px;">
                  <span class="mono" style="font-size:10px;letter-spacing:2px;color:#5c5c66;text-transform:uppercase;">Detail de la session</span>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid #20202a;">
                    <tr><td style="padding:16px 0 14px;">
                      <div class="mono" style="font-size:10px;letter-spacing:1px;color:#6a6a74;text-transform:uppercase;">Coach</div>
                      <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:19px;font-weight:800;color:#ffffff;padding-top:6px;letter-spacing:-0.3px;">{{coachName}}</div>
                    </td></tr>
                  </table>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #20202a;">
                    <tr>
                      <td class="stack stack-b" width="50%" style="padding:16px 0 14px;border-right:1px solid #20202a;vertical-align:top;">
                        <div class="mono" style="font-size:10px;letter-spacing:1px;color:#6a6a74;text-transform:uppercase;">Date &amp; heure</div>
                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:700;color:#ffffff;padding-top:6px;">{{date}}</div>
                      </td>
                      <td class="stack" width="50%" style="padding:16px 0 14px 22px;vertical-align:top;">
                        <div class="mono" style="font-size:10px;letter-spacing:1px;color:#6a6a74;text-transform:uppercase;">Duree</div>
                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:700;color:#ffffff;padding-top:6px;">{{duration}}</div>
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #20202a;">
                    <tr>
                      <td class="stack stack-b" width="50%" style="padding:16px 0 14px;border-right:1px solid #20202a;vertical-align:top;">
                        <div class="mono" style="font-size:10px;letter-spacing:1px;color:#6a6a74;text-transform:uppercase;">Tarif</div>
                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:700;color:#ffffff;padding-top:6px;">{{total}}</div>
                      </td>
                      <td class="stack" width="50%" style="padding:16px 0 14px 22px;vertical-align:top;">
                        <div class="mono" style="font-size:10px;letter-spacing:1px;color:#6a6a74;text-transform:uppercase;">Discord</div>
                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:700;color:#ffffff;padding-top:6px;">{{discord}}</div>
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #20202a;">
                    <tr><td style="padding:16px 0 4px;">
                      <div class="mono" style="font-size:10px;letter-spacing:1px;color:#6a6a74;text-transform:uppercase;">Objectif</div>
                      <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.55;color:#b6b6c0;padding-top:6px;">{{objective}}</div>
                    </td></tr>
                  </table>
                  <div class="mono" style="font-size:10px;letter-spacing:1px;color:#4a4a54;text-transform:uppercase;padding-top:14px;">Ref. reservation — {{bookingId}}</div>
                </td>
              </tr>
            </table>
          </td></tr>
          <!-- DISCORD CTA -->
          <tr><td class="px" style="padding:36px 34px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="3" style="width:3px;background-color:#ff3344;font-size:0;line-height:0;">&nbsp;</td>
                <td style="padding-left:20px;">
                  <span class="mono" style="font-size:10px;letter-spacing:2px;color:#5c5c66;text-transform:uppercase;">La session se passe sur Discord</span>
                  <p style="margin:12px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.6;color:#c4c4ce;max-width:420px;">
                    Assure-toi d'etre sur le serveur DME avant l'heure. Ton coach te rejoint dans le salon vocal au creneau prevu.
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                    <tr><td style="background-color:#ff3344;">
                      <a href="https://discord.gg/deathmarkesports" target="_blank" style="display:inline-block;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:800;letter-spacing:1px;color:#ffffff;text-transform:uppercase;padding:15px 32px;">
                        Rejoindre le Discord DME
                      </a>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td></tr>
          <!-- A PREPARER -->
          <tr><td class="px" style="padding:38px 34px 0;">
            <span class="mono" style="font-size:10px;letter-spacing:2px;color:#5c5c66;text-transform:uppercase;">Avant la session</span>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
              <tr>
                <td width="40" style="vertical-align:top;padding-bottom:16px;"><span class="mono" style="font-size:13px;font-weight:700;color:#ff3344;">01</span></td>
                <td style="vertical-align:top;padding-bottom:16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.55;color:#b6b6c0;">Ton <strong style="color:#ffffff;">op.gg</strong> a jour et 1 a 2 VODs de games recentes.</td>
              </tr>
              <tr>
                <td width="40" style="vertical-align:top;padding-bottom:16px;"><span class="mono" style="font-size:13px;font-weight:700;color:#ff3344;">02</span></td>
                <td style="vertical-align:top;padding-bottom:16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.55;color:#b6b6c0;">Une question precise, un point de jeu que tu veux debloquer.</td>
              </tr>
              <tr>
                <td width="40" style="vertical-align:top;"><span class="mono" style="font-size:13px;font-weight:700;color:#ff3344;">03</span></td>
                <td style="vertical-align:top;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.55;color:#b6b6c0;">Dispo 5 min avant. Coachable, fiable, ponctuel.</td>
              </tr>
            </table>
          </td></tr>
          <!-- ANNULATION -->
          <tr><td class="px" style="padding:34px 34px 0;">
            <div style="border-top:1px solid #20202a;padding-top:18px;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.6;color:#7a7a84;">
                Annulation ou probleme&nbsp;? Ecris a <strong style="color:#b6b6c0;">coussinhoo</strong> sur le Discord, idealement <strong style="color:#b6b6c0;">24h a l'avance</strong>.
              </p>
            </div>
          </td></tr>
          <!-- FOOTER -->
          <tr><td class="px" style="padding:30px 34px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #20202a;">
              <tr><td style="padding-top:20px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:14px;"><a href="https://discord.gg/deathmarkesports" class="mono" style="font-size:11px;letter-spacing:1px;color:#8a8a94;text-transform:uppercase;">Discord</a></td>
                    <td style="padding-right:14px;"><a href="https://x.com/DeathMarkEsport" class="mono" style="font-size:11px;letter-spacing:1px;color:#8a8a94;text-transform:uppercase;">X</a></td>
                    <td style="padding-right:14px;"><a href="https://www.twitch.tv/deathmarkesport" class="mono" style="font-size:11px;letter-spacing:1px;color:#8a8a94;text-transform:uppercase;">Twitch</a></td>
                    <td style="padding-right:14px;"><a href="https://www.instagram.com/deathmarkesports/" class="mono" style="font-size:11px;letter-spacing:1px;color:#8a8a94;text-transform:uppercase;">Instagram</a></td>
                    <td><a href="https://www.youtube.com/@DeathMarkEsport" class="mono" style="font-size:11px;letter-spacing:1px;color:#8a8a94;text-transform:uppercase;">YouTube</a></td>
                  </tr>
                </table>
              </td></tr>
              <tr><td style="padding-top:18px;">
                <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;line-height:1.6;color:#54545e;">
                  DME — Esport quebecois. Ambition nord-americaine. Fait pour la pression.
                </p>
                <p style="margin:10px 0 0;" class="mono"><span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#ff3344;">#DMEONTOP</span></p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

type EmailData = {
  elevePseudo: string;
  coachName: string;
  date: string;
  duration: string;
  total: string;
  discord: string;
  objective: string;
  bookingId: string;
};

export function buildEmailFR(d: EmailData): string {
  return HTML
    .replace(/\{\{elevePseudo\}\}/g, d.elevePseudo)
    .replace(/\{\{coachName\}\}/g, d.coachName)
    .replace(/\{\{date\}\}/g, d.date)
    .replace(/\{\{duration\}\}/g, d.duration)
    .replace(/\{\{total\}\}/g, d.total)
    .replace(/\{\{discord\}\}/g, d.discord)
    .replace(/\{\{objective\}\}/g, d.objective)
    .replace(/\{\{bookingId\}\}/g, d.bookingId);
}
