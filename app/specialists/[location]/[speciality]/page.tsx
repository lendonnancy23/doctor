import { notFound } from 'next/navigation';
import Link from 'next/link';
import { clientPromise } from '@/lib/mongodb';
import styles from '../../../HomePage.module.css';

interface Params {
  location: string;
  speciality: string;
}

async function getDoctors(location: string, speciality: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  // Use flexible regex for both location and speciality (case-insensitive, ignore dashes and spaces)
  const locationRegex = new RegExp(location.replace(/[-_]/g, ' '), 'i');
  const specialityRegex = new RegExp(speciality.replace(/-/g, ' '), 'i');
  const doctors = await db.collection('doctor_info').find({
    Location: { $regex: locationRegex },
    Speciality: { $regex: specialityRegex }
  }).toArray();
  return doctors;
}

export default async function SpecialityPage({ params }: { params: Params }) {
  const location = decodeURIComponent(params.location);
  const speciality = decodeURIComponent(params.speciality);
  const doctors = await getDoctors(location, speciality);

  if (!doctors.length) {
    return (
      <div className={styles.errorContainer}>
        <h1>No doctors found for {speciality} in {location}.</h1>
        <Link href="/">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>
        {speciality.replace(/-/g, ' ')} Doctors in {location}
      </h1>
      <div className={styles.doctorCardGrid}>
        {doctors.map((doctor: any) => (
          <Link href={`/${doctor.Slug}`} key={doctor.Slug} className={styles.doctorCard}>
            <div className={styles.doctorCardContent}>
              <div className={styles.doctorCardHeader}>
                <div className={styles.doctorName}>{doctor["Doctor Name"]}</div>
                <div className={styles.doctorSpecialty}>{doctor.Designation || doctor.Speciality}</div>
                <div className={styles.hospitalName}>{doctor["Hospital Name"]}</div>
                <div className={styles.location}>{doctor.Location}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
