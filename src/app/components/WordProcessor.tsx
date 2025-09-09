'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DocumentEditorContainerComponent,
  Toolbar,
  type ToolbarItem,
  type CustomToolbarItemModel,
  type ToolbarClickEventArgs,
} from '@syncfusion/ej2-react-documenteditor';

DocumentEditorContainerComponent.Inject(Toolbar);

export interface WordProcessorProps {
  height?: string;
  readOnly?: boolean;
  showPropertiesPane?: boolean;
  serviceUrl?: string;

  // Live-configurable toolbar (may include built-in names OR custom objects)
  toolbarItems: (ToolbarItem | CustomToolbarItemModel)[];
  // Names of built-ins you want disabled (but still visible)
  disabledBuiltins?: ToolbarItem[];
}

/** Built-ins we implement directly here (extend as needed) */
const SUPPORTED_BUILTINS: Record<
  string,
  { icon?: string; tooltip?: string; onClick: (ctx: Ctx) => void }
> = {
  Undo:    { icon: 'e-icons e-undo',    tooltip: 'Undo',    onClick: ({ editor }) => editor?.undo() },
  Redo:    { icon: 'e-icons e-redo',    tooltip: 'Redo',    onClick: ({ editor }) => editor?.redo() },
  Find:    { icon: 'e-icons e-search',  tooltip: 'Find',    onClick: ({ editor }) => { try { (editor as any)?.showDialog?.('Find'); } catch {} } },
  Print:   { icon: 'e-icons e-print',   tooltip: 'Print',   onClick: ({ editor }) => editor?.print() },
  Export:  { icon: 'e-icons e-export',  tooltip: 'Save as DOCX', onClick: ({ editor }) => editor?.save('document', 'Docx') },
  ExportPdf: { icon: 'e-icons e-pdf',   tooltip: 'Save as PDF',  onClick: ({ editor }) => editor?.save('document', 'Pdf') },
  ZoomIn:  { icon: 'e-icons e-zoom-in', tooltip: 'Zoom In', onClick: ({ editor }) => { if (editor) editor.zoomFactor = Math.min(4, (editor.zoomFactor ?? 1) + 0.1); } },
  ZoomOut: { icon: 'e-icons e-zoom-out',tooltip: 'Zoom Out',onClick: ({ editor }) => { if (editor) editor.zoomFactor = Math.max(0.1, (editor.zoomFactor ?? 1) - 0.1); } },
  // Add more mappings if you want to cover other built-ins like Image/Table/etc.
};

/** Convert any mix of strings and custom models into EJ2 Toolbar item objects */
function normalizeToolbarItems(
  input: (ToolbarItem | CustomToolbarItemModel)[]
): CustomToolbarItemModel[] {
  const out: CustomToolbarItemModel[] = [];

  for (const it of input) {
    // Allow separator via object { type: 'Separator' } or a special string 'Separator'
    if (it === 'Separator' || (typeof it === 'object' && (it as any).type === 'Separator')) {
      out.push({ type: 'Separator' } as any);
      continue;
    }

    if (typeof it === 'string') {
      const key = it as string;
      const mapping = SUPPORTED_BUILTINS[key];
      // Map known built-ins to object items with stable ids
      if (mapping) {
        out.push({
          id: `builtin_${key}`,
          tooltipText: mapping.tooltip ?? key,
          prefixIcon: mapping.icon,
          // show text for clarity; remove text if you prefer icon-only
          text: key,
        });
      } else {
        // Fallback: render as a plain custom button (you can extend click handler later)
        out.push({
          id: `builtin_${key}`,
          text: key,
          tooltipText: key,
        });
      }
    } else {
      // Already a CustomToolbarItemModel
      out.push(it as CustomToolbarItemModel);
    }
  }
  return out;
}

type Ctx = { editor: any };

export default function WordProcessor({
  height = '640px',
  readOnly = false,
  showPropertiesPane = false,
  serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/',
  toolbarItems,
  disabledBuiltins = [],
}: WordProcessorProps) {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);
  const [isReady, setIsReady] = useState(false);

  // Normalize once per change — ensures EJ2 gets object models, not strings
  const normalizedItems = useMemo(
    () => normalizeToolbarItems(toolbarItems),
    [toolbarItems]
  );

  // Clean destroy on unmount / fast refresh
  useEffect(() => {
    return () => {
      try {
        containerRef.current?.documentEditor?.destroy();
        // @ts-expect-error destroy exists at runtime on container
        containerRef.current?.destroy?.();
      } catch {}
    };
  }, []);

  // Initialize doc & apply readOnly on create
  const onCreated = () => {
    const editor = containerRef.current?.documentEditor;
    try {
      if (editor) {
        editor.isReadOnly = !!readOnly;
        const sfdt = JSON.stringify({
          sections: [
            { blocks: [{ paragraphs: [{ inlines: [{ text: 'Hello from Syncfusion!' }] }] }], headersFooters: {} },
          ],
        });
        editor.open(sfdt);
        editor.resize();
      }
      setIsReady(true);
    } catch {}
  };

  // Keep editor.isReadOnly in sync with prop
  useEffect(() => {
    if (!isReady) return;
    const editor = containerRef.current?.documentEditor;
    if (editor) {
      editor.isReadOnly = !!readOnly;
      editor.resize();
    }
  }, [readOnly, isReady]);

  // Central click handler (handles our mapped built-ins and your custom items)
  const onToolbarClick = (args: ToolbarClickEventArgs) => {
    const id = (args.item as any)?.id as string | undefined;
    const editor = containerRef.current?.documentEditor;
    const ctx: Ctx = { editor };

    // Handle our built-in mappings: id is "builtin_<Name>"
    if (id?.startsWith('builtin_')) {
      const name = id.replace('builtin_', '');
      const mapping = SUPPORTED_BUILTINS[name];
      if (mapping) {
        mapping.onClick(ctx);
        return;
      }
    }

    // Your custom items:
    if (id === 'custom_say_hello') {
      editor?.editor.insertText(' 👋 Hello!');
      args.event?.preventDefault?.();
      return;
    }
    if (id === 'custom_save_docx') {
      editor?.save('document', 'Docx');
      return;
    }
  };

  // Enable/disable specific built-ins (by name) after render
  useEffect(() => {
    if (!isReady) return;
    const toolbarApi = (containerRef.current as any)?.toolbar;
    if (!toolbarApi) return;

    const currentItems = (toolbarApi.items ?? []) as any[];

    // Build index map by our normalized item ids
    const indexById = new Map<string, number[]>();
    currentItems.forEach((it, idx) => {
      const id = it?.id as string | undefined;
      if (!id) return;
      if (!indexById.has(id)) indexById.set(id, []);
      indexById.get(id)!.push(idx);
    });

    try {
      // enable all first
      for (let i = 0; i < currentItems.length; i++) toolbarApi.enableItems(i, true);

      // then disable requested built-ins
      disabledBuiltins.forEach((name) => {
        const ids = indexById.get(`builtin_${name}`);
        ids?.forEach((i) => toolbarApi.enableItems(i, false));
      });
    } catch {}
  }, [isReady, normalizedItems, disabledBuiltins]);

  return (
    <div className="w-full">
      <DocumentEditorContainerComponent
        ref={containerRef}
        id="docx-editor"
        height={height}
        showPropertiesPane={showPropertiesPane}
        enableToolbar={true}
        // ✅ Always pass object models, never raw strings
        toolbarItems={normalizedItems as any}
        toolbarClick={onToolbarClick}
        created={onCreated}
        serviceUrl={serviceUrl}
      />
    </div>
  );
}
