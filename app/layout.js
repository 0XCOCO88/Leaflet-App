export const metadata = {
  title: "Leaflet Gizi Generator — Fika Nurul Uyun",
  description: "Generator otomatis leaflet diet RS dari file Word",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Nunito', sans-serif; background: #0c1117; color: #fff; }
          button { font-family: inherit; }
          @media print {
            body { background: white; }
            .no-print { display: none !important; }
            .print-page { page-break-after: always; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
