import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Suspense } from 'react';
import Loading from '@/components/Loading';

interface LayoutProps {
  children: React.ReactNode;
  doctors: React.ReactNode;
}

export default function MainLayout({ children, doctors }: LayoutProps) {
  return (
    <>
      <ErrorBoundary>
        <Navbar />
        <main>
          <Suspense fallback={<Loading />}>
            {children}
            {doctors}
          </Suspense>
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}