import nodemailer from "nodemailer";

export interface InquiryMailPayload {
  id?: number | string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  createdAt?: Date | string;
}

export interface RoutingResult {
  recipientEmail: string;
  department: string;
}

/**
 * Resolve the destination email address and department name based on inquiry type.
 * Supports granular environment variables so specific emails can be attached for each category:
 * - INQUIRY_EMAIL_SPARE_PARTS
 * - INQUIRY_EMAIL_MODERNIZATION
 * - INQUIRY_EMAIL_HOME_LIFTS
 * - INQUIRY_EMAIL_PROJECTS
 * - INQUIRY_EMAIL_CUSTOMIZATION
 * - INQUIRY_EMAIL_GENERAL
 * - INQUIRY_EMAIL_DEFAULT (fallback for all)
 * - or any dynamic INQUIRY_EMAIL_<NORMALIZED_SUBJECT>
 */
export function getRecipientForInquiry(subject?: string | null): RoutingResult {
  const defaultEmail =
    process.env.INQUIRY_EMAIL_DEFAULT ||
    process.env.ADMIN_EMAIL ||
    "specializedengineeringltd@gmail.com";

  if (!subject) {
    return {
      recipientEmail: process.env.INQUIRY_EMAIL_GENERAL || defaultEmail,
      department: "Client Communications & General Inquiries",
    };
  }

  const cleanSubject = subject.trim();
  const normalizedKey = cleanSubject
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  // 1. Direct environment variable override for exact subject (e.g. INQUIRY_EMAIL_HOME_LIFT)
  const directEnvKey = `INQUIRY_EMAIL_${normalizedKey}`;
  if (process.env[directEnvKey]?.trim()) {
    return {
      recipientEmail: process.env[directEnvKey]!.trim(),
      department: cleanSubject,
    };
  }

  const lower = cleanSubject.toLowerCase();

  // 2. Spare Parts Supply
  if (lower.includes("spare") || lower.includes("part")) {
    return {
      recipientEmail:
        process.env.INQUIRY_EMAIL_SPARE_PARTS?.trim() || defaultEmail,
      department: "OEM Spare Parts Supply Division",
    };
  }

  // 3. Lift Modernization & Overhaul
  if (lower.includes("modernization") || lower.includes("overhaul") || lower.includes("upgrade")) {
    return {
      recipientEmail:
        process.env.INQUIRY_EMAIL_MODERNIZATION?.trim() || defaultEmail,
      department: "Lift Modernization & Overhaul Division",
    };
  }

  // 4. Residential / Home / Villa Lifts
  if (lower.includes("home lift") || lower.includes("villa")) {
    return {
      recipientEmail:
        process.env.INQUIRY_EMAIL_HOME_LIFTS?.trim() ||
        process.env.INQUIRY_EMAIL_PROJECTS?.trim() ||
        defaultEmail,
      department: "Residential & Villa Elevators",
    };
  }

  // 5. Commercial Elevators, Escalators & Heavy Cargo
  if (
    lower.includes("passenger") ||
    lower.includes("panoramic") ||
    lower.includes("hospital") ||
    lower.includes("escalator") ||
    lower.includes("freight") ||
    lower.includes("car elevator") ||
    lower.includes("dumbwaiter") ||
    lower.includes("platform") ||
    lower.includes("commercial")
  ) {
    return {
      recipientEmail:
        process.env.INQUIRY_EMAIL_PROJECTS?.trim() || defaultEmail,
      department: "Commercial & Vertical Transport Engineering",
    };
  }

  // 6. Bespoke Solution Customization
  if (lower.includes("custom") || lower.includes("bespoke") || lower.includes("engineering")) {
    return {
      recipientEmail:
        process.env.INQUIRY_EMAIL_CUSTOMIZATION?.trim() ||
        process.env.INQUIRY_EMAIL_PROJECTS?.trim() ||
        defaultEmail,
      department: "Bespoke Solutions & Engineering Design",
    };
  }

  // 7. General inquiries or Website Form
  return {
    recipientEmail:
      process.env.INQUIRY_EMAIL_GENERAL?.trim() || defaultEmail,
    department: "Client Communications & General Inquiries",
  };
}

/**
 * Resolve the public production URL for CMS admin inquiries.
 * Strips out localhost so emails always lead to the live deployed admin portal.
 */
function resolveAdminInquiriesUrl(): string {
  const explicitAdminUrl = process.env.ADMIN_INQUIRIES_URL?.trim();
  if (explicitAdminUrl) {
    return explicitAdminUrl;
  }

  const explicitBase =
    process.env.ADMIN_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim();

  if (explicitBase && !explicitBase.includes("localhost") && !explicitBase.includes("127.0.0.1")) {
    return `${explicitBase.replace(/\/$/, "")}/admin/inquiries`;
  }

  if (
    process.env.NEXTAUTH_URL &&
    !process.env.NEXTAUTH_URL.includes("localhost") &&
    !process.env.NEXTAUTH_URL.includes("127.0.0.1")
  ) {
    return `${process.env.NEXTAUTH_URL.replace(/\/$/, "")}/admin/inquiries`;
  }

  // Default to live production domain
  return "https://www.specializedengineeringltd.co.ke/admin/inquiries";
}

/**
 * Create a reusable Nodemailer transporter instance.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || process.env.ADMIN_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Dispatch notification email to internal team and receipt to client.
 */
export async function sendInquiryNotificationEmail(payload: InquiryMailPayload) {
  const { id, name, email, phone, subject, message } = payload;
  const { recipientEmail, department } = getRecipientForInquiry(subject);

  const adminInquiriesUrl = resolveAdminInquiriesUrl();

  const senderUser =
    process.env.SMTP_USER ||
    process.env.ADMIN_EMAIL ||
    "specializedengineeringltd@gmail.com";

  const senderFrom =
    process.env.SMTP_FROM ||
    `"Specialized Engineering Kenya Ltd." <${senderUser}>`;

  const transporter = createTransporter();

  if (!transporter) {
    console.warn(
      `[Nodemailer] SMTP not configured in .env (missing SMTP_USER or SMTP_PASS). Inquiry #${id ?? "new"} from "${name}" would be routed to <${recipientEmail}> [${department}].`
    );
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED",
      routedTo: recipientEmail,
      department,
      adminInquiriesUrl,
    };
  }

  const cleanSubjectText = subject?.trim() || "General Vertical Transport Inquiry";

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry from ${name}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; }
    table { border-collapse: collapse; }
    @media only screen and (max-width: 600px) {
      .outer-table { padding: 16px 8px !important; }
      .card-table { width: 100% !important; max-width: 100% !important; }
      .card-header { padding: 20px 16px !important; }
      .card-body { padding: 24px 16px !important; }
      .btn-row { display: block !important; width: 100% !important; }
      .btn-cell { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  
  <table role="presentation" class="outer-table" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 36px 12px; width: 100%;">
    <tr>
      <td align="center">
        
        <!-- Main Minimal Card -->
        <table role="presentation" class="card-table" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: 4px solid #2563eb;">
          
          <!-- Brand Header -->
          <tr>
            <td class="card-header" style="padding: 24px 32px 18px 32px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <div style="font-size: 15px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #0f172a;">
                      SPECIALIZED <span style="color: #2563eb;">ENGINEERING</span>
                    </div>
                    <div style="font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px;">
                      Kenya
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; background-color: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 2px;">
                      ${cleanSubjectText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td class="card-body" style="padding: 32px;">
              
              <h1 style="margin: 0 0 20px 0; font-size: 19px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                New Inquiry from ${name}
              </h1>

              <!-- Relevant Info Only -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 70px; font-weight: 600;">Name:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Email:</td>
                  <td style="padding: 6px 0; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Phone:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 500;">
                    ${phone ? `<a href="tel:${phone.replace(/[^\d+]/g, "")}" style="color: #0f172a; text-decoration: none; font-weight: 500;">${phone}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Service:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${cleanSubjectText}</td>
                </tr>
              </table>

              <!-- Message -->
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 8px;">
                Message
              </div>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; margin-bottom: 28px;">${message}</div>

              <!-- Actions: Reply (Primary) and View in Admin (Secondary) inside message card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <tr class="btn-row">
                  <!-- Primary Action: Reply to Client -->
                  <td class="btn-cell" style="padding: 0 6px 0 0; vertical-align: middle;">
                    <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Specialized Engineering - ${cleanSubjectText}`)}" class="btn" style="display: block; box-sizing: border-box; width: 100%; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 13px 18px; text-align: center; border: 1px solid #2563eb; border-radius: 0px;">
                      Reply to Client &rarr;
                    </a>
                  </td>
                  <!-- Secondary Action: View in Admin Portal -->
                  <td class="btn-cell" style="padding: 0 0 0 6px; vertical-align: middle;">
                    <a href="${adminInquiriesUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="display: block; box-sizing: border-box; width: 100%; background-color: #ffffff; color: #0f172a; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 13px 18px; text-align: center; border: 1px solid #cbd5e1; border-radius: 0px;">
                      View in Admin Portal
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td style="padding: 18px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
              Specialized Engineering Kenya Ltd. &middot; Kilimani, Nairobi
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  const emailText = `
SPECIALIZED ENGINEERING KENYA
New Inquiry: ${cleanSubjectText}

From: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Service: ${cleanSubjectText}

Message:
${message}

ACTIONS:
Reply to Client: mailto:${email}?subject=${encodeURIComponent(`Re: Specialized Engineering - ${cleanSubjectText}`)}
View in Admin Portal: ${adminInquiriesUrl}
`;

  try {
    const info = await transporter.sendMail({
      from: senderFrom,
      to: recipientEmail,
      replyTo: email,
      subject: `[SE Inquiry #${id ?? "NEW"}] ${cleanSubjectText} - ${name}`,
      text: emailText,
      html: emailHtml,
    });

    console.log(
      `[Nodemailer] Inquiry #${id ?? "new"} email dispatched to ${recipientEmail} via SMTP. MessageId: ${info.messageId}`
    );

    // Optional confirmation to client
    if (process.env.SEND_CLIENT_CONFIRMATION_EMAIL === "true") {
      try {
        await transporter.sendMail({
          from: senderFrom,
          to: email,
          subject: `We have received your inquiry - Specialized Engineering Kenya Ltd.`,
          text: `Dear ${name},\n\nThank you for reaching out to Specialized Engineering Kenya Ltd. We have received your inquiry regarding "${cleanSubjectText}".\n\nOur engineering specialists at our Kilimani headquarters are reviewing your project specifications and will be in touch shortly.\n\nBest regards,\nSpecialized Engineering Kenya Ltd.\nhttps://www.specializedengineeringltd.co.ke`,
        });
      } catch (clientErr) {
        console.warn("[Nodemailer] Client confirmation email could not be sent:", clientErr);
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      routedTo: recipientEmail,
      department,
      adminInquiriesUrl,
    };
  } catch (error) {
    console.error("[Nodemailer] Failed to send inquiry email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to dispatch email",
      routedTo: recipientEmail,
      department,
      adminInquiriesUrl,
    };
  }
}
