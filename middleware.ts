import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MongoClient } from 'mongodb';
import { clientPromise } from '@/lib/mongodb';

// Function to convert old URL format to new slug format
function oldUrlToSlug(str: string): string {
  return str
    .replace(/%20/g, ' ')  // Convert %20 to space
    .replace(/%2C/g, ',')  // Convert %2C to comma
    .replace(/%2E/g, '.')  // Convert %2E to dot
    .replace(/[,.\s]+/g, '-')  // Convert spaces, dots, and commas to hyphens
    .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
    .trim()  // Remove leading/trailing spaces
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Function to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip irrelevant paths
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/static') || 
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname.startsWith('/about') ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/privacy-policy') ||
      pathname.startsWith('/terms') ||
      pathname.startsWith('/specialists') ||
      pathname.startsWith('/hospitals')) {
    return NextResponse.next();
  }

  try {
    // Extract the potential doctor name/slug from the URL
    const urlSegment = pathname.split('/')[1];
    if (!urlSegment) return NextResponse.next();

    const decodedSegment = decodeURIComponent(urlSegment);
    const normalizedSlug = oldUrlToSlug(decodedSegment);
    
    // Connect to MongoDB with timeout and proper typing
    const client: MongoClient = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 5000)
      )
    ]) as MongoClient;

    const db = client.db(process.env.MONGODB_DB_NAME);
    
    // Try to find the doctor using various matching strategies
    const doctor = await db.collection('doctor_info').findOne({
      $or: [
        // Try exact slug match
        { Slug: normalizedSlug },
        // Try exact name match (case insensitive)
        { "Doctor Name": { $regex: new RegExp(`^${escapeRegExp(decodedSegment)}$`, 'i') } },
        // Try normalized name match
        { "Doctor Name": { $regex: new RegExp(`^${escapeRegExp(decodedSegment.replace(/[,.\s]+/g, '[ -.,]'))}$`, 'i') } }
      ]
    });

    if (doctor?.Slug && normalizedSlug !== doctor.Slug) {
      // If found and current URL doesn't match the canonical slug, redirect
      const url = request.nextUrl.clone();
      url.pathname = `/${doctor.Slug}`;
      
      return NextResponse.redirect(url, {
        status: 301,
        headers: {
          'Cache-Control': 'public, max-age=31536000',
          'X-Redirect-Reason': 'URL Migration'
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
    // Match all paths that don't start with excluded prefixes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|about|contact|privacy-policy|terms|specialists|hospitals).*)'
  ]
}