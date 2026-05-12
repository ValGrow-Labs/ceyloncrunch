'use client'
import { createContext, useContext } from 'react'

const SettingsCtx = createContext({})

export function SettingsProvider({ settings, children }) {
  return <SettingsCtx.Provider value={settings}>{children}</SettingsCtx.Provider>
}

export const useSettings = () => useContext(SettingsCtx)
