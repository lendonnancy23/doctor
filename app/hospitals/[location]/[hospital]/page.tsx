import { Metadata } from 'next';
import { clientPromise } from '@/lib/mongodb';
import Link from 'next/link';
import SchemaOrg from '@/components/SchemaOrg';
import styles from './HospitalPage.module.css';
import { slugify } from '@/lib/utils';

interface Props {
  params: { location: string; hospital: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = decodeURIComponent(params.location);
  const hospitalSlug = decodeURIComponent(params.hospital);
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  // Find a doctor to get the real hospital name
  const doctor = await db.collection('doctor_info').findOne({
    Location: location,
    $expr: { $eq: [ { $toLower: { $replaceAll: { input: "$Hospital Name", find: " ", replacement: "-" } } }, hospitalSlug ] }
  });
  const hospitalName = doctor ? doctor["Hospital Name"] : params.hospital.replace(/-/g, ' ');
  const title = `${hospitalName} Doctor List in ${location} — Specialist Profiles & Visiting Hours`;
  const description = `Discover the updated list of doctors at ${hospitalName} in ${location}. View qualifications, specialties, chamber timings, and contact numbers for easy appointment booking.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://topdoctorlist.com/hospitals/${encodeURIComponent(location)}/${encodeURIComponent(hospitalSlug)}`,
      siteName: 'TopDoctorList',
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function HospitalDoctorListPage({ params }: Props) {
  const location = decodeURIComponent(params.location);
  const hospitalSlug = decodeURIComponent(params.hospital);
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  // Find all doctors for this hospital/location
  const doctors = (await db.collection('doctor_info').find({
    Location: location,
    $expr: { $eq: [ { $toLower: { $replaceAll: { input: "$Hospital Name", find: " ", replacement: "-" } } }, hospitalSlug ] }
  }).toArray()).map((doc: any) => ({
    "Doctor Name": doc["Doctor Name"] ?? "",
    "Photo URL": doc["Photo URL"] ?? "",
    Degree: doc.Degree ?? "",
    Speciality: doc.Speciality ?? "",
    Designation: doc.Designation ?? "",
    Workplace: doc.Workplace ?? "",
    About: doc.About ?? "",
    "Hospital Name": doc["Hospital Name"] ?? "",
    Address: doc.Address ?? "",
    Location: doc.Location ?? "",
    "Visiting Hours": doc["Visiting Hours"] ?? "",
    "Appointment Number": doc["Appointment Number"] ?? "",
    Slug: doc.Slug ?? ""
  }));
  if (!doctors.length) {
    return (
      <div className={styles.errorContainer}>
        <h1>No doctors found for this hospital in {location}.</h1>
        <Link href="/">Return to Home</Link>
      </div>
    );
  }
  const hospitalName = doctors[0]["Hospital Name"];

  // Find other hospitals in the same location
  const otherHospitals = await db.collection('doctor_info').distinct('Hospital Name', { Location: location });
  const relatedHospitals = otherHospitals.filter(h => h !== hospitalName);

  return (
    <div className={styles.hospitalDoctorListContainer}>
      <h1 className={styles.hospitalDoctorListTitle}>
        {hospitalName} doctor list, {location}
      </h1>
      <p className={styles.hospitalDoctorListIntro}>
        {hospitalName} in {location} is known for service excellence and a wide range of specialties. Below is the list of doctors, their degrees, specialties, visiting hours, and contact numbers for appointments.
      </p>
      <h2 className={styles.hospitalDoctorListH2}>
        Best available Doctor List at {hospitalName}, {location}
      </h2>
      <ul className={styles.doctorCardGrid}>
        {doctors.map(doctor => (
          <li key={doctor["Doctor Name"]} className={styles.doctorCard}>
            <div className={styles.doctorCardContent}>
              <div className={styles.doctorCardHeader}>
                <div className={styles.doctorName}>{doctor["Doctor Name"]}</div>
                <div className={styles.doctorSpecialty}><span className={styles.specialtyIcon}>🩺</span> {doctor.Speciality}</div>
              </div>
              <div className={styles.doctorDegree}>{doctor.Degree}</div>
              <div className={styles.doctorVisiting}><span className={styles.visitingIcon}>⏰</span> {doctor["Visiting Hours"]}</div>
              <div className={styles.doctorAppointment}><span className={styles.phoneIcon}>📞</span> <a href={`tel:${doctor["Appointment Number"]}`}>{doctor["Appointment Number"]}</a></div>
              <Link href={`/${doctor.Slug}`} className={styles.doctorProfileLink}>View Full Profile ➝</Link>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.faqSectionCards}>
        <div className={styles.faqCard}>
          <div className={styles.faqQ}><span className={styles.faqIcon}>❓</span> How to book an appointment at {hospitalName}?</div>
          <div className={styles.faqA}>Call the appointment number listed for your doctor or use the contact form on their profile page.</div>
        </div>
        <div className={styles.faqCard}>
          <div className={styles.faqQ}><span className={styles.faqIcon}>⏰</span> What are the visiting hours?</div>
          <div className={styles.faqA}>Check the visiting hours listed for each doctor above.</div>
        </div>
        <div className={styles.faqCard}>
          <div className={styles.faqQ}><span className={styles.faqIcon}>🏥</span> Does {hospitalName} offer [Specialty]?</div>
          <div className={styles.faqA}>See the specialties listed for each doctor. For more, contact the hospital directly.</div>
        </div>
      </div>
      {relatedHospitals.length > 0 && (
        <div className={styles.otherHospitalsSectionCard}>
          <div className={styles.otherHospitalsTitle}>Other Hospitals in {location}</div>
          <ul className={styles.otherHospitalsListPills}>
            {relatedHospitals.map(h => (
              <li key={h}>
                <Link href={`/hospitals/${encodeURIComponent(location)}/${slugify(h)}`}>{h}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}