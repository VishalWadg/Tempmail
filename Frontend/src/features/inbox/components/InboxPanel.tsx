import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CircularTimer } from '@/components/ui/CircularTimer'
import { sanitizeHtml } from '@/lib/sanitize-html'
import type { EmailMessage } from '../api/inbox-types'
import { formatTime, formatDateFull } from '@/lib/format-date'
import { 
  Mail, 
  MailOpen, 
  RefreshCw, 
  Paperclip, 
  Wifi, 
  Calendar, 
  ArrowRight,
  User,
  Inbox
} from 'lucide-react'
import { useInboxSimulation } from '../hooks/useInboxSimulation'

interface InboxPanelProps {
  email: string
}
const REFRESH_INTERVAL_SEC = 15

export function InboxPanel({ email }: InboxPanelProps) {

    const {
        messages,
        selectedMessage,
        setSelectedMessage,
        refresh,
        isRefetching
    } = useInboxSimulation(email)

    const [timeLeft, setTimeLeft] = useState(REFRESH_INTERVAL_SEC)
    const [readIds, setReadIds] = useState<Set<string>>(new Set())

    // Ref-based stable callback pattern to prevent interval resets
    const refreshRef = useRef(refresh)
    useEffect(() => {
        refreshRef.current = refresh
    }, [refresh])
    // Timer loop for auto-refresh  
    useEffect(() => {
        const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
            refreshRef.current()
            return REFRESH_INTERVAL_SEC
            }
            return prev - 1
        })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Manual refresh callback
    const handleManualRefresh = useCallback(() => {
        refresh()
        setTimeLeft(REFRESH_INTERVAL_SEC)
    }, [refresh])
    // Reset countdown and read states when email changes
    useEffect(() => {
        setTimeLeft(REFRESH_INTERVAL_SEC)
        setReadIds(new Set())
    }, [email])
  

    // Mark message as read and trigger parent selection callback
    const handleSelect = (msg: EmailMessage) => {
        setReadIds((prev) => {
        const next = new Set(prev)
        next.add(msg.id)
        return next
        })
        setSelectedMessage(msg)
    }

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-[500px]">
      
      {/* 1. Inbox Toolbar Header */}
      <Card className="px-4 h-14 border border-border/80 bg-card/50 backdrop-blur-xs flex flex-row items-center justify-between gap-2 w-full overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Badge variant="secondary" className="px-2 py-0.5 text-[11px] sm:text-xs font-semibold select-none">
            {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
          </Badge>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-green-500/80 font-medium select-none">
            <Wifi className="h-3 w-3 animate-pulse" />
            <span>Synced</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Circular Auto-Refresh Timer */}
          <CircularTimer timeLeft={timeLeft} maxTime={REFRESH_INTERVAL_SEC} size={32} strokeWidth={2.5} />
          
          {/* Manual Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleManualRefresh}
            disabled={isRefetching}
            className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer transition-colors shrink-0"
            title="Refresh messages"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin text-primary' : ''}`} />
          </Button>
        </div>
      </Card>

      {/* 2. Inbox Workspace Grid (Split Pane) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[28%_1fr] xl:grid-cols-[320px_1fr] gap-6 min-h-[450px] min-w-0">
        
        {/* Left Side: Message List */}
        <Card className="flex flex-col overflow-hidden border border-border/80 bg-card/40 backdrop-blur-xs h-[600px]">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/20 select-none">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/75">Inbox Folder</span>
          </div>

          {messages.length === 0 ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
              <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-foreground/80">Waiting for messages</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
                Your temporary inbox is active. Send an email to test.
              </p>
            </div>
          ) : (
            // Scrollable List
            <ScrollArea className="flex-1">
              <div className="p-3 flex flex-col gap-2">
                {messages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id
                  const isRead = readIds.has(msg.id)
                  
                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelect(msg)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-start overflow-hidden min-w-0 ${
                        isSelected 
                          ? 'bg-primary/10 border-primary/45 shadow-xs' 
                          : 'bg-card border-border/50 hover:bg-muted/40 hover:border-border/80'
                      }`}
                    >
                      {/* Left Side: Sender, Subject, Snippet (claims all remaining space and truncates safely) */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <span className={`text-xs font-semibold truncate ${!isRead ? 'text-primary' : 'text-muted-foreground'}`}>
                          {msg.from}
                        </span>
                        <h4 className={`text-xs truncate ${!isRead ? 'font-bold text-foreground' : 'text-foreground/80'}`}>
                          {msg.subject || '(No Subject)'}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {msg.textBody || 'HTML message body'}
                        </p>
                      </div>

                      {/* Right Side: Time, Attachment, and Unread indicators */}
                      <div className="flex flex-col items-end justify-between shrink-0 self-stretch text-right min-w-[65px] gap-1.5">
                        <span className="text-[9px] font-bold text-muted-foreground/80">
                          {formatTime(msg.receivedAt)}
                        </span>
                        <div className="flex items-center gap-1.5 mt-auto">
                          {msg.attachmentNames.length > 0 && (
                            <Paperclip className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                          )}
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </Card>

        {/* Right Side: Message Viewer Details */}
        <Card className="flex flex-col overflow-hidden border border-border/80 bg-card/60 backdrop-blur-xs h-[600px]">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Header Info */}
              <div className="p-6 border-b border-border/50 bg-muted/10 flex flex-col gap-3 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg text-foreground/90 tracking-tight leading-snug">
                    {selectedMessage.subject || '(No Subject)'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDateFull(selectedMessage.receivedAt)}</span>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground/90 w-12 select-none">From:</span>
                    <span className="font-mono text-foreground/80 bg-muted/40 px-2 py-0.5 rounded border border-border/30">
                      {selectedMessage.from}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground/90 w-12 select-none">To:</span>
                    <span className="font-mono text-foreground/80 bg-muted/40 px-2 py-0.5 rounded border border-border/30">
                      {selectedMessage.to}
                    </span>
                  </div>
                </div>

                {/* Attachments if any */}
                {selectedMessage.attachmentNames.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 pt-2 border-t border-dashed border-border/40">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1 select-none mr-2">
                      <Paperclip className="h-3 w-3" />
                      Attachments:
                    </span>
                    {selectedMessage.attachmentNames.map((name, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1 py-0.5 px-2 font-mono text-[10px] text-muted-foreground/95 bg-card border-border/60">
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Body Content Container */}
              <ScrollArea className="flex-1 bg-background/50 border-t border-border/30 p-6">
                {selectedMessage.htmlBody ? (
                  // Rich HTML email body (rendered safely using DOMPurify sanitizer)
                  <div 
                    className="prose dark:prose-invert max-w-none text-sm text-foreground leading-relaxed break-words"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedMessage.htmlBody) }}
                  />
                ) : (
                  // Plain Text fallback
                  <pre className="font-sans text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
                    {selectedMessage.textBody || '(Empty body)'}
                  </pre>
                )}
              </ScrollArea>
            </div>
          ) : (
            // Unselected State Placeholder
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                <MailOpen className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-foreground/80">No message selected</h3>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Click an email from the inbox list to read its content.
              </p>
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}