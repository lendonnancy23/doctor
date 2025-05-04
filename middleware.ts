import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clientPromise } from '@/lib/mongodb';

// Regex to match potential old doctor URLs
const doctorPathRegex = /^\/([^\/]+)$/;

// Function to normalize doctor names for comparison
function normalizeString(str: string): string {
  return str
    .replace(/%20/g, ' ') // First convert %20 to spaces
    .replace(/\./g, '') // Remove dots
    .replace(/\s+/g, '-') // Convert spaces to hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .toLowerCase(); // Convert to lowercase for case-insensitive comparison
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matched = pathname.match(doctorPathRegex);

  if (!matched) {
    return NextResponse.next();
  }

  try {
    const potentialOldName = decodeURIComponent(matched[1]);
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    // Try to find a doctor with this name - first try exact match
    let doctor = await db.collection('doctor_info').findOne({
      "Doctor Name": { $regex: new RegExp(`^${potentialOldName.replace(/[-%.]/g, '[ -.]')}$`, 'i') }
    });

    // If not found, try normalized name match
    if (!doctor) {
      const normalizedPathName = normalizeString(potentialOldName);
      doctor = await db.collection('doctor_info').findOne({
        $or: [
          { "Doctor Name": { $regex: new RegExp(normalizedPathName.replace(/-/g, '[ -.]'), 'i') } },
          { "Slug": normalizedPathName }
        ]
      });
    }

    // If found and has a different slug, redirect to the new URL
    if (doctor?.Slug && normalizeString(matched[1]) !== normalizeString(doctor.Slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${doctor.Slug}`;
      
      // 301 redirect to the new slug URL
      return NextResponse.redirect(url, {
        status: 301,
        headers: {
          'Cache-Control': 'public, max-age=31536000',
          'X-Redirect-Reason': 'Doctor URL Migration'
        }
      });
    }
  } catch (error) {
    console.error('Redirect middleware error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths that don't start with these prefixes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|about|contact|privacy-policy|terms|specialists|hospitals).*)'
  ]
}