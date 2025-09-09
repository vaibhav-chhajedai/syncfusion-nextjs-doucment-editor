'use client';

import dynamic from 'next/dynamic';

// Load the browser-only editor on the client
const WordProcessor = dynamic(() => import('./WordProcessor'), {
  ssr: false,
});

export default function ClientWordProcessor() {
  return <WordProcessor />;
}
