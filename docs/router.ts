import { useEffect, useState } from 'react'

/** The current hash route, e.g. "components/button" or "guide/installation". */
export function useHashRoute(): string {
  const get = () => window.location.hash.replace(/^#\/?/, '')
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const onChange = () => {
      setRoute(get())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(to: string) {
  window.location.hash = `/${to}`
}
