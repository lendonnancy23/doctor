'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface Doctor {
  "Doctor Name": string;
  "Photo URL"?: string;
  Degree: string;
  Speciality: string;
  Designation: string;
  Workplace: string;
  About: string;
  "Hospital Name": string;
  Address: string;
  Location: string;
  "Visiting Hours": string;
  "Appointment Number": string;
}

interface SchemaOrgProps {
  doctors: Doctor[];
  singleDoctor?: Doctor;
}

export default function SchemaOrg({ doctors, singleDoctor }: SchemaOrgProps) {
  const [schemaData, setSchemaData] = useState<any>(null);

  useEffect(() => {
    if (singleDoctor) {
      // Single doctor schema
      setSchemaData({
        "@context": "https://schema.org",
        "@type": "Physician",
        name: singleDoctor["Doctor Name"],
        image: singleDoctor["Photo URL"] || "https://topdoctorlist.com/placeholder-image.png",
        description: singleDoctor.About,
        medicalSpecialty: singleDoctor.Speciality,
        qualification: singleDoctor.Degree,
        jobTitle: singleDoctor.Designation,
        worksFor: {
          "@type": "Hospital",
          name: singleDoctor["Hospital Name"],
          address: {
            "@type": "PostalAddress",
            streetAddress: singleDoctor.Address,
            addressLocality: singleDoctor.Location,
            addressCountry: "BD"
          }
        },
        availableService: {
          "@type": "MedicalProcedure",
          name: `${singleDoctor.Speciality} Consultation`
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: singleDoctor["Appointment Number"],
          contactType: "appointment",
          availableLanguage: ["en", "bn"]
        },
        url: `https://topdoctorlist.com/${encodeURIComponent(singleDoctor["Doctor Name"])}`
      });
    } else {
      // Multiple doctors schema
      setSchemaData({
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        name: "TopDoctorList",
        url: "https://topdoctorlist.com",
        logo: "https://topdoctorlist.com/logo.png",
        description: "Find and book appointments with the best doctors in Bangladesh",
        medicalSpecialty: [...new Set(doctors.map(d => d.Speciality))],
        address: {
          "@type": "PostalAddress",
          addressCountry: "BD"
        },
        member: doctors.map(doctor => ({
          "@type": "Physician",
          name: doctor["Doctor Name"],
          image: doctor["Photo URL"] || "https://topdoctorlist.com/placeholder-image.png",
          medicalSpecialty: doctor.Speciality,
          worksFor: {
            "@type": "Hospital",
            name: doctor["Hospital Name"],
            address: {
              "@type": "PostalAddress",
              addressLocality: doctor.Location,
              addressCountry: "BD"
            }
          },
          url: `https://topdoctorlist.com/${encodeURIComponent(doctor["Doctor Name"])}`
        }))
      });
    }
  }, [doctors, singleDoctor]);

  if (!schemaData) return null;

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      strategy="afterInteractive"
    />
  );
}