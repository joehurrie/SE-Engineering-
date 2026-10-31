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
  return "https://specializedengineering.co.ke/admin/inquiries";
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

  const formattedDate = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Nairobi",
    dateStyle: "full",
    timeStyle: "medium",
  });

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
  <title>New Client Inquiry #${id ?? ""}</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-p-4 { padding: 20px 16px !important; }
      .btn-stack { display: block !important; width: 100% !important; margin-bottom: 10px !important; text-align: center !important; }
      .btn-stack-wrap { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  
  <!-- Outer Canvas -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; padding: 40px 12px;">
    <tr>
      <td align="center">

        <!-- Top Micro Tagline -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin-bottom: 12px;">
          <tr>
            <td style="font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #94a3b8; text-align: left;">
              SPECIALIZED ENGINEERING KENYA LTD. · CRM DISPATCH
            </td>
            <td style="font-size: 10px; font-weight: 600; color: #60a5fa; text-align: right; text-transform: uppercase; letter-spacing: 0.1em;">
              INQUIRY REF #${id ?? "NEW"}
            </td>
          </tr>
        </table>

        <!-- Main Card (Architectural Swiss Frame) -->
        <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #ffffff; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3); overflow: hidden;">
          
          <!-- Top Architectural Accent Bar (Specialized Blue) -->
          <tr>
            <td height="4" style="background-color: #2563eb; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Corporate Brand Masthead -->
          <tr>
            <td style="background-color: #0a0f1d; padding: 30px 36px 26px 36px; border-bottom: 1px solid #1e293b;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: #2563eb; margin-bottom: 6px;">
                      VERTICAL TRANSPORTATION SOLUTIONS
                    </div>
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase; color: #ffffff; line-height: 1.1;">
                      SPECIALIZED <span style="color: #2563eb;">ENGINEERING</span>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 5px; font-weight: 400; letter-spacing: 0.05em;">
                      Headquartered in Kilimani, Nairobi · East Africa Operations
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; background-color: #1e293b; border: 1px solid #334155; color: #60a5fa; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 6px 10px;">
                      CMS SYNCED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Bar -->
          <tr>
            <td style="background-color: #eff6ff; padding: 14px 36px; border-bottom: 1px solid #bfdbfe;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #1e40af;">
                      DEPARTMENT:
                    </span>
                    <span style="font-size: 12px; font-weight: 700; color: #2563eb; margin-left: 4px;">
                      ${department}
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; color: #64748b; font-weight: 500;">
                      ${formattedDate} (EAT)
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="mobile-p-4" style="padding: 36px 36px 28px 36px; background-color: #ffffff;">

              <!-- Header Section -->
              <div style="margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; padding: 3px 8px; margin-bottom: 10px;">
                  NEW WEBSITE INQUIRY
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; color: #0f172a; line-height: 1.2;">
                  ${cleanSubjectText}
                </h1>
                <!-- Signature Design System Blue Divider -->
                <div style="width: 60px; height: 3px; background-color: #2563eb; margin-top: 12px; margin-bottom: 16px;"></div>
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
                  A client submitted an inquiry through the Specialized Engineering portal. This record is permanently archived in the CMS and delivered to the relevant technical department below.
                </p>
              </div>

              <!-- Client Information Matrix -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-collapse: collapse; margin-bottom: 28px; font-size: 13px;">
                <thead>
                  <tr style="background-color: #0f172a;">
                    <th colspan="2" style="padding: 10px 16px; text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; color: #ffffff;">
                      Client Specifications &amp; Metadata
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
                    <td style="padding: 12px 16px; font-weight: 600; color: #64748b; width: 34%; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                      Client Full Name
                    </td>
                    <td style="padding: 12px 16px; color: #0f172a; font-weight: 700; font-size: 14px;">
                      ${name}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
                    <td style="padding: 12px 16px; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                      Email Address
                    </td>
                    <td style="padding: 12px 16px; font-size: 13px;">
                      <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
                        ${email}
                      </a>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
                    <td style="padding: 12px 16px; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                      Phone / Mobile
                    </td>
                    <td style="padding: 12px 16px; color: #0f172a; font-weight: 500;">
                      ${phone ? `<a href="tel:${phone.replace(/[^\d+]/g, "")}" style="color: #0f172a; text-decoration: none; font-weight: 600;">${phone}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
                    <td style="padding: 12px 16px; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                      Service Category
                    </td>
                    <td style="padding: 12px 16px; color: #2563eb; font-weight: 700;">
                      ${cleanSubjectText}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
                    <td style="padding: 12px 16px; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                      Target Inbox
                    </td>
                    <td style="padding: 12px 16px; color: #0f172a; font-weight: 500;">
                      ${recipientEmail}
                    </td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 16px; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                      CMS Database Ref
                    </td>
                    <td style="padding: 12px 16px; color: #0f172a; font-family: monospace; font-weight: 700;">
                      INQUIRY #${id ?? "NEW"} (Unread)
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Project Scope / Client Details Box -->
              <div style="margin-bottom: 32px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; color: #0f172a; margin-bottom: 10px;">
                  Project Scope &amp; Client Message:
                </div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; padding: 20px 24px; font-size: 14px; line-height: 1.7; color: #1e293b; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${message}</div>
              </div>

              <!-- Dual Action Buttons -->
              <div style="padding-top: 8px; border-top: 1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="btn-stack-wrap">
                      <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Specialized Engineering Inquiry - ${cleanSubjectText}`)}" class="btn-stack" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 14px 26px; border-radius: 0px; margin-right: 12px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);">
                        Reply Directly to Client &rarr;
                      </a>
                      <a href="${adminInquiriesUrl}" target="_blank" rel="noopener noreferrer" class="btn-stack" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; padding: 14px 26px; border-radius: 0px; border: 1px solid #1e293b;">
                        Open CMS Inquiries &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 12px;">
                  Direct link: <a href="${adminInquiriesUrl}" style="color: #2563eb; text-decoration: underline;">${adminInquiriesUrl}</a>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 36px; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; margin-bottom: 4px;">
                Specialized Engineering Kenya Ltd.
              </div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.6; margin-bottom: 10px;">
                Headquartered in Kilimani Business Hub, Nairobi, Kenya<br />
                Direct Calls: +254 (0)116 000100 &nbsp;|&nbsp; Operations: +254 (0)713 104907<br />
                Official Inquiries: specializedengineeringltd@gmail.com
              </div>
              <div style="font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; pt: 10px; padding-top: 10px;">
                &copy; ${new Date().getFullYear()} Specialized Engineering Kenya Ltd. All rights reserved. · ISO Certified Operations
              </div>
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
SPECIALIZED ENGINEERING KENYA LTD.
New Website Client Inquiry

Ref: #${id ?? "NEW"}
Service Category: ${cleanSubjectText}
Department: ${department}
Submission Date: ${formattedDate} (EAT)

CLIENT INFORMATION:
----------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Routed To: ${recipientEmail}

PROJECT DETAILS / MESSAGE:
----------------------------------------
${message}

ACTIONS:
----------------------------------------
Reply to Client: mailto:${email}?subject=Re:%20Specialized%20Engineering%20Inquiry%20-%20${encodeURIComponent(cleanSubjectText)}
Open CMS Inquiries: ${adminInquiriesUrl}

Specialized Engineering Kenya Ltd.
Kilimani Business Hub, Nairobi, Kenya
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
          text: `Dear ${name},\n\nThank you for reaching out to Specialized Engineering Kenya Ltd. We have received your inquiry regarding "${cleanSubjectText}".\n\nOur engineering specialists at our Kilimani headquarters are reviewing your project specifications and will be in touch shortly.\n\nBest regards,\nSpecialized Engineering Kenya Ltd.\nhttps://specializedengineering.co.ke`,
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
