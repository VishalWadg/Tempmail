import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, Check, Shuffle } from 'lucide-react'
import { copyToClipboard } from '@/lib/clipboard'   
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface AddressPanelProps {
  email: string
  onRegenerate: () => void
  onDelete: () => void
}

export function AddressPanel({ email, onRegenerate, onDelete}: AddressPanelProps) {
  const [copied, setCopied] = useState(false)

  // Copy to Clipboard logic
    const handleCopy = async () => {
        const success = await copyToClipboard(email)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* The Email Display Box (Takes up the left side) */}
        <div className="relative flex-1 w-full h-13 flex items-center text-lg md:text-xl font-mono bg-muted px-4 rounded-lg border border-border pr-14 overflow-hidden">
          <div className="select-all truncate w-full">
            {email}
          </div>
          
          {/* Copy button with locked flex centering to prevent icon jump */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
                    onClick={handleCopy}
                    aria-label="Copy email address"
                >
                    {copied ? (
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                    <Copy className="h-5 w-5 shrink-0" />
                    )}
                </Button>
            </div>
        </div>

        {/* Large Action Controls (Anchored to the right side) */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">

          <Button
            variant="outline"
            className="h-13 px-6 text-base font-medium"
            onClick={onRegenerate}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-13 w-14"
                aria-label="Delete mailbox"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your current temporary mailbox and all received messages.
                  A new email address will be automatically generated for you.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Mailbox
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
        </div>
      </div>
    </Card>
  )
}