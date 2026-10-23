import '@fontsource-variable/montserrat';
import '../globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SHR Cars — Admin', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f3f4f6] text-gray-800 antialiased" style={{ fontFamily: "'Montserrat Variable', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
