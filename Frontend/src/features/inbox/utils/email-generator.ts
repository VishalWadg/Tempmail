import { safeSessionStorage } from '@/lib/storage'
const adjectives = ['swift', 'clever', 'bright', 'cozy', 'happy', 'silent', 'bold', 'warm']
const nouns = ['fox', 'panda', 'koala', 'tiger', 'rabbit', 'otter', 'falcon', 'badger']
const domains = ['tempmail.com', 'boxmail.org', 'inboxer.net']

const STORAGE_KEY = 'tempmail-active-address'


// 1. Pure function to generate a random email address
export function generateRandomEmail(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNumber = Math.floor(Math.random() * 900) + 100 // 3-digit number (100-999)
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]
  
  return `${randomAdjective}-${randomNoun}-${randomNumber}@${randomDomain}`
}

// 2. Logic to load or initialize the session-persisted email address
export function getOrInitEmail(): string {
  const saved = safeSessionStorage.getItem(STORAGE_KEY)
  if (saved) return saved

  const newEmail = generateRandomEmail()
  safeSessionStorage.setItem(STORAGE_KEY, newEmail)
  return newEmail
}

// 3. Logic to force-regenerate and persist a new email address
export function forceRegenerateEmail(): string {
  const newEmail = generateRandomEmail()
  safeSessionStorage.setItem(STORAGE_KEY, newEmail)
  return newEmail
}


// 4. Logic to clear the persisted email address
export function clearPersistedEmail(): void {
  safeSessionStorage.removeItem(STORAGE_KEY)
}