'use client';
import { useState } from 'react';

export function useSettingsSave(sectionKey, initialData) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: sectionKey, value: data }),
    });
    setSaving(false);
  };

  return { data, setData, saving, save };
}
