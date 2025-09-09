'use client';

import { useMemo, useState, useEffect } from 'react';
import WordProcessor from './components/WordProcessor';
import type { CustomToolbarItemModel } from '@syncfusion/ej2-react-documenteditor';

/** Full set of common built-ins you can offer (extend as needed) */
const ALL_BUILTINS = [
  'New', 'Open',
  'Undo', 'Redo',
  'Find',
  'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents',
  'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'InsertFootnote', 'InsertEndnote',
  'LocalClipboard', 'RestrictEditing', 'TrackChanges', 'Comments',
  'FormFields', 'UpdateFields', 'ContentControl',
  'Print', 'Export', 'Zoom',
] as const;

const BASE = 'https://cdn.syncfusion.com/ej2/30.2.4';
type ThemeDef = { id: string; label: string; href: string; group: string };
const THEMES: ThemeDef[] = [
  { id: 'fluent2',        label: 'Fluent 2',            href: `${BASE}/fluent2.css`,        group: 'Fluent 2' },
  { id: 'fluent2-lite',   label: 'Fluent 2 (Lite)',     href: `${BASE}/fluent2-lite.css`,   group: 'Fluent 2' },
  { id: 'fluent2-dark',   label: 'Fluent 2 Dark',       href: `${BASE}/fluent2-dark.css`,   group: 'Fluent 2' },
  { id: 'material3',      label: 'Material 3',          href: `${BASE}/material3.css`,      group: 'Material 3' },
  { id: 'material3-dark', label: 'Material 3 Dark',     href: `${BASE}/material3-dark.css`, group: 'Material 3' },
  { id: 'bootstrap5',     label: 'Bootstrap 5.3',       href: `${BASE}/bootstrap5.css`,     group: 'Bootstrap 5.3' },
  { id: 'bootstrap5-dark',label: 'Bootstrap 5.3 Dark',  href: `${BASE}/bootstrap5-dark.css`,group: 'Bootstrap 5.3' },
  { id: 'tailwind',       label: 'Tailwind 3.4',        href: `${BASE}/tailwind.css`,       group: 'Tailwind 3.4' },
  { id: 'tailwind-dark',  label: 'Tailwind 3.4 Dark',   href: `${BASE}/tailwind-dark.css`,  group: 'Tailwind 3.4' },
  { id: 'highcontrast',   label: 'High Contrast',       href: `${BASE}/highcontrast.css`,   group: 'High Contrast' },
];
const DEFAULT_THEME_ID = 'fluent2-lite';



/** A nice default selection */
const DEFAULT_SELECTION = new Set([
  'Undo', 'Redo',
  'Find',
  'Image', 'Table', 'Hyperlink',
  'Comments', 'TrackChanges',
  'Export', 'Zoom',
] as const);

/** Group built-ins for a cleaner UI */
const GROUPS = [
  { name: 'File', items: ['New', 'Open', 'Print', 'Export'] },
  { name: 'Edit', items: ['Undo', 'Redo', 'Find', 'LocalClipboard'] },
  { name: 'Insert', items: ['Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Break', 'PageNumber', 'InsertFootnote', 'InsertEndnote'] },
  { name: 'Header & Footer', items: ['Header', 'Footer', 'PageSetup'] },
  { name: 'Review', items: ['Comments', 'TrackChanges', 'RestrictEditing'] },
  { name: 'Fields/Controls', items: ['FormFields', 'UpdateFields', 'ContentControl'] },
  { name: 'View', items: ['Zoom'] },
] as const;

type CustomItemInput = {
  id: string;
  text: string;
  tooltipText?: string;
  prefixIcon?: string; // e.g. "e-icons e-save"
};

type BuiltinItem = typeof ALL_BUILTINS[number];

export default function Page() {
  // Visible (included) built-ins
  const [selected, setSelected] = useState<Set<BuiltinItem>>(new Set(DEFAULT_SELECTION));

  // Disabled built-ins (still visible but inactive)
  const [disabled, setDisabled] = useState<Set<BuiltinItem>>(new Set());

  // Custom buttons
  const [customItems, setCustomItems] = useState<CustomToolbarItemModel[]>([
    { id: 'custom_say_hello', text: 'Hello', tooltipText: 'Insert hello text', prefixIcon: 'e-icons e-edit' },
  ]);

  // Add-new custom item form
  const [form, setForm] = useState<CustomItemInput>({ id: '', text: '', tooltipText: '', prefixIcon: 'e-icons e-add' });

  // Build final toolbar list in a **stable default order** of built-ins + customs at the end
  const orderedBuiltins = useMemo(() => {
    // keep natural ALL_BUILTINS order but include only selected ones
    return ALL_BUILTINS.filter((b) => selected.has(b));
  }, [selected]);

  const toolbarItems = useMemo(
    () => [...orderedBuiltins, ...customItems] as (string | CustomToolbarItemModel)[],
    [orderedBuiltins, customItems]
  );

  const disabledBuiltins = useMemo<BuiltinItem[]>(
    () => Array.from(disabled),
    [disabled]
  );

  const toggleSelected = (name: BuiltinItem) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleDisabled = (name: BuiltinItem) => {
    setDisabled(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const addCustom = () => {
    if (!form.id || !form.text) return;
    setCustomItems(prev => [...prev, { ...form }]);
    setForm({ id: '', text: '', tooltipText: '', prefixIcon: 'e-icons e-add' });
  };

  const removeCustom = (id: string) => {
    setCustomItems(prev => prev.filter(c => c.id !== id));
  };

  const clearAll = () => {
    setSelected(new Set());
    setDisabled(new Set());
  };

  const selectAll = () => {
    setSelected(new Set(ALL_BUILTINS));
  };

  const [themeId, setThemeId] = useState<string>(() => {
  if (typeof window !== 'undefined') return localStorage.getItem('sf-theme-id') ?? DEFAULT_THEME_ID;
  return DEFAULT_THEME_ID;
});

useEffect(() => {
  const link = document.getElementById('sf-theme') as HTMLLinkElement | null;
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];
  if (link && theme) {
    link.href = theme.href;
    localStorage.setItem('sf-theme-id', theme.id);
  }
}, [themeId]);

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
      {/* Control Panel */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 12px 0' }}>Toolbar Configurator</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          {/* Built-ins include/disable */}
          <div style={{ border: '1px solid #eef2f7', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={selectAll} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>
                Select all
              </button>
              <button onClick={clearAll} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>
                Clear all
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
              {GROUPS.map(({ name, items }) => (
                <fieldset key={name} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10 }}>
                  <legend style={{ fontSize: 12, color: '#6b7280' }}>{name}</legend>
                  {items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '4px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={selected.has(item)}
                          onChange={() => toggleSelected(item)}
                        />
                        <span>{item}</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                        <input
                          type="checkbox"
                          checked={disabled.has(item)}
                          onChange={() => toggleDisabled(item)}
                          disabled={!selected.has(item)} // only disable if visible
                        />
                        Disable
                      </label>
                    </div>
                  ))}
                </fieldset>
              ))}
            </div>
          </div>

          {/* Custom items add/remove */}
          <div style={{ border: '1px solid #eef2f7', borderRadius: 8, padding: 12 }}>
            <h4 style={{ marginTop: 0 }}>Custom Buttons</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              <input
                placeholder="id (e.g. custom_save_docx)"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <input
                placeholder="text (label)"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <input
                placeholder="tooltipText (optional)"
                value={form.tooltipText ?? ''}
                onChange={(e) => setForm({ ...form, tooltipText: e.target.value })}
                style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <input
                placeholder='prefixIcon (e.g. "e-icons e-save")'
                value={form.prefixIcon ?? ''}
                onChange={(e) => setForm({ ...form, prefixIcon: e.target.value })}
                style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <button
                onClick={addCustom}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#111827', color: '#fff' }}
              >
                Add Custom Button
              </button>
            </div>

            {customItems.length > 0 && (
              <>
                <hr style={{ margin: '12px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {customItems.map((c) => (
                    <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                      <span><b>{c.text}</b> <small style={{ color: '#6b7280' }}>({c.id})</small></span>
                      <button
                        onClick={() => removeCustom(c.id!)}
                        style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
  <label htmlFor="theme" style={{ fontWeight: 600 }}>Theme</label>
  <select
    id="theme"
    value={themeId}
    onChange={(e) => setThemeId(e.target.value)}
    style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 240 }}
  >
    {Array.from(new Set(THEMES.map(t => t.group))).map(group => (
      <optgroup key={group} label={group}>
        {THEMES.filter(t => t.group === group).map(t => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </optgroup>
    ))}
  </select>
</div>
      
      {/* Editor */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <WordProcessor
          height="640px"
          toolbarItems={toolbarItems}
          disabledBuiltins={disabledBuiltins}
          showPropertiesPane={false}
          readOnly={false}
        />
      </div>
    </main>
  );
}
