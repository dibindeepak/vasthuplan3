import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AIA Architectural Drawing Studio',
  description: 'Architectural drawing and title block template studio with AIA standard drawing sheets, automatic blueprint scale adjustment, 2D drafting blocks, cloud project sharing, and instant PDF export.',
  openGraph: {
    title: 'AIA Architectural Drawing Studio',
    description: 'Architectural drawing and title block template studio with AIA standard drawing sheets, automatic blueprint scale adjustment, 2D drafting blocks, cloud project sharing, and instant PDF export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIA Architectural Drawing Studio',
    description: 'Architectural drawing and title block template studio with AIA standard drawing sheets, automatic blueprint scale adjustment, 2D drafting blocks, cloud project sharing, and instant PDF export.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
