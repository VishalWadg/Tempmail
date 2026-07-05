import { useCallback, useState, type ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { AppShell } from '../components/layout/AppShell'
import { getOrInitEmail, forceRegenerateEmail } from '@/features/inbox/utils/email-generator'
import { AddressPanel } from '@/features/inbox/components/AddressPanel'
import { InboxPanel } from '@/features/inbox/components/InboxPanel'

function App() : ReactNode {
  // Initialize state lazily from sessionStorage (no more layout flicker!)
  const [email, setEmail] = useState<string>(() => getOrInitEmail())
  // 1. Callback: Force-regenerate a new address
  const handleRegenerate = useCallback(() => {
    const newEmail = forceRegenerateEmail()
    setEmail(newEmail)
    console.log('Regenerated a new email address:', newEmail)
  }, [])
  // 2. Callback: Delete mailbox (clears active session and gets a fresh address)
  const handleDelete = useCallback(() => {
    const newEmail = forceRegenerateEmail() // Generates and overrides the active session
    setEmail(newEmail)
    console.log('Mailbox deleted and fresh address generated:', newEmail)
  }, [])
  

  return (
    <AppShell>
      <AddressPanel
        email={email}
        onRegenerate={handleRegenerate}
        onDelete={handleDelete}
      />

      <InboxPanel email={email} />
    </AppShell>
  )
}

export default App