import { Portal } from '@radix-ui/react-portal'
import { Search } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Input } from '@/components/ui'
import { AppRoute, protectedRoutes, hiddenProtectedRoutes } from '@/config'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AppRoute[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    setIsOpen(true)

    if (searchQuery.trim() === '') {
      setResults([])
      return
    }

    const searchResults = [
      ...protectedRoutes.filter(
        route =>
          route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
      ...hiddenProtectedRoutes.filter(
        route =>
          route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    ]

    setResults(searchResults)
  }, [])

  const handleSelect = useCallback(
    (route: AppRoute) => {
      navigate(route.path)
      setIsOpen(false)
      setQuery('')
      inputRef.current?.blur()
    },
    [navigate],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const {
    top = 0,
    left = 0,
    width = 0,
    height = 0,
  } = wrapperRef.current?.getBoundingClientRect() ?? {}

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      {isOpen && query.trim() !== '' && results.length > 0 && (
        <Portal>
          <div
            className="fixed bg-popover text-popover-foreground border rounded-lg shadow-md overflow-y-auto"
            style={{
              top: `${top + height + window.scrollY + 4}px`,
              left: `${left + window.scrollX}px`,
              width: `${width}px`,
              zIndex: 9999,
            }}
          >
            {results.map((route, index) => (
              <div
                key={index}
                className="p-3 hover:bg-accent cursor-pointer border-b border-muted last:border-b-0"
                onMouseDown={e => {
                  e.preventDefault()
                  handleSelect(route)
                }}
              >
                <h3 className="text-sm font-semibold">{route.title}</h3>
                <p className="text-sm text-muted-foreground">{route.description}</p>
              </div>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}
