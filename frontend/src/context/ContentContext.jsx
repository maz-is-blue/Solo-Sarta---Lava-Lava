import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [contentMap, setContentMap] = useState({})
  const [rawItems, setRawItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/content')
      .then(res => {
        const map = {}
        res.data.forEach(item => {
          map[`${item.brand}.${item.section}.${item.key}`] = item.value
        })
        setContentMap(map)
        setRawItems(res.data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const get = (key, fallback = '') => contentMap[key] ?? fallback

  const refresh = () => {
    return api.get('/content').then(res => {
      const map = {}
      res.data.forEach(item => {
        map[`${item.brand}.${item.section}.${item.key}`] = item.value
      })
      setContentMap(map)
      setRawItems(res.data)
    })
  }

  return (
    <ContentContext.Provider value={{ get, rawItems, loaded, refresh }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => useContext(ContentContext)
