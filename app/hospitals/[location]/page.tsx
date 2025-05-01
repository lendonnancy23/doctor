import { clientPromise } from '@/lib/mongodb';
import Link from 'next/link';
import styles from './LocationHospitals.module.css';
import { Metadata } from 'next';

interface Props {
  params: { location: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = decodeURIComponent(params.location);
  return {
    title: `All Hospital List at ${location} — Find Doctors & Visiting Info`,
    description: `Browse all hospitals in ${location}. View hospital profiles, doctor lists, chamber addresses, visiting hours, and contact numbers to book appointments easily.`,
    openGraph: {
      title: `All Hospital List at ${location} — Find Doctors & Visiting Info`,
      description: `Browse all hospitals in ${location}. View hospital profiles, doctor lists, chamber addresses, visiting hours, and contact numbers to book appointments easily.`,
      url: `https://topdoctorlist.com/hospitals/${encodeURIComponent(location)}`,
      siteName: 'TopDoctorList',
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function LocationHospitalsPage({ params }: Props) {
  const location = decodeURIComponent(params.location);
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  // Get all hospitals and their doctors for this location
  const doctors = await db.collection('doctor_info').find({ Location: location }).toArray();
  const hospitals = Array.from(new Set(doctors.map(doc => doc["Hospital Name"])));

  if (!hospitals.length) {
    return (
      <div className={styles.errorContainer}>
        <h1>No hospitals found in {location}.</h1>
        <Link href="/">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        All Hospital List at {location} — Find Doctors & Visiting Info
      </h1>
      <p className={styles.intro}>
        If you're searching for the best hospitals in {location}, you're in the right place.<br />
        This page offers a complete list of hospitals located in and around {location}, along with links to their doctor profiles, specialties, chamber times, and appointment details. Whether you're looking for a general physician, specialist, or diagnostic center — find the right care below.
      </p>
      <h2 className={styles.sectionTitle}>
        Best Hospitals and Diagnostic center in {location}
      </h2>
      <ul className={styles.hospitalList}>
        {hospitals.map(hospital => {
          const hospitalDoctors = doctors.filter(doc => doc["Hospital Name"] === hospital);
          return (
            <li key={hospital} className={styles.hospitalCard}>
              <div className={styles.hospitalCardContent}>
                <h3 className={styles.hospitalName}>{hospital}</h3>
                <Link href={`/hospitals/${encodeURIComponent(location)}/${hospital.replace(/\s+/g, '-').toLowerCase()}`}
                  className={styles.hospitalDoctorsLink}>
                  View all doctors at {hospital}
                </Link>
                <div className={styles.doctorPreviewList}>
                  {hospitalDoctors.slice(0, 3).map(doc => (
                    <div key={doc["Doctor Name"]} className={styles.doctorPreviewCard}>
                      <div className={styles.doctorName}>{doc["Doctor Name"]}</div>
                      <div className={styles.doctorSpecialty}>Specialty: {doc.Speciality}</div>
                      <div className={styles.doctorVisiting}>Visiting: {doc["Visiting Hours"]}</div>
                      <div className={styles.doctorAppointment}>Appointment: <a href={`tel:${doc["Appointment Number"]}`}>{doc["Appointment Number"]}</a></div>
                      <Link href={`/${doc.Slug}`} className={styles.doctorProfileLink}>View Profile ➝</Link>
                    </div>
                  ))}
                </div>
                {hospitalDoctors.length > 3 && (
                  <div className={styles.moreDoctorsLink}>
                    <Link href={`/hospitals/${encodeURIComponent(location)}/${hospital.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                      ...and {hospitalDoctors.length - 3} more doctors
                    </Link>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
