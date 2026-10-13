'use client';
import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_SETTINGS } from '../lib/settings';

const SettingsContext = createContext(DEFAULT_SETTINGS);

export function SettingsProvider({ initialSettings = DEFAULT_SETTINGS, children }) {
  const [settings, setSettings] = useState(initialSettings);
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
