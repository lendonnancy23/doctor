'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import SimilarDoctors from '@/components/SimilarDoctors';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import heavy components
const DoctorInfo = dynamic(() => import('@/components/DoctorInfo'), {
  loading: () => <Loading />,
  ssr: true
});

interface Doctor {
  "Doctor Name": string;
  "Photo URL": string;
  Degree: string;
  Speciality: string;
  Designation: string;
  Workplace: string;
  About: string;
  "Hospital Name": string;
  Address: string;
  Location: string;
  "Visiting Hours": string;
  "Appointment Number": string;
}

interface DoctorPageClientProps {
  doctor: Doctor;
}

export default function DoctorPageClient({ doctor }: DoctorPageClientProps) {
  const router = useRouter();

  if (!doctor) {
    return (
      <div className={styles.errorContainer}>
        <h2>Doctor Not Found</h2>
        <button 
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Suspense fallback={<Loading />}>
        <DoctorInfo doctor={doctor} />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <SimilarDoctors 
          currentDoctorName={doctor["Doctor Name"]}
          speciality={doctor.Speciality}
        />
      </Suspense>
    </div>
  );
}