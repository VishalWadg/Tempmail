// Safe storage helper functions to avoid crashes in restricted browser contexts (privacy settings, sandbox)

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.warn(`localStorage read blocked for key "${key}":`, e)
      return null
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.warn(`localStorage write blocked for key "${key}":`, e)
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn(`localStorage delete blocked for key "${key}":`, e)
    }
  }
}

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key)
    } catch (e) {
      console.warn(`sessionStorage read blocked for key "${key}":`, e)
      return null
    }
  },
  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value)
    } catch (e) {
      console.warn(`sessionStorage write blocked for key "${key}":`, e)
    }
  },
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (e) {
      console.warn(`sessionStorage delete blocked for key "${key}":`, e)
    }
  }
}