import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seven B Hôtel — Digital Signage TV',
  description: 'Affichage dynamique et gestion des annonces sur écran TV pour Seven B Hôtel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
