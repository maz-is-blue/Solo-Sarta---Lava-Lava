import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useLanguage } from './LanguageContext'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const { lang } = useLanguage()
  const [contentMaps, setContentMaps] = useState({ en: {}, ar: {} })
  const [rawItems, setRawItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/content')
      .then(res => {
        const maps = { en: {}, ar: {} }
        res.data.forEach(item => {
          const l = item.lang || 'en'
          if (!maps[l]) maps[l] = {}
          maps[l][`${item.brand}.${item.section}.${item.key}`] = item.value
        })
        setContentMaps(maps)
        setRawItems(res.data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const get = useCallback(
    (key, fallback = '') =>
      contentMaps[lang]?.[key] ?? contentMaps.en?.[key] ?? fallback,
    [lang, contentMaps]
  )

  const refresh = () =>
    api.get('/content').then(res => {
      const maps = { en: {}, ar: {} }
      res.data.forEach(item => {
        const l = item.lang || 'en'
        if (!maps[l]) maps[l] = {}
        maps[l][`${item.brand}.${item.section}.${item.key}`] = item.value
      })
      setContentMaps(maps)
      setRawItems(res.data)
    })

  return (
    <ContentContext.Provider value={{ get, rawItems, loaded, refresh }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => useContext(ContentContext)
