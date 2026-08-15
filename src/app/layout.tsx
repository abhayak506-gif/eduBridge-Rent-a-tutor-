import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'EduBridge | Rent-A-Tutor - Instant Access to Verified Tutors in India',
  description: 'EduBridge is an instant tutor marketplace for students across India. Find verified educators from top institutes (IIT, AIIMS, DU), get AI recommendations, book 15-min instant doubt sessions, and learn live 1-on-1.',
  keywords: ['EduBridge', 'Rent a Tutor', 'Tutor India', 'CBSE Tutors', 'JEE Tutors', 'NEET Tutors', 'Instant Doubt Solving', 'Online Tuition India'],
  authors: [{ name: 'EduBridge Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
