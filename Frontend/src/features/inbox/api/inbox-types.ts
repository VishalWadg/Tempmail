export interface EmailMessage {
  id: string
  from: string
  to: string
  subject: string | null
  htmlBody: string | null
  textBody: string | null
  receivedAt: string
  attachmentNames: string[]
}