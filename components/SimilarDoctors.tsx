'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PlaceholderImage from './PlaceholderImage';
import styles from './SimilarDoctors.module.css';

interface Doctor {
  "Doctor Name": string;
  "Photo URL": string;
  Degree: string;
  Speciality: string;
  Designation: string;
  "Hospital Name": string;
  Location: string;
  Slug: string;
}

interface SimilarDoctorsProps {
  currentDoctorName: string;
  speciality: string;
}

const SimilarDoctors: React.FC<SimilarDoctorsProps> = ({ currentDoctorName, speciality }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors?speciality=${encodeURIComponent(speciality)}&exclude=${encodeURIComponent(currentDoctorName)}&limit=4`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch similar doctors');
        }
        
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error('Error fetching similar doctors:', err);
        setError(err instanceof Error ? err.message : 'Error loading similar doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarDoctors();
  }, [speciality, currentDoctorName]);

  if (loading) {
    return (
      <section className={styles.similarDoctors}>
        <h2 className={styles.sectionTitle}>
          Similar {speciality} Specialists
          <span className={styles.titleAccent} />
        </h2>
        <div className={styles.doctorGrid}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${styles.doctorCard} ${styles.skeleton}`}>
              <div className={styles.imageWrapper}>
                <div className={styles.skeletonImage} />
              </div>
              <div className={styles.doctorInfo}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  if (doctors.length === 0) {
    return null;
  }

  return (
    <section className={styles.similarDoctors}>
      <h2 className={styles.sectionTitle}>
        Similar {speciality} Specialists
        <span className={styles.titleAccent} />
      </h2>
      
      <div className={styles.doctorGrid}>
        {doctors.map((doctor) => (
          <Link
            href={`/${doctor.Slug}`}
            key={doctor["Doctor Name"]}
            className={styles.doctorCard}
          >
            <div className={styles.imageWrapper}>
              {doctor["Photo URL"] ? (
                <Image
                  src={doctor["Photo URL"]}
                  alt={doctor["Doctor Name"]}
                  width={120}
                  height={120}
                  className={styles.doctorImage}
                  loading="lazy"
                />
              ) : (
                <PlaceholderImage width={120} height={120} />
              )}
            </div>
            
            <div className={styles.doctorInfo}>
              <h3 className={styles.doctorName}>Dr. {doctor["Doctor Name"]}</h3>
              <p className={styles.designation}>{doctor.Designation}</p>
              <p className={styles.hospital}>{doctor["Hospital Name"]}</p>
              <p className={styles.location}>{doctor.Location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SimilarDoctors;