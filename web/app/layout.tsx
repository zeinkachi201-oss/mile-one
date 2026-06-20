import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mile One — Keep Moving Together',
  description: 'Join local run clubs, track your runs live, and build real connections with runners around you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
