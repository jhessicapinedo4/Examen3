// app/layout.tsx
import './globals.css';
import Navbar from '@/components/Nabvar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Chocolover | Pastelería Online',
  description: 'Ecommerce de tortas y postres artesanales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
