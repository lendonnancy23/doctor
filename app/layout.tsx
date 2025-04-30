import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://topdoctorlist.com'),
  title: {
    default: 'TopDoctorList - Find & Book Appointments with the Best Doctors in Bangladesh',
    template: '%s | TopDoctorList'
  },
  description: 'Find and book appointments with qualified medical professionals in Bangladesh. Easy online scheduling, trusted doctors, and comprehensive healthcare services.',
  keywords: [
    'top doctors bangladesh',
    'best doctors dhaka',
    'doctor appointment online',
    'medical specialists bangladesh',
    'find doctors bangladesh',
    'book doctor appointment',
    'healthcare directory bangladesh'
  ],
  authors: [{ name: 'TopDoctorList' }],
  creator: 'TopDoctorList',
  publisher: 'TopDoctorList',
  openGraph: {
    type: 'website',
    siteName: 'TopDoctorList',
    locale: 'en_US',
    url: 'https://topdoctorlist.com',
    title: 'TopDoctorList - Find & Book Doctor Appointments in Bangladesh',
    description: 'Find and book appointments with qualified medical professionals in Bangladesh. Easy online scheduling and trusted doctors.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TopDoctorList - Find the Best Doctors in Bangladesh'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TopDoctorList - Find & Book Doctor Appointments in Bangladesh',
    description: 'Find and book appointments with qualified medical professionals in Bangladesh.',
    images: ['/og-image.jpg'],
    creator: '@topdoctorlist',
    site: '@topdoctorlist'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
