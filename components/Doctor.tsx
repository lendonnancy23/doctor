'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';
import PlaceholderImage from './PlaceholderImage';
import styles from './Doctor.module.css';

interface DoctorProps {
  doctor: {
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
    Slug: string;
  };
  featured?: boolean;
}

const Doctor: React.FC<DoctorProps> = ({ doctor, featured = false }) => {
  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Format doctor name to show Dr. only once if it appears multiple times
  const formatDoctorName = (name: string) => {
    const nameParts = name.split(' ');
    const drIndices = nameParts.reduce((acc: number[], part, index) => {
      if (part.toLowerCase() === 'dr.' || part.toLowerCase() === 'dr') {
        acc.push(index);
      }
      return acc;
    }, []);

    // Keep only the first Dr. occurrence
    if (drIndices.length > 1) {
      drIndices.slice(1).forEach(index => {
        nameParts[index] = '';
      });
    }
    return nameParts.filter(part => part).join(' ');
  };

  return (
    <Link 
      href={`/${doctor.Slug}`}
      className={styles.doctorContainer}
    >
      <div className={styles.doctorHeader}>
        <div className={styles.doctorImageWrapper}>
          {isValidUrl(doctor["Photo URL"]) ? (
            <Image
              src={doctor["Photo URL"]}
              alt={doctor["Doctor Name"]}
              className={styles.doctorImage}
              width={200}
              height={200}
              priority={featured}
              quality={75}
              sizes="(max-width: 768px) 120px, 140px"
              loading={featured ? "eager" : "lazy"}
              unoptimized={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add(styles.error);
              }}
            />
          ) : (
            <PlaceholderImage 
              width={140} 
              height={140} 
              className={styles.doctorImage}
            />
          )}
        </div>
        
        <div className={styles.doctorInfo}>
          <h2 className={styles.doctorName}>{formatDoctorName(doctor["Doctor Name"])}</h2>
          <p className={styles.doctorSpecialty}>{doctor.Designation || doctor.Speciality}</p>
          <p className={styles.hospitalName}>{doctor["Hospital Name"]}</p>
          <p className={styles.location}>
            <FaMapMarkerAlt />
            {doctor.Location}
          </p>
        </div>
      </div>

      <div className={styles.viewProfileButton}>
        View Full Profile
      </div>
    </Link>
  );
};

export default Doctor;
