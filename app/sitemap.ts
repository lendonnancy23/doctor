import { MetadataRoute } from 'next';
import { clientPromise } from '@/lib/mongodb';

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return match;
    }
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://topdoctorlist.com';

  // Get all doctors from the database
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const doctors = await db.collection('doctor_info')
    .find({})
    .project({ Slug: 1, "Last Modified": 1 })
    .toArray();

  // Create doctor profile URLs
  const doctorUrls = doctors.map((doctor) => ({
    url: escapeXml(`${baseUrl}/${doctor.Slug}`),
    lastModified: doctor["Last Modified"] || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    }
  ];

  // Specialty/location pages
  const specialtyPages = [];
  // Get all unique locations and specialties
  const locations = await db.collection('doctor_info').distinct('Location');
  for (const location of locations) {
    const specialties = await db.collection('doctor_info').distinct('Speciality', { Location: location });
    for (const specialty of specialties) {
      const slug = specialty.toLowerCase().replace(/\s+/g, '-');
      specialtyPages.push({
        url: escapeXml(`${baseUrl}/specialists/${encodeURIComponent(location)}/best-${slug}`),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      });
    }
  }

  // Hospital pages
  const hospitalPages = [];
  // Get all unique hospitals and their locations
  const hospitalData = await db.collection('doctor_info').aggregate([
    {
      $group: {
        _id: {
          hospital: '$Hospital Name',
          location: '$Location'
        },
        lastModified: { $max: '$Last Modified' }
      }
    }
  ]).toArray();

  // Add hospital location pages
  const uniqueLocations = new Set(hospitalData.map(item => item._id.location));
  for (const location of uniqueLocations) {
    hospitalPages.push({
      url: escapeXml(`${baseUrl}/hospitals/${encodeURIComponent(location)}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    });
  }

  // Add individual hospital pages
  for (const data of hospitalData) {
    const hospitalSlug = data._id.hospital.toLowerCase().replace(/\s+/g, '-');
    hospitalPages.push({
      url: escapeXml(`${baseUrl}/hospitals/${encodeURIComponent(data._id.location)}/${encodeURIComponent(hospitalSlug)}`),
      lastModified: data.lastModified || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    });
  }

  return [
    ...staticPages,
    ...doctorUrls,
    ...specialtyPages,
    ...hospitalPages
  ];
}