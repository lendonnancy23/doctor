import { notFound } from 'next/navigation';
import Link from 'next/link';
import { clientPromise } from '@/lib/mongodb';
import styles from '../../../HomePage.module.css';
import { Metadata } from 'next';

interface Props {
  params: { location: string; speciality: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = decodeURIComponent(params.location);
  const speciality = decodeURIComponent(params.speciality).replace(/-/g, ' ');
  
  const title = `Best ${speciality} Doctors in ${location} - Book Appointments Online`;
  const description = `Find and book appointments with top ${speciality} specialists in ${location}. View detailed profiles, qualifications, chamber locations and contact numbers of the best ${speciality} doctors.`;

  return {
    title,
    description,
    keywords: [
      `${speciality} doctors ${location}`,
      `best ${speciality} specialist ${location}`,
      `${speciality} specialist near me`,
      'doctor appointment',
      'online doctor booking',
      location,
      speciality,
      'medical specialist'
    ],
    openGraph: {
      title,
      description,
      url: `https://topdoctorlist.com/specialists/${encodeURIComponent(location)}/${params.speciality}`,
      siteName: 'TopDoctorList',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

async function getDoctors(location: string, speciality: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    // Convert URL-friendly format back to proper speciality name
    const formattedSpeciality = speciality.replace(/-/g, ' ');
    
    // Get doctors matching the location and specialty exactly (case-insensitive)
    const doctors = await db.collection('doctor_info')
      .find({
        Location: { $regex: new RegExp(`^${location}$`, 'i') },
        Speciality: { $regex: new RegExp(`^${formattedSpeciality}$`, 'i') }
      })
      .sort({ 'Rating': -1, 'Experience Years': -1 })
      .toArray();
    
    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export default async function SpecialityPage({ params }: Props) {
  const location = decodeURIComponent(params.location);
  const speciality = decodeURIComponent(params.speciality);
  const formattedSpeciality = speciality.replace(/-/g, ' ');
  const doctors = await getDoctors(location, speciality);

  if (!doctors.length) {
    return (
      <div className={styles.errorContainer}>
        <h1>No {formattedSpeciality} doctors found in {location}</h1>
        <p>Try searching for a different specialty or location.</p>
        <Link href="/" className={styles.backButton}>Return to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.sectionTitle}>
          Best {formattedSpeciality} Doctors in {location}
        </h1>
        <p className={styles.pageDescription}>
          Find and book appointments with the top {formattedSpeciality} specialists in {location}. 
          View detailed profiles, qualifications, chamber timings, and book appointments online.
        </p>
      </div>

      <div className={styles.doctorCardGrid}>
        {doctors.map((doctor: any) => (
          <Link href={`/${doctor.Slug}`} key={doctor.Slug} className={styles.doctorCard}>
            <div className={styles.doctorCardContent}>
              <div className={styles.doctorCardHeader}>
                <div className={styles.doctorName}>{doctor["Doctor Name"]}</div>
                <div className={styles.doctorSpecialty}>
                  {doctor.Designation || formattedSpeciality}
                </div>
                <div className={styles.doctorDegree}>{doctor.Degree}</div>
                <div className={styles.hospitalName}>{doctor["Hospital Name"]}</div>
                <div className={styles.doctorContact}>
                  <div className={styles.doctorLocation}>📍 {doctor.Location}</div>
                  {doctor["Visiting Hours"] && (
                    <div className={styles.visitingHours}>⏰ {doctor["Visiting Hours"]}</div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
