import { useCallback, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AppShell } from '../components/layout/AppShell'
import { getOrInitEmail, forceRegenerateEmail } from '@/features/inbox/utils/email-generator'
import { AddressPanel } from '@/features/inbox/components/AddressPanel'

function App() {
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
  // 3. Callback: Refresh inbox
  const handleRefresh = useCallback(() => {
    console.log('Checking for new messages...')
  }, [])

  return (
    <AppShell>
      <AddressPanel
        email={email}
        onRegenerate={handleRegenerate}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
      />

      <Card className="flex-1 p-6 min-h-[400px] flex items-center justify-center text-muted-foreground">
        No messages received yet. Waiting for incoming mail...
      </Card>
    </AppShell>
  )
}

export default App