'use client';

import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaHospital, FaGraduationCap } from 'react-icons/fa';
import PlaceholderImage from './PlaceholderImage';
import styles from './DoctorInfo.module.css';

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

interface DoctorInfoProps {
  doctor: Doctor;
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctor }) => {
  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className={styles.doctorInfoContainer}>
      <div className={styles.mainContent}>
        <section className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.imageContainer}>
              {isValidUrl(doctor["Photo URL"]) ? (
                <Image
                  src={doctor["Photo URL"]}
                  alt={doctor["Doctor Name"]}
                  className={styles.doctorImage}
                  width={320}
                  height={320}
                  priority={true}
                  quality={90}
                  sizes="(max-width: 768px) 260px, 320px"
                />
              ) : (
                <PlaceholderImage 
                  width={320} 
                  height={320} 
                  className={styles.doctorImage}
                />
              )}
            </div>

            <div className={styles.doctorDetails}>
              <h1 className={styles.doctorName}>{doctor["Doctor Name"]}</h1>
              <div className={styles.credentials}>
                <p className={styles.specialty}>{doctor.Speciality}</p>
                <p className={styles.designation}>{doctor.Designation}</p>
                <p className={styles.workplace}>{doctor.Workplace}</p>
              </div>
              <div className={styles.degree}>
                <h3>
                  <FaGraduationCap style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Degrees & Certifications
                </h3>
                <p>{doctor.Degree}</p>
              </div>
            </div>
          </div>

          <div className={styles.aboutSection}>
            <h3>About Dr. {doctor["Doctor Name"].split(' ')[0]}</h3>
            <p>{doctor.About}</p>
          </div>
        </section>

        <section className={styles.chamberSection}>
          <h3 className={styles.sectionTitle}>Practice Information</h3>
          <div className={styles.chamberCard}>
            <div className={styles.chamberInfo}>
              <div className={styles.infoGroup}>
                <FaHospital className={styles.infoIcon} />
                <div>
                  <h4>Hospital</h4>
                  <p>{doctor["Hospital Name"]}</p>
                </div>
              </div>

              <div className={styles.infoGroup}>
                <FaMapMarkerAlt className={styles.infoIcon} />
                <div>
                  <h4>Location</h4>
                  <p>{doctor.Address}</p>
                  <p className={styles.subText}>{doctor.Location}</p>
                </div>
              </div>

              <div className={styles.infoGroup}>
                <FaClock className={styles.infoIcon} />
                <div>
                  <h4>Visiting Hours</h4>
                  <p>{doctor["Visiting Hours"]}</p>
                </div>
              </div>

              <div className={styles.infoGroup}>
                <FaPhoneAlt className={styles.infoIcon} />
                <div>
                  <h4>Appointment</h4>
                  <a 
                    href={`tel:${doctor["Appointment Number"]}`} 
                    className={styles.phoneLink}
                  >
                    <FaPhoneAlt style={{ fontSize: '1rem' }} />
                    {doctor["Appointment Number"]}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorInfo;
