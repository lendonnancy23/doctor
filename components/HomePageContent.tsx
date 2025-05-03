'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from '../app/HomePage.module.css';
import Loading from './Loading';
import HeroSection from './HeroSection';
import dynamic from 'next/dynamic';
import SchemaOrg from './SchemaOrg';
import Head from 'next/head';
import Link from 'next/link';

const Doctor = dynamic(() => import('./Doctor'), {
  loading: () => <Loading />,
  ssr: true
});

interface Doctor {
  "Doctor Name": string;
  "Photo URL": string;
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
  Slug: string;
}

interface SearchFilters {
  name: string;
  speciality: string;
  location: string;
  hospital: string;
  sortBy?: string;
}

interface SpecialtyPair {
  location: string;
  speciality: string;
  slugifiedSpeciality: string;
  count: number;
}

export default function HomePageContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    speciality: '',
    location: '',
    hospital: '',
    sortBy: undefined
  });
  const [popularSpecialties, setPopularSpecialties] = useState<Array<{name: string; location: string; count: number}>>([]);
  const [selectedLocation, setSelectedLocation] = useState('Dhaka');
  const [specialtyLoading, setSpecialtyLoading] = useState(true);
  const [specialtyError, setSpecialtyError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine current page
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Fetch filter options on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/doctors?specialties=true').then(res => res.json()),
      fetch('/api/doctors?locations=true').then(res => res.json()),
      fetch('/api/doctors?hospitals=true').then(res => res.json())
    ])
      .then(([specialtiesData, locationsData, hospitalsData]) => {
        setSpecialties(specialtiesData.specialties || []);
        setLocations(locationsData.locations || []);
        setHospitals(hospitalsData.hospitals || []);
      })
      .catch(() => {});
  }, []);

  // Fetch specialty data when location changes
  useEffect(() => {
    const fetchSpecialtyData = async () => {
      setSpecialtyLoading(true);
      setSpecialtyError(null);
      try {
        const response = await fetch('/api/doctors?uniqueLocationSpecialityPairs=true');
        if (!response.ok) {
          throw new Error('Failed to fetch specialty data');
        }
        const data = await response.json();
        const pairs: SpecialtyPair[] = data.pairs || [];
        const locationSpecialties = pairs
          .filter((pair: SpecialtyPair) => pair.location === selectedLocation)
          .sort((a: SpecialtyPair, b: SpecialtyPair) => b.count - a.count)
          .slice(0, 10)
          .map((pair: SpecialtyPair) => ({
            name: pair.speciality,
            location: pair.location,
            count: pair.count
          }));
        setPopularSpecialties(locationSpecialties);
      } catch (error) {
        setSpecialtyError(error instanceof Error ? error.message : 'Failed to load specialties');
      } finally {
        setSpecialtyLoading(false);
      }
    };

    fetchSpecialtyData();
  }, [selectedLocation]);

  // Fetch doctors with filters
  const fetchDoctors = (newFilters: SearchFilters) => {
    setLoading(true);
    setFilters(newFilters);
    const params = new URLSearchParams({
      page: (parseInt(searchParams.get('page') || '1')).toString(),
      pageSize: (parseInt(searchParams.get('page') || '1') === 1 ? '8' : '24'),
      ...(newFilters.name && { name: newFilters.name }),
      ...(newFilters.speciality && { speciality: newFilters.speciality }),
      ...(newFilters.location && { location: newFilters.location }),
      ...(newFilters.hospital && { hospital: newFilters.hospital }),
      sortBy: newFilters.sortBy || 'name'
    });
    fetch(`/api/doctors?${params}`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data.doctors || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch doctors on mount and when page/filters change
  useEffect(() => {
    fetchDoctors(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('page')]);

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', newPage.toString());
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  const renderPaginationButtons = () => {
    const siblingCount = 1;
    const DOTS = '...';
    const totalPageNumbers = siblingCount * 2 + 3;
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, DOTS, ...middleRange, DOTS, totalPages];
    }
  };

  return (
    <>
      <Head>
        <title>Find Top Doctors in Bangladesh | Book Appointments Online</title>
        <meta name="description" content="Find and book appointments with the best doctors in Bangladesh. Search by location, hospital, and more. Trusted doctor reviews and easy online booking." />
      </Head>
      <SchemaOrg doctors={doctors} />
      <main>
        <h1 className={styles.mainHeading}>Find and Book Doctor Appointments in Bangladesh</h1>
        <HeroSection
          onSearch={fetchDoctors}
          specialties={specialties}
          locations={locations}
          hospitals={hospitals}
          loading={loading}
        />

        {/* Quick Specialty Navigation Section */}
        <section className={styles.quickSpecialtyNavSection}>
          <div className={styles.quickSpecialtyNavHeader}>
            <h2 className={styles.quickSpecialtyNavTitle}>
              Popular Medical Specialties
            </h2>
            <div className={styles.locationSelector}>
              <select 
                value={selectedLocation}
                onChange={handleLocationChange}
                className={styles.locationSelect}
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {specialtyLoading ? (
            <div className={styles.quickSpecialtyNavGrid}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className={styles.specialtyLoadingCard}>
                  Loading...
                </div>
              ))}
            </div>
          ) : specialtyError ? (
            <div className={styles.specialtyError}>
              <h3>Error Loading Specialties</h3>
              <p>{specialtyError}</p>
              <button 
                onClick={() => setSelectedLocation(selectedLocation)} 
                className={styles.retryButton}
              >
                ↻ Retry
              </button>
            </div>
          ) : (
            <div className={styles.quickSpecialtyNavGrid}>
              {popularSpecialties.map(({ name, location, count }) => (
                <Link
                  key={name}
                  href={`/specialists/${encodeURIComponent(location)}/${name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.quickSpecialtyNavLink}
                >
                  <span>{name}</span>
                  <span className={styles.specialtyCount}>{count}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section aria-label="Featured Doctors" className={styles.doctorsSection}>
          <h2 className={styles.sectionTitle}>Top Doctors</h2>
          <div className={styles.doctorCardGrid}>
            {loading ? (
              <Loading />
            ) : doctors.length === 0 ? (
              <div className={styles.noResults} role="alert">
                <h2>No doctors found</h2>
                <p>Try adjusting your search filters or try a different location.</p>
              </div>
            ) : (
              doctors.map((doctor) => (
                <Suspense key={doctor["Doctor Name"]} fallback={<Loading />}>
                  <article className={styles.doctorCard}>
                    <Doctor doctor={doctor} />
                  </article>
                </Suspense>
              ))
            )}
          </div>
          {/* Pagination navigation */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
                aria-label="Go to previous page"
              >
                Previous
              </button>
              {renderPaginationButtons()?.map((pageNum, i) => (
                <button
                  key={i}
                  onClick={() => pageNum !== '...' && handlePageChange(Number(pageNum))}
                  className={`${styles.pageButton} ${
                    pageNum === '...' ? styles.dots : ''
                  } ${currentPage === pageNum ? styles.activePage : ''}`}
                  disabled={pageNum === '...'}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                  aria-label={pageNum === '...' ? 'More pages' : `Go to page ${pageNum}`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
                aria-label="Go to next page"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </main>
    </>
  );
}