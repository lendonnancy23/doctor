import React, { Suspense } from 'react';
import Loading from '../components/Loading';
import ErrorBoundary from '../components/ErrorBoundary';
import dynamic from 'next/dynamic';

// Dynamically import the client components
const HomePageContent = dynamic(() => import('../components/HomePageContent'), {
  loading: () => <Loading />,
  ssr: true
});

interface Doctor {
  "Doctor Name": string;
  "Photo URL": string;
  Degree: string;
  Speciality: string;
  Designation: string;
  "Hospital Name": string;
  Address: string;
  Location: string;
}

export interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: 'Find Doctors by Name, Speciality, Location | Doctor Finder',
  description: 'Search for qualified doctors in Bangladesh by name, speciality, or location. View detailed profiles, credentials, and book appointments with healthcare professionals.',
};

export const revalidate = 60; // Revalidate this page every 60 seconds

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <HomePageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
