import { MetadataRoute } from 'next';
import { clientPromise } from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://topdoctorlist.com';

  // Get all doctors from the database
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const doctors = await db.collection('doctor_info')
    .find({})
    .project({ "Doctor Name": 1, "Last Modified": 1 })
    .toArray();

  // Create doctor profile URLs
  const doctorUrls = doctors.map((doctor) => ({
    url: `${baseUrl}/${encodeURIComponent(doctor["Doctor Name"])}`,
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

  // Specialty pages will be added when implemented
  const specialtyUrls: MetadataRoute.Sitemap = [];

  // Location pages will be added when implemented
  const locationUrls: MetadataRoute.Sitemap = [];

  return [
    ...staticPages,
    ...doctorUrls,
    ...specialtyUrls,
    ...locationUrls
  ];
}