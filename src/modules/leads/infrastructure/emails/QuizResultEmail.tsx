// Plain table-based HTML for email-client compatibility — no @react-email/components
// (deprecated package, see T4 notes). Rendered by `resend`'s own bundled renderer
// (`@react-email/render`, a separate non-deprecated package it depends on internally).

const COLORS = {
  deepBlue: '#24334A',
  warmGold: '#E5B95C',
  warmCream: '#F7F1E5',
  ink: '#25282D',
  warmGray: '#8B8983',
}

export interface QuizResultEmailProps {
  greeting: string
  themeLabel: string
  tipsTitle: string
  tips: string[]
  bookTitle?: string
  bookCtaLabel?: string
  bookAmazonUrl?: string
  footer: string
}

export function QuizResultEmail({
  greeting,
  themeLabel,
  tipsTitle,
  tips,
  bookTitle,
  bookCtaLabel,
  bookAmazonUrl,
  footer,
}: QuizResultEmailProps) {
  return (
    <html>
      <body style={{ backgroundColor: COLORS.warmCream, margin: 0, padding: '24px 0' }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'Georgia, serif' }}
        >
          <tbody>
            <tr>
              <td style={{ padding: '0 24px' }}>
                <p style={{ color: COLORS.ink, fontSize: 16, lineHeight: 1.5 }}>{greeting}</p>

                <h1 style={{ color: COLORS.deepBlue, fontSize: 24, margin: '24px 0 8px' }}>
                  {themeLabel}
                </h1>

                <h2 style={{ color: COLORS.deepBlue, fontSize: 16, margin: '24px 0 8px' }}>
                  {tipsTitle}
                </h2>
                <ul style={{ color: COLORS.ink, fontSize: 15, lineHeight: 1.6, paddingLeft: 20 }}>
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>

                {bookAmazonUrl && (
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ margin: '24px 0' }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            backgroundColor: COLORS.deepBlue,
                            borderRadius: 24,
                            padding: '12px 24px',
                          }}
                        >
                          <a
                            href={bookAmazonUrl}
                            style={{
                              color: COLORS.warmCream,
                              textDecoration: 'none',
                              fontSize: 15,
                            }}
                          >
                            {bookCtaLabel ?? bookTitle}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                <p style={{ color: COLORS.warmGray, fontSize: 12, marginTop: 40 }}>{footer}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}
