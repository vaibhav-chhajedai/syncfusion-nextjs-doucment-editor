// src/app/_components/SyncfusionSetup.tsx
'use client';

import { useEffect } from "react";
import { registerLicense } from "@syncfusion/ej2-base";

export default function SyncfusionSetup() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY;
    if (key) {
      try { registerLicense(key as string); } catch {}
    }
  }, []);
  return null;
}
