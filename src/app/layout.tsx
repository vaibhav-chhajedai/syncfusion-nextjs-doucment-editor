// src/app/layout.tsx
export const metadata = {
  title: "Syncfusion Word Processor – Toolbar + Theme",
  description: "Live toolbar customization with theme switcher",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Default theme; the page will swap this href */}
        <link
          id="sf-theme"
          rel="stylesheet"
          href="https://cdn.syncfusion.com/ej2/30.2.4/fluent2-lite.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ minHeight: "100vh", background: "#f6f7fb" }}>{children}</body>
    </html>
  );
}
