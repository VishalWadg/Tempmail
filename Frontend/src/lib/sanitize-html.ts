import DOMpurify from 'dompurify'

export function sanitizeHtml(html: string): string {
    if (!html) return ''
    return DOMpurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
        'a', 'b', 'i', 'u', 'strong', 'em', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 
        'span', 'div', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'img'
        ],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'width', 'height', 'style']
    })
}
