import { Metadata } from 'next';
import DoctorPageClient from './DoctorPageClient';
import { clientPromise } from '@/lib/mongodb';

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const doctor = await db.collection('doctor_info').findOne({ Slug: slug });

    if (!doctor) {
      return {
        title: 'Doctor Not Found - TopDoctorList',
        description: 'The requested doctor profile could not be found.',
      };
    }

    const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_BASE_URL);
    ogImageUrl.searchParams.set('name', doctor['Doctor Name']);
    ogImageUrl.searchParams.set('specialty', doctor['Speciality']);
    ogImageUrl.searchParams.set('hospital', doctor['Hospital Name']);

    const title = `${doctor['Doctor Name']} - ${doctor['Speciality']} | TopDoctorList`;
    const description = `Book an appointment with ${doctor['Doctor Name']}, a ${doctor['Speciality']} at ${doctor['Hospital Name']}. View qualifications, experience, location, and contact details.`;

    return {
      title,
      description,
      keywords: [
        doctor['Doctor Name'],
        doctor['Speciality'],
        'doctor appointment',
        'medical specialist',
        doctor['Location'],
        'healthcare',
        'bangladesh doctors'
      ],
      openGraph: {
        title,
        description,
        url: `https://topdoctorlist.com/${doctor['Slug']}`,
        siteName: 'TopDoctorList',
        images: [
          {
            url: ogImageUrl.toString(),
            width: 1200,
            height: 630,
            alt: `Book an appointment with ${doctor['Doctor Name']}`
          }
        ],
        type: 'profile',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl.toString()],
        creator: '@topdoctorlist',
        site: '@topdoctorlist'
      },
      alternates: {
        canonical: `https://topdoctorlist.com/${doctor['Slug']}`
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Doctor Profile - TopDoctorList',
      description: 'View doctor profile and book appointments.',
    };
  }
}

export default async function DoctorPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const doctor = await db.collection('doctor_info').findOne({ Slug: slug });

    if (!doctor) {
      return (
        <div className="error-container">
          <h1>Doctor Not Found</h1>
          <p>The requested doctor profile could not be found.</p>
        </div>
      );
    }

    // Map MongoDB result to Doctor interface explicitly
    const doctorData = {
      "Doctor Name": doctor["Doctor Name"] ?? "",
      "Photo URL": doctor["Photo URL"] ?? "",
      Degree: doctor.Degree ?? "",
      Speciality: doctor.Speciality ?? "",
      Designation: doctor.Designation ?? "",
      Workplace: doctor.Workplace ?? "",
      About: doctor.About ?? "",
      "Hospital Name": doctor["Hospital Name"] ?? "",
      Address: doctor.Address ?? "",
      Location: doctor.Location ?? "",
      "Visiting Hours": doctor["Visiting Hours"] ?? "",
      "Appointment Number": doctor["Appointment Number"] ?? "",
      Slug: doctor["Slug"] ?? ""
    };
    return <DoctorPageClient doctor={doctorData} />;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>Failed to load doctor profile. Please try again later.</p>
      </div>
    );
  }
}