'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from './Loading';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading for 500ms

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && children}
    </>
  );
}