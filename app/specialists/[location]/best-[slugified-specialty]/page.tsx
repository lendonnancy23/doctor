import { clientPromise } from '@/lib/mongodb';
import { Metadata } from 'next';
import Link from 'next/link';
import styles from './SpecialistPage.module.css';
import { slugify } from '@/lib/utils';

interface Props {
  params: { location: string; slugifiedSpeciality: string };
}

function unslugify(slug: string | undefined) {
  if (!slug || typeof slug !== 'string') return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = decodeURIComponent(params.location);
  const specialty = unslugify(params.slugifiedSpeciality);
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  // Try to get a doctor for this location/specialty to get the correct casing from DB
  const doctor = await db.collection('doctor_info').findOne({
    Location: location,
    Speciality: { $regex: new RegExp(`^${specialty}$`, 'i') }
  });
  const dbSpeciality = doctor ? doctor.Speciality : specialty;
  return {
    title: `Best ${dbSpeciality} Doctor in ${location} — Verified Profiles & Chamber Info`,
    description: `Looking for the best ${dbSpeciality.toLowerCase()} in ${location}? Find top-rated doctors with verified profiles, qualifications, visiting hours, hospital affiliations, and direct appointment contacts.`,
    openGraph: {
      title: `Best ${dbSpeciality} Doctor in ${location} — Verified Profiles & Chamber Info`,
      description: `Looking for the best ${dbSpeciality.toLowerCase()} in ${location}? Find top-rated doctors with verified profiles, qualifications, visiting hours, hospital affiliations, and direct appointment contacts.`,
      url: `https://topdoctorlist.com/specialists/${encodeURIComponent(location)}/best-${params.slugifiedSpeciality}`,
      siteName: 'TopDoctorList',
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function SpecialistPage({ params }: Props) {
  const location = decodeURIComponent(params.location);
  const speciality = unslugify(params.slugifiedSpeciality);
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const doctors = await db.collection('doctor_info').find({
    Location: location,
    Speciality: { $regex: new RegExp(`^${speciality}$`, 'i') }
  }).toArray();

  // Get all specialties in this location for internal linking
  const specialities = await db.collection('doctor_info').distinct('Speciality', { Location: location });
  const otherSpecialities = specialities.filter(s => s.toLowerCase() !== speciality.toLowerCase());

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Best {speciality} Doctor in {location} — Verified Profiles & Chamber Info
      </h1>
      <p className={styles.intro}>
        Finding a trusted {speciality.toLowerCase()} doctor in {location} is now easier than ever.<br />
        Below is a handpicked list of qualified and experienced doctors specializing in {speciality.toLowerCase()}, practicing at top hospitals and clinics in {location}. You’ll find detailed profiles, chamber times, and appointment info to help you make the best choice for your health.
      </p>
      <h2 className={styles.sectionTitle}>Top {speciality} Doctors in {location}</h2>
      <ul className={styles.doctorList}>
        {doctors.length === 0 && (
          <li className={styles.noDoctors}>No {speciality.toLowerCase()} doctors found in {location}.</li>
        )}
        {doctors.map(doc => (
          <li key={doc["Doctor Name"]} className={styles.doctorCard}>
            <div className={styles.doctorCardContent}>
              <div className={styles.doctorName}>👨‍⚕️ Dr. {doc["Doctor Name"]}</div>
              <div className={styles.doctorDegree}><b>Degree:</b> {doc.Degree}</div>
              <div className={styles.doctorDesignation}><b>Designation:</b> {doc.Designation}</div>
              <div className={styles.doctorWorkplace}><b>Hospital/Workplace:</b> {doc.Workplace || doc["Hospital Name"]}</div>
              <div className={styles.doctorAddress}><b>Chamber Address:</b> {doc.Address}</div>
              <div className={styles.doctorVisiting}><b>Visiting Hours:</b> {doc["Visiting Hours"]}</div>
              <div className={styles.doctorAppointment}><b>Appointment Phone:</b> <a href={`tel:${doc["Appointment Number"]}`}>{doc["Appointment Number"]}</a></div>
              <Link href={`/${encodeURIComponent(doc["Doctor Name"])}`} className={styles.doctorProfileLink}>View Full Profile ➝</Link>
            </div>
          </li>
        ))}
      </ul>
      <h2 className={styles.sectionTitle}>Why Consult a {speciality} Doctor in {location}?</h2>
      <div className={styles.whySection}>
        <p>{speciality}s play a crucial role in diagnosing and treating conditions related to their field. Whether you need preventive care, ongoing management, or specialized treatment, consulting a qualified {speciality.toLowerCase()} ensures you receive expert attention for your health needs.</p>
        <p>{location} is home to modern hospitals and clinics, offering access to experienced {speciality.toLowerCase()}s and advanced medical facilities. Our platform connects you with verified professionals for peace of mind.</p>
        <p>Booking appointments is simple—just use the contact number provided or view the full profile for more options. Your health journey starts here!</p>
      </div>
      <h2 className={styles.sectionTitle}>FAQs About {speciality} Doctors in {location}</h2>
      <div className={styles.faqSection}>
        <div className={styles.faqQ}><b>Q1. Who is the best {speciality.toLowerCase()} in {location}?</b></div>
        <div className={styles.faqA}>We've listed top {speciality.toLowerCase()} doctors below based on experience and patient care. Click on any profile to view details.</div>
        <div className={styles.faqQ}><b>Q2. How do I book an appointment?</b></div>
        <div className={styles.faqA}>Use the phone number next to each doctor or view their profile for more contact options.</div>
        <div className={styles.faqQ}><b>Q3. Are female {speciality.toLowerCase()} doctors available in {location}?</b></div>
        <div className={styles.faqA}>Yes, you can find both male and female specialists in our list.</div>
      </div>
      {otherSpecialities.length > 0 && (
        <div className={styles.otherSpecialtiesSection}>
          <h2 className={styles.sectionTitle}>Other Specialities Available in {location}</h2>
          <ul className={styles.otherSpecialtiesList}>
            {otherSpecialities.map(s => (
              <li key={s}>
                <Link href={`/specialists/${encodeURIComponent(location)}/best-${slugify(s)}`}>Best {s} Doctors in {location}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
