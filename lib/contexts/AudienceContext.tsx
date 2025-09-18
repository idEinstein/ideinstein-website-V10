'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types for audience selection
export type AudienceType = 'startup' | 'enterprise' | null
export type SelectionMethod = 'explicit' | 'inferred' | null

export interface AudienceState {
  selectedAudience: AudienceType
  selectionMethod: SelectionMethod
  timestamp: Date | null
}

export interface AudienceContextType {
  audienceState: AudienceState
  selectAudience: (audience: AudienceType, method?: SelectionMethod) => void
  clearAudience: () => void
  isAudienceSelected: boolean
}

// Create the context
const AudienceContext = createContext<AudienceContextType | undefined>(undefined)

// Provider component
interface AudienceProviderProps {
  children: ReactNode
}

export function AudienceProvider({ children }: AudienceProviderProps) {
  const [audienceState, setAudienceState] = useState<AudienceState>({
    selectedAudience: null,
    selectionMethod: null,
    timestamp: null
  })

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('audience-selection')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setAudienceState({
            ...parsed,
            timestamp: parsed.timestamp ? new Date(parsed.timestamp) : null
          })
        } catch (error) {
          console.warn('Failed to parse stored audience selection:', error)
        }
      }
    }
  }, [])

  // Save to sessionStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && audienceState.selectedAudience) {
      sessionStorage.setItem('audience-selection', JSON.stringify(audienceState))
    }
  }, [audienceState])

  const selectAudience = (audience: AudienceType, method: SelectionMethod = 'explicit') => {
    const newState: AudienceState = {
      selectedAudience: audience,
      selectionMethod: method,
      timestamp: new Date()
    }
    setAudienceState(newState)

    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'audience_selection', {
        audience_type: audience,
        selection_method: method,
        timestamp: new Date().toISOString()
      })
    }
  }

  const clearAudience = () => {
    setAudienceState({
      selectedAudience: null,
      selectionMethod: null,
      timestamp: null
    })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('audience-selection')
    }
  }

  const isAudienceSelected = audienceState.selectedAudience !== null

  return (
    <AudienceContext.Provider
      value={{
        audienceState,
        selectAudience,
        clearAudience,
        isAudienceSelected
      }}
    >
      {children}
    </AudienceContext.Provider>
  )
}

// Hook to use the audience context
export function useAudience() {
  const context = useContext(AudienceContext)
  if (context === undefined) {
    throw new Error('useAudience must be used within an AudienceProvider')
  }
  return context
}