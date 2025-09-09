// src/components/WordProcessor.tsx
'use client';

import { useEffect, useRef } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  // types
  DocumentEditorContainer
} from "@syncfusion/ej2-react-documenteditor";

// inject the built-in toolbar into the container
DocumentEditorContainerComponent.Inject(Toolbar);

export default function WordProcessor() {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);

  // Optional: load a blank or sample document (SFDT) on mount, client-side only
  useEffect(() => {
    // Example of loading an empty doc:
    const sfdt = JSON.stringify({
      sections: [{ blocks: [{ paragraphs: [{ inlines: [{ text: "Hello Syncfusion Word Processor!" }] }] }], headersFooters: {} }],
      characterFormat: {}, paragraphFormat: {}, background: { color: "#ffffff" }
    });
    containerRef.current?.documentEditor.open(sfdt);
  }, []);

  return (
    <div className="w-full">
      <DocumentEditorContainerComponent
        ref={containerRef}
        id="sf-word"
        height="75vh"
        enableToolbar={true}
        // Demo service for open/save DOCX, spell check, etc. — replace for production
        serviceUrl="https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/"
      />
    </div>
  );
}
