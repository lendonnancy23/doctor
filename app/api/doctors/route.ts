import { NextRequest, NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// CORS and security headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://topdoctorlist.com' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');
    const name = searchParams.get('name');
    const speciality = searchParams.get('speciality');
    const location = searchParams.get('location');
    const hospital = searchParams.get('hospital');
    const sortBy = searchParams.get('sortBy') || 'name';

    // Handle metadata-only requests
    if (searchParams.get('specialties')) {
      const specialties = await db.collection('doctor_info')
        .distinct('Speciality');
      return NextResponse.json({ specialties }, {
        headers: corsHeaders
      });
    }

    if (searchParams.get('locations')) {
      const locations = await db.collection('doctor_info')
        .distinct('Location');
      return NextResponse.json({ locations }, {
        headers: corsHeaders
      });
    }

    if (searchParams.get('hospitals')) {
      const location = searchParams.get('location');
      const query = location ? { Location: location } : {};
      const hospitals = await db.collection('doctor_info')
        .distinct('Hospital Name', query);
      return NextResponse.json({ hospitals }, {
        headers: corsHeaders
      });
    }

    // Build query
    const query: any = {};
    if (name) {
      query['Doctor Name'] = { $regex: name, $options: 'i' };
    }
    if (speciality) {
      query['Speciality'] = { $regex: speciality, $options: 'i' };
    }
    if (location) {
      query['Location'] = { $regex: location, $options: 'i' };
    }
    if (hospital) {
      query['Hospital Name'] = { $regex: hospital, $options: 'i' };
    }

    // Build sort
    const sort: any = {};
    switch (sortBy) {
      case 'rating':
        sort['Rating'] = -1;
        break;
      case 'experience':
        sort['Experience Years'] = -1;
        break;
      default:
        sort['Doctor Name'] = 1;
    }

    // Execute query
    const skip = (page - 1) * pageSize;
    const [doctors, totalCount] = await Promise.all([
      db.collection('doctor_info')
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      db.collection('doctor_info')
        .countDocuments(query)
    ]);

    return NextResponse.json({
      doctors,
      totalDoctors: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    }, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: corsHeaders
  });
}
