import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Faraday Cup Controller',
  description: 'Web interface for controlling Faraday Cup experiments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

