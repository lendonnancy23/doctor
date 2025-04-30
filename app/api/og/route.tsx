import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
 
export const runtime = 'edge';
 
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorName = searchParams.get('name');
    const specialty = searchParams.get('specialty');
    const hospital = searchParams.get('hospital');
 
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <img
              src="https://topdoctorlist.com/logo.png"
              alt="TopDoctorList"
              width="80"
              height="80"
            />
          </div>
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: '10px',
              lineHeight: 1.2,
            }}
          >
            {doctorName}
          </h1>
          {specialty && (
            <h2
              style={{
                fontSize: '32px',
                color: '#0ea5e9',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {specialty}
            </h2>
          )}
          {hospital && (
            <p
              style={{
                fontSize: '24px',
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              {hospital}
            </p>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <p
              style={{
                fontSize: '24px',
                color: '#94a3b8',
              }}
            >
              topdoctorlist.com
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log(e);
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}