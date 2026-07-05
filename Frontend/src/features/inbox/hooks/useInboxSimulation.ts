import { useState, useEffect, useCallback, useRef } from 'react'
import type { EmailMessage } from '../api/inbox-types'
import { generateMockMessage } from '../utils/mock-messages'

export function useInboxSimulation(email: string) {
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null)
  const [isRefetching, setIsRefetching] = useState(false)

  // Use refs to keep callback functions stable inside setTimeout
  const emailRef = useRef(email)
  useEffect(() => {
    emailRef.current = email
  }, [email])

  // Reset inbox state when the email address changes
  useEffect(() => {
    setMessages([])
    setSelectedMessage(null)
  }, [email])

  // Trigger manual refresh simulation
  const refresh = useCallback(() => {

    if(isRefetching) return // Prevent overlapping refreshes

    setIsRefetching(true)
    
    // Simulate network delay
    setTimeout(() => {
      setIsRefetching(false)
      
      setMessages((prev) => {
        // Limit simulation to max 5 emails for simplicity
        if (prev.length < 5) {
          const newMsg = generateMockMessage(emailRef.current, prev.length)
          console.log('Simulated new email arrival during refresh')
          return [newMsg, ...prev]
        }
        return prev
      })
    }, 800)
  }, [])

  // Auto-generate mock messages over time to simulate active background incoming mail
  useEffect(() => {
    if (!email) return

    // Trigger first mock mail after 10 seconds
    const timer1 = setTimeout(() => {
      setMessages((prev) => {
        const newMsg = generateMockMessage(emailRef.current, prev.length)
        console.log('Simulated background email arrival (10s):', newMsg.subject)
        return [newMsg, ...prev]
      })
    }, 10000)

    // Trigger second mock mail after 30 seconds
    const timer2 = setTimeout(() => {
      setMessages((prev) => {
        const newMsg = generateMockMessage(emailRef.current, prev.length)
        console.log('Simulated background email arrival (30s):', newMsg.subject)
        return [newMsg, ...prev]
      })
    }, 30000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [email])

  return {
    messages,
    selectedMessage,
    setSelectedMessage,
    refresh,
    isRefetching,
  }
}