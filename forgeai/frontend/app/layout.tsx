import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ForgeAI | Industrial Digital Twin & Predictive Maintenance Engine',
  description: 'Real-time AI-powered digital twin, anomaly detection, and RUL estimation dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
