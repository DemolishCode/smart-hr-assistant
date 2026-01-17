"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from '@/locales/en.json'
import th from '@/locales/th.json'

type Locale = 'en' | 'th'
type Translations = typeof en

interface LanguageContextType {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const translations: Record<Locale, Translations> = { en, th }

// Default context value for SSR/SSG
const defaultContextValue: LanguageContextType = {
  locale: 'en',
  t: en,
  setLocale: () => {},
  toggleLocale: () => {},
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from sessionStorage on mount
    const savedLocale = sessionStorage.getItem('locale') as Locale | null
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'th')) {
      setLocaleState(savedLocale)
    }
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    sessionStorage.setItem('locale', newLocale)
  }

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'th' : 'en'
    setLocale(newLocale)
  }

  const t = translations[locale]

  // Return default English during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={defaultContextValue}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}

// Helper hook to get translations directly
export function useTranslations() {
  const { t } = useLanguage()
  return t
}
