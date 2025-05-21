import type { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import { Montserrat, Lato } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Foro Hippo - Comunidad de Conocimiento',
  description:
    'Un espacio para compartir conocimiento y conectar con mentes brillantes en el Foro Hippo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${montserrat.variable} ${lato.variable}`}>
      <body className={`font-lato antialiased`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
