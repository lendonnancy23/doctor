import React, { Suspense } from 'react';
import Loading from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const HomePageContent = dynamic(() => import('@/components/HomePageContent'), {
  loading: () => <Loading />,
  ssr: true
});

export const metadata: Metadata = {
  title: 'Doctor Finder Bangladesh - Find & Book Doctor Appointments Online',
  description: 'Find the best doctors in Bangladesh. Search by specialty, location, or hospital. Read verified reviews, check qualifications, and book appointments online instantly.',
  keywords: [
    'doctor appointment bangladesh',
    'find doctor bangladesh',
    'book doctor appointment',
    'best doctors dhaka',
    'medical specialists bangladesh',
    'online doctor booking',
    'doctor consultation bangladesh'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Doctor Finder Bangladesh - Find & Book Doctor Appointments Online',
    description: 'Find the best doctors in Bangladesh. Search by specialty, location, or hospital. Read verified reviews and book appointments online.',
    type: 'website',
    url: '/',
    siteName: 'Doctor Finder Bangladesh',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Doctor Finder Bangladesh'
    }]
  }
};

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <HomePageContent />
      </Suspense>
    </ErrorBoundary>
  );
}