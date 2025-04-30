'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import styles from '../app/HomePage.module.css';
import Loading from './Loading';
import HeroSection from './HeroSection';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import type { SearchFilters } from './SearchBar';
import SchemaOrg from './SchemaOrg';

const Doctor = dynamic(() => import('./Doctor'), {
  loading: () => <Loading />,
  ssr: true
});

const DOTS = '...';

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
}

export default function HomePageContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { ref, inView } = useInView();
  const chunkSize = 6;

  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = 24;

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
      .catch(err => console.error('Error fetching filter options:', err));
  }, []);

  const fetchDoctors = useCallback(async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(filters.name && { name: filters.name }),
        ...(filters.speciality && { speciality: filters.speciality }),
        ...(filters.location && { location: filters.location }),
        ...(filters.hospital && { hospital: filters.hospital }),
        ...(filters.sortBy && { sortBy: filters.sortBy })
      });

      const response = await fetch(`/api/doctors?${queryParams}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data.doctors || []);
      setDisplayedDoctors(data.doctors?.slice(0, chunkSize) || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchDoctors({
      name: '',
      speciality: searchParams.get('speciality') || '',
      location: searchParams.get('location') || '',
      hospital: searchParams.get('hospital') || '',
      sortBy: searchParams.get('sortBy') || 'name'
    });
  }, [fetchDoctors, searchParams]);

  // Load more doctors when scrolling
  useEffect(() => {
    if (inView && displayedDoctors.length < doctors.length) {
      const nextChunk = doctors.slice(
        displayedDoctors.length,
        displayedDoctors.length + chunkSize
      );
      setDisplayedDoctors(prev => [...prev, ...nextChunk]);
    }
  }, [inView, doctors, displayedDoctors.length]);

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', newPage.toString());
    setDisplayedDoctors([]); // Reset displayed doctors for new page
    window.history.pushState(null, '', `${pathname}?${current.toString()}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleDoctorClick = (doctorName: string) => {
    router.push(`/doctors/${encodeURIComponent(doctorName)}`);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const renderPaginationButtons = () => {
    const siblingCount = 1;
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

  // Filter options for search
  const filterOptions = {
    specialties,
    locations,
    hospitals,
    sortOptions: [
      { value: 'name', label: 'Name (A-Z)' },
      { value: 'rating', label: 'Rating' },
      { value: 'experience', label: 'Experience' }
    ]
  };

  return (
    <>
      <SchemaOrg doctors={displayedDoctors} />
      <main>
        <h1 className="sr-only">Find and Book Doctor Appointments in Bangladesh</h1>
        
        <HeroSection 
          onSearch={fetchDoctors}
          specialties={specialties}
          loading={loading}
        />
        
        <div className={styles.container}>
          {loading && displayedDoctors.length === 0 ? (
            <Loading />
          ) : error ? (
            <div className={styles.errorContainer}>
              <h2>Error</h2>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <section aria-label="Doctor Listings">
                <div className={styles.doctorsGrid}>
                  {displayedDoctors.map((doctor, index) => (
                    <Suspense key={doctor["Doctor Name"]} fallback={<Loading />}>
                      <article>
                        <Doctor
                          doctor={doctor}
                          featured={currentPage === 1 && index < 3}
                        />
                      </article>
                    </Suspense>
                  ))}
                </div>

                {displayedDoctors.length < doctors.length && (
                  <div ref={ref} className={styles.loadingMore}>
                    <Loading />
                  </div>
                )}

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
                        onClick={() => pageNum !== DOTS && handlePageChange(Number(pageNum))}
                        className={`${styles.pageButton} ${
                          pageNum === DOTS ? styles.dots : ''
                        } ${currentPage === pageNum ? styles.activePage : ''}`}
                        disabled={pageNum === DOTS}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        aria-label={pageNum === DOTS ? 'More pages' : `Go to page ${pageNum}`}
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

              {/* No results message */}
              {displayedDoctors.length === 0 && !loading && (
                <div className={styles.noResults} role="alert">
                  <h2>No doctors found</h2>
                  <p>Try adjusting your search filters or try a different location.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}