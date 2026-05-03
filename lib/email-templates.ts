type EmailTone = 'default' | 'subtle' | 'brand' | 'alert';

type EmailLayoutOptions = {
  title: string;
  subtitle?: string;
  intro?: string[];
  sections?: string[];
  footerLines?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

type EmailSectionOptions = {
  title: string;
  body: string;
  tone?: EmailTone;
};

type EmailRow = {
  label: string;
  value: string;
  accent?: boolean;
};

type EmailHighlightTone = 'brand' | 'neutral' | 'alert';

type EmailHighlightOptions = {
  eyebrow?: string;
  title: string;
  value: string;
  detail?: string;
  tone?: EmailHighlightTone;
};

const DEFAULT_SITE_URL = 'https://www.drivepointexchange.com';

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || DEFAULT_SITE_URL;
}

function sanitizeHref(href: string): string {
  try {
    const parsedUrl = new URL(href);

    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return parsedUrl.toString();
    }
  } catch {
    return EMAIL_BRAND.siteUrl;
  }

  return EMAIL_BRAND.siteUrl;
}

export const EMAIL_BRAND = {
  companyName: 'Drive Point Exchange.',
  siteUrl: getSiteUrl(),
  logoUrl: `${getSiteUrl()}/logo-no-bg-inverted.webp`,
  supportPhone: '(888) 351-0782',
  supportPhoneHref: 'tel:+18883510782',
  supportEmail: 'support@drivepointexchange.com',
  supportEmailHref: 'mailto:support@drivepointexchange.com',
  colors: {
    slate950: '#020617',
    slate900: '#0f172a',
    slate800: '#1e293b',
    slate300: '#cbd5e1',
    green: '#2DB843',
    greenLight: '#78df92',
    greenSoft: '#e8f7ec',
    slate: '#64748b',
    bg: '#f8fafc',
    bgAlt: '#eef5f0',
    border: '#dbe7df',
    text: '#0f172a',
    textSoft: '#334155',
  },
} as const;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getToneClass(tone: EmailTone): string {
  if (tone === 'subtle') return 'section section-subtle';
  if (tone === 'brand') return 'section section-brand';
  if (tone === 'alert') return 'section section-alert';

  return 'section';
}

function getHighlightClass(tone: EmailHighlightTone): string {
  if (tone === 'neutral') return 'highlight highlight-neutral';
  if (tone === 'alert') return 'highlight highlight-alert';

  return 'highlight highlight-brand';
}

export function renderEmailLayout({
  title,
  subtitle,
  intro = [],
  sections = [],
  footerLines = [],
  ctaLabel,
  ctaHref,
}: EmailLayoutOptions): string {
  const safeCtaHref = ctaHref ? sanitizeHref(ctaHref) : '';
  const introMarkup = intro
    .filter(Boolean)
    .map((paragraph) => `<p class="copy">${escapeHtml(paragraph)}</p>`)
    .join('');

  const footerMarkup = footerLines
    .filter(Boolean)
    .map((line) => `<p class="footer-copy">${escapeHtml(line)}</p>`)
    .join('');

  const ctaMarkup =
    ctaLabel && safeCtaHref
      ? `
        <div class="cta-wrap">
          <a class="button" href="${safeCtaHref}">${escapeHtml(ctaLabel)}</a>
        </div>
      `
      : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      background: ${EMAIL_BRAND.colors.bg};
      color: ${EMAIL_BRAND.colors.text};
      font-family: Arial, Helvetica, sans-serif;
    }

    a {
      color: ${EMAIL_BRAND.colors.green};
      text-decoration: none;
    }

    .shell {
      padding: 24px 12px;
      background: linear-gradient(180deg, ${EMAIL_BRAND.colors.bg} 0%, ${EMAIL_BRAND.colors.bgAlt} 100%);
    }

    .card {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid ${EMAIL_BRAND.colors.border};
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(15, 23, 42, 0.12);
    }

    .hero {
      padding: 32px 28px;
      text-align: center;
      background: linear-gradient(135deg, ${EMAIL_BRAND.colors.slate950} 0%, ${EMAIL_BRAND.colors.slate900} 100%);
    }

    .logo-wrap {
      display: inline-block;
      margin: 0 auto 22px;
    }

    .logo {
      display: block;
      width: 100%;
      max-width: 220px;
      height: auto;
    }

    .title {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;
    }

    .subtitle {
      margin: 12px auto 0;
      max-width: 520px;
      color: ${EMAIL_BRAND.colors.slate300};
      font-size: 15px;
      line-height: 1.6;
    }

    .content {
      padding: 28px;
    }

    .copy {
      margin: 0 0 16px;
      color: ${EMAIL_BRAND.colors.textSoft};
      font-size: 15px;
      line-height: 1.7;
    }

    .section {
      margin-top: 20px;
      padding: 22px;
      border: 1px solid ${EMAIL_BRAND.colors.border};
      border-radius: 20px;
      background: #ffffff;
    }

    .section-subtle {
      background: #f8fafc;
    }

    .section-brand {
      background: linear-gradient(180deg, rgba(45, 184, 67, 0.05) 0%, rgba(45, 184, 67, 0.10) 100%);
      border-color: rgba(45, 184, 67, 0.30);
    }

    .section-alert {
      background: rgba(220, 38, 38, 0.04);
      border-color: rgba(220, 38, 38, 0.18);
    }

    .section-title {
      margin: 0 0 16px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${EMAIL_BRAND.colors.green};
      color: ${EMAIL_BRAND.colors.text};
      font-size: 18px;
      font-weight: 700;
      line-height: 1.4;
    }

    .section-copy {
      margin-bottom: 16px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .label,
    .value {
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
      line-height: 1.5;
      vertical-align: top;
    }

    .label {
      width: 42%;
      color: ${EMAIL_BRAND.colors.slate};
    }

    .value {
      color: ${EMAIL_BRAND.colors.text};
      font-weight: 600;
      text-align: right;
    }

    .value-accent {
      color: ${EMAIL_BRAND.colors.green};
    }

    .message {
      padding: 16px;
      border: 1px dashed #cbd5e1;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.92);
      color: ${EMAIL_BRAND.colors.textSoft};
      font-size: 14px;
      line-height: 1.7;
      white-space: normal;
    }

    .list {
      margin: 0;
      padding-left: 20px;
      color: ${EMAIL_BRAND.colors.textSoft};
      font-size: 14px;
      line-height: 1.8;
    }

    .list li {
      margin-bottom: 8px;
    }

    .highlight {
      margin-top: 20px;
      padding: 24px 22px;
      border-radius: 22px;
      text-align: center;
    }

    .highlight-brand {
      background: linear-gradient(135deg, ${EMAIL_BRAND.colors.slate950} 0%, ${EMAIL_BRAND.colors.slate800} 100%);
      color: #ffffff;
      box-shadow: 0 18px 36px rgba(15, 23, 42, 0.22);
    }

    .highlight-neutral {
      background: ${EMAIL_BRAND.colors.greenSoft};
      border: 1px solid rgba(45, 184, 67, 0.25);
      color: ${EMAIL_BRAND.colors.text};
    }

    .highlight-alert {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: ${EMAIL_BRAND.colors.text};
    }

    .highlight-eyebrow {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.78;
    }

    .highlight-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.4;
    }

    .highlight-value {
      margin: 10px 0 0;
      font-size: 34px;
      font-weight: 700;
      line-height: 1.1;
    }

    .highlight-detail {
      margin: 10px 0 0;
      font-size: 14px;
      line-height: 1.6;
      opacity: 0.86;
    }

    .cta-wrap {
      margin-top: 24px;
      text-align: center;
    }

    .button {
      display: inline-block;
      padding: 14px 20px;
      border-radius: 999px;
      background: ${EMAIL_BRAND.colors.green};
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .footer {
      margin-top: 28px;
      padding-top: 22px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-copy,
    .footer-meta {
      margin: 0 0 10px;
      color: ${EMAIL_BRAND.colors.slate};
      font-size: 12px;
      line-height: 1.7;
    }

    .footer-meta a {
      color: ${EMAIL_BRAND.colors.green};
    }

    @media only screen and (max-width: 640px) {
      .hero,
      .content {
        padding: 22px 18px;
      }

      .title {
        font-size: 24px;
      }

      .value,
      .label {
        display: block;
        width: 100%;
        padding: 8px 0;
        text-align: left;
      }

      .label {
        border-bottom: 0;
        padding-bottom: 0;
      }

      .value {
        padding-top: 2px;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <div class="hero">
        <div class="logo-wrap">
          <img class="logo" src="${EMAIL_BRAND.logoUrl}" alt="${EMAIL_BRAND.companyName} logo">
        </div>
        <h1 class="title">${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
      </div>

      <div class="content">
        ${introMarkup}
        ${sections.join('')}
        ${ctaMarkup}

        <div class="footer">
          ${footerMarkup}
          <p class="footer-meta">
            ${EMAIL_BRAND.companyName}<br>
            <a href="${EMAIL_BRAND.supportPhoneHref}">${EMAIL_BRAND.supportPhone}</a>
            &nbsp;|&nbsp;
            <a href="${EMAIL_BRAND.supportEmailHref}">${EMAIL_BRAND.supportEmail}</a>
            &nbsp;|&nbsp;
            <a href="${EMAIL_BRAND.siteUrl}">${EMAIL_BRAND.siteUrl.replace(/^https?:\/\//, '')}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function renderEmailSection({
  title,
  body,
  tone = 'default',
}: EmailSectionOptions): string {
  return `
    <div class="${getToneClass(tone)}">
      <h2 class="section-title">${escapeHtml(title)}</h2>
      ${body}
    </div>
  `;
}

export function renderEmailRows(rows: EmailRow[]): string {
  const markup = rows
    .filter((row) => row.value)
    .map(
      (row) => `
        <tr>
          <td class="label">${escapeHtml(row.label)}</td>
          <td class="value${row.accent ? ' value-accent' : ''}">${escapeHtml(row.value)}</td>
        </tr>
      `
    )
    .join('');

  return `<table class="table" role="presentation">${markup}</table>`;
}

export function renderEmailList(items: string[]): string {
  const markup = items
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `<ul class="list">${markup}</ul>`;
}

export function renderEmailMessage(message: string): string {
  return `<div class="message">${escapeHtml(message).replace(/\n/g, '<br>')}</div>`;
}

export function renderEmailHighlight({
  eyebrow,
  title,
  value,
  detail,
  tone = 'brand',
}: EmailHighlightOptions): string {
  return `
    <div class="${getHighlightClass(tone)}">
      ${eyebrow ? `<p class="highlight-eyebrow">${escapeHtml(eyebrow)}</p>` : ''}
      <p class="highlight-title">${escapeHtml(title)}</p>
      <p class="highlight-value">${escapeHtml(value)}</p>
      ${detail ? `<p class="highlight-detail">${escapeHtml(detail)}</p>` : ''}
    </div>
  `;
}

export function renderEmailContactCard(title: string, description: string): string {
  return renderEmailSection({
    title,
    tone: 'brand',
    body: `
      <p class="copy section-copy">${escapeHtml(description)}</p>
      <table class="table" role="presentation">
        <tr>
          <td class="label">Call</td>
          <td class="value"><a href="${EMAIL_BRAND.supportPhoneHref}">${EMAIL_BRAND.supportPhone}</a></td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value"><a href="${EMAIL_BRAND.supportEmailHref}">${EMAIL_BRAND.supportEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Visit</td>
          <td class="value"><a href="${EMAIL_BRAND.siteUrl}">${EMAIL_BRAND.siteUrl.replace(/^https?:\/\//, '')}</a></td>
        </tr>
      </table>
    `,
  });
}