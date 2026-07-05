// Safe clipboard copy helper with legacy fallback for non-secure origins or restricted contexts
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern Clipboard API if supported
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (err) {
    console.warn('Modern Clipboard API failed, attempting fallback:', err)
  }

  // 2. Try document.execCommand('copy') fallback
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    
    // Position off-screen
    textArea.style.position = 'fixed'
    textArea.style.top = '-9999px'
    textArea.style.left = '-9999px'
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err)
    return false
  }
}