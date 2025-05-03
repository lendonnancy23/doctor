import { notFound } from 'next/navigation';
import Link from 'next/link';
import { clientPromise } from '@/lib/mongodb';
import styles from './SpecialityPage.module.css';
import { Metadata } from 'next';

interface Props {
  params: {
    location: string;
    speciality: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = decodeURIComponent(params.location);
  const speciality = decodeURIComponent(params.speciality).replace(/-/g, ' ');
  
  return {
    title: `Best ${speciality} Doctors in ${location} - Find & Book Appointments`,
    description: `Discover the top-rated ${speciality} doctors in ${location}. Check qualifications, chamber address, visiting hours, and book appointments directly with trusted specialists.`,
    openGraph: {
      title: `Top ${speciality} Specialists in ${location}`,
      description: `Find and book appointments with the best ${speciality} doctors in ${location}. View detailed profiles, qualifications, chamber timings, and contact information.`,
    },
  };
}

async function getDoctors(location: string, speciality: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    const formattedSpeciality = speciality.replace(/-/g, ' ');
    
    const doctors = await db.collection('doctor_info')
      .find({
        Location: { $regex: new RegExp(`^${location}$`, 'i') },
        Speciality: { $regex: new RegExp(`^${formattedSpeciality}$`, 'i') }
      })
      .sort({ 'Rating': -1, 'Experience Years': -1 })
      .toArray();

    // Get related specialities
    const relatedSpecialities = await db.collection('doctor_info')
      .distinct('Speciality', {
        Location: { $regex: new RegExp(`^${location}$`, 'i') },
        Speciality: { $ne: formattedSpeciality }
      });
    
    return { doctors, relatedSpecialities };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return { doctors: [], relatedSpecialities: [] };
  }
}

export default async function SpecialityPage({ params }: Props) {
  const location = decodeURIComponent(params.location);
  const speciality = decodeURIComponent(params.speciality);
  const formattedSpeciality = speciality.replace(/-/g, ' ');
  const { doctors, relatedSpecialities } = await getDoctors(location, speciality);

  if (!doctors.length) {
    return (
      <div className={styles.errorContainer}>
        <h1>No {formattedSpeciality} doctors found in {location}</h1>
        <p>Try searching for a different specialty or location.</p>
        <Link href="/" className={styles.backButton}>Return to Home</Link>
      </div>
    );
  }

  const randomRelatedSpecialities = relatedSpecialities
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.sectionTitle}>
          Best {formattedSpeciality} Doctors in {location}
        </h1>
        <p className={styles.pageDescription}>
          Need expert care from a qualified {formattedSpeciality.toLowerCase()} doctor in {location}? 
          Here's a carefully curated list of doctors who specialize in {formattedSpeciality.toLowerCase()}, 
          serving patients at reputed hospitals and clinics throughout {location}.
        </p>
      </div>

      <section className={styles.mainSection}>
        <h2 className={styles.sectionSubtitle}>
          Find the Best {formattedSpeciality} Doctors in {location}
        </h2>
        <p className={styles.sectionText}>
          All profiles include chamber times, contact details, and hospital affiliations 
          to help you make the right choice for your healthcare. Our listed doctors are 
          verified for their qualifications and experience in {formattedSpeciality.toLowerCase()} care.
        </p>

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
                </div>
                <div className={styles.doctorContact}>
                  <div className={styles.doctorLocation}>📍 {doctor.Address || doctor.Location}</div>
                  {doctor["Visiting Hours"] && (
                    <div className={styles.visitingHours}>⏰ {doctor["Visiting Hours"]}</div>
                  )}
                  {doctor["Appointment Number"] && (
                    <div className={styles.appointmentNumber}>📞 {doctor["Appointment Number"]}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.infoSection}>
        <h2 className={styles.sectionSubtitle}>
          Why Choose a {formattedSpeciality} Doctor in {location}?
        </h2>
        <div className={styles.infoContent}>
          <p className={styles.sectionText}>
            {formattedSpeciality} specialists are essential for providing expert care in their field, 
            using advanced techniques and years of experience to diagnose and treat various conditions. 
            {location} is home to many experienced {formattedSpeciality.toLowerCase()} doctors who have 
            established themselves at leading hospitals and clinics.
          </p>
          <p className={styles.sectionText}>
            Our platform simplifies your search for the right {formattedSpeciality.toLowerCase()} specialist 
            by providing comprehensive information about each doctor's qualifications, experience, chamber 
            location, and appointment procedures. This helps you make an informed decision about your 
            healthcare provider.
          </p>
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionSubtitle}>
          FAQs About {formattedSpeciality} Doctors in {location}
        </h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqCard}>
            <h3 className={styles.faqQuestion}>
              Who is the best {formattedSpeciality.toLowerCase()} doctor in {location}?
            </h3>
            <p className={styles.faqAnswer}>
              The list above features top doctors verified for their qualifications and experience. 
              Each doctor is ranked based on their expertise, patient feedback, and years of experience 
              in {formattedSpeciality.toLowerCase()} care.
            </p>
          </div>
          <div className={styles.faqCard}>
            <h3 className={styles.faqQuestion}>
              How can I contact a {formattedSpeciality.toLowerCase()} doctor for an appointment?
            </h3>
            <p className={styles.faqAnswer}>
              You can directly call the appointment number listed on each doctor's profile. 
              Additionally, you can view their full profile for more contact options and chamber details.
            </p>
          </div>
          <div className={styles.faqCard}>
            <h3 className={styles.faqQuestion}>
              Do doctors offer weekend consultations in {location}?
            </h3>
            <p className={styles.faqAnswer}>
              Yes, many {formattedSpeciality.toLowerCase()} doctors have weekend hours. Check individual 
              profiles for specific visiting hours and availability. It's recommended to call ahead and 
              confirm the timing.
            </p>
          </div>
        </div>
      </section>

      {randomRelatedSpecialities.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.sectionSubtitle}>
            Related Specialities in {location}
          </h2>
          <div className={styles.relatedLinks}>
            {randomRelatedSpecialities.map((relatedSpeciality: string) => (
              <Link
                key={relatedSpeciality}
                href={`/specialists/${encodeURIComponent(location)}/${relatedSpeciality.toLowerCase().replace(/\s+/g, '-')}`}
                className={styles.relatedLink}
              >
                Best {relatedSpeciality} Doctors in {location}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
