import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuildCore Elite | Luxury Contractor Services',
  description: 'Premier general contractor specializing in plumbing systems, school construction, and large-scale renovations.',
  keywords: 'contractor, construction, plumbing, renovations, commercial',
  openGraph: {
    title: 'BuildCore Elite',
    description: 'Luxury-grade construction services',
    url: 'https://buildcoreelite.com',
    siteName: 'BuildCore Elite',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0e27" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-elite-dark text-white">
        {children}
      </body>
    </html>
  );
}
