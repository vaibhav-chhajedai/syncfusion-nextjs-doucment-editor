// src/app/layout.tsx
export const metadata = {
  title: "Word Processor | Syncfusion + Next.js",
  description: "React Document Editor in Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Syncfusion Fluent 2 theme (covers all EJ2 components) */}
        <link
          rel="stylesheet"
          href="https://cdn.syncfusion.com/ej2/30.2.4/fluent2.css"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {/* Client-only license setup (safe no-op if key missing) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // enable Next.js to load fonts smoothly, etc.
            `,
          }}
        />
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
