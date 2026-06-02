import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { TRANSLATIONS } from '../translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('ss_lang') || 'en'
  )

  const setLang = (l) => {
    setLangState(l)
    localStorage.setItem('ss_lang', l)
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.body.classList.toggle('lang-ar', lang === 'ar')
  }, [lang])

  const t = useCallback(
    (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key,
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL: lang === 'ar', t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
