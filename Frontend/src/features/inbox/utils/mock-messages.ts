import type { EmailMessage } from '../api/inbox-types'

const mockTemplates = [
  {
    from: 'security@github.com',
    subject: '[GitHub] Please verify your device login request',
    htmlBody: `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #24292e;">Verify your device</h2>
        <p>A sign-in request was detected on your account. If this was you, please enter the security verification code below to authorize your session:</p>
        <div style="background: #f6f8fa; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 20px 0; border: 1px solid #e1e4e8; color: #0969da;">
          492 810
        </div>
        <p style="font-size: 12px; color: #586069;">This code expires in 10 minutes. If you did not initiate this login, please change your password immediately.</p>
      </div>
    `,
    textBody: 'Verify your device. Verification code: 492 810. Expiry: 10 minutes.',
    attachmentNames: []
  },
  {
    from: 'info@newsletter.netflix.com',
    subject: 'What is new on Netflix this week - Stranger Things Season 5 is here!',
    htmlBody: `
      <div style="font-family: sans-serif; background-color: #141414; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #e50914; font-size: 28px; margin-bottom: 5px;">NETFLIX</h1>
        <hr style="border-color: #333; margin-bottom: 20px;" />
        <h2 style="font-size: 20px;">The Wait is Over!</h2>
        <p style="color: #cccccc;">Stranger Things Season 5 is now streaming. Watch the final chapter in the mystery of Hawkins, Indiana.</p>
        <a href="#" style="display: inline-block; background-color: #e50914; color: white; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 15px;">Watch Now</a>
      </div>
    `,
    textBody: 'Netflix: Stranger Things Season 5 is now streaming. Watch the final chapter now.',
    attachmentNames: ['promo_poster.jpg']
  },
  {
    from: 'digest@techcrunch.com',
    subject: 'TechCrunch Weekly: The Rise of Agentic AI Coding Assistants',
    htmlBody: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #028a0f;">TechCrunch Weekly Digest</h2>
        <p>In this week's issue, we cover the shifting landscape of software engineering as agentic code environments become standard developer tools:</p>
        <ul>
          <li><strong>Agentic Coding:</strong> How developers are transitioning from writing code to guiding AI agents.</li>
          <li><strong>Vite 8 Release:</strong> New native build optimizations and faster HMR pipelines.</li>
          <li><strong>Tailwind CSS v4:</strong> Performance audits show builds are up to 10x faster.</li>
        </ul>
      </div>
    `,
    textBody: 'TechCrunch: Rise of Agentic AI, Vite 8 releases, and Tailwind CSS v4 performance audits.',
    attachmentNames: ['weekly_report.pdf', 'benchmark_charts.xlsx']
  }
]

export function generateMockMessage(toAddress: string, index: number): EmailMessage {
  // Cycle through the pre-defined templates based on list length
  const template = mockTemplates[index % mockTemplates.length]
  
  return {
    id: `msg_${Math.random().toString(36).substr(2, 9)}`,
    from: template.from,
    to: toAddress,
    subject: template.subject,
    htmlBody: template.htmlBody,
    textBody: template.textBody,
    receivedAt: new Date().toISOString(),
    attachmentNames: template.attachmentNames
  }
}