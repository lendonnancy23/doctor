'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { FaSearch, FaUserMd, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [locations, setLocations] = useState<string[]>([]);
  const [hospitalsByLocation, setHospitalsByLocation] = useState<Record<string, string[]>>({});
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showHospitals, setShowHospitals] = useState(false);
  const [specialitiesByLocation, setSpecialitiesByLocation] = useState<Record<string, string[]>>({});
  const [showSpecialities, setShowSpecialities] = useState(false);
  const [selectedSpecialityLocation, setSelectedSpecialityLocation] = useState<string | null>(null);

  // Fetch locations and hospitals
  useEffect(() => {
    fetch('/api/doctors?locations=true')
      .then(res => res.json())
      .then(data => setLocations((data.locations || []).filter(Boolean)));
  }, []);

  // Fetch hospitals for a location
  const fetchHospitalsForLocation = async (location: string) => {
    if (!hospitalsByLocation[location]) {
      const res = await fetch(`/api/doctors?hospitals=true&location=${encodeURIComponent(location)}`);
      const data = await res.json();
      setHospitalsByLocation(prev => ({ ...prev, [location]: (data.hospitals || []).filter(Boolean) }));
    }
  };

  const handleLocationClick = async (location: string) => {
    setSelectedLocation(location);
    await fetchHospitalsForLocation(location);
    setShowHospitals(true);
  };

  const handleHospitalsMouseLeave = () => {
    setShowHospitals(false);
    setSelectedLocation(null);
  };

  // Fetch specialities for a location
  const fetchSpecialitiesForLocation = async (location: string) => {
    if (!specialitiesByLocation[location]) {
      const res = await fetch(`/api/doctors?specialties=true&location=${encodeURIComponent(location)}`);
      const data = await res.json();
      setSpecialitiesByLocation(prev => ({ ...prev, [location]: (data.specialties || []).filter(Boolean) }));
    }
  };

  const handleSpecialityLocationClick = async (location: string) => {
    setSelectedSpecialityLocation(location);
    await fetchSpecialitiesForLocation(location);
    setShowSpecialities(true);
  };

  const handleSpecialitiesMouseLeave = () => {
    setShowSpecialities(false);
    setSelectedSpecialityLocation(null);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector(`.${styles.navLinks}`);
      const button = document.querySelector(`.${styles.menuButton}`);
      
      if (isMenuOpen && nav && button && 
          !nav.contains(event.target as Node) && 
          !button.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`} role="navigation">
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>TopDoctorList</span>
        </Link>

        <button 
          className={styles.menuButton} 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="nav-links"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div 
          id="nav-links"
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <Link 
            href="/about" 
            className={pathname === '/about' ? styles.active : ''}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className={pathname === '/contact' ? styles.active : ''}
          >
            Contact
          </Link>
          <Link
            href="/"
            className={`${styles.findButton} ${pathname === '/' ? styles.active : ''}`}
          >
            <FaSearch className={styles.searchIcon} />
            Find a Doctor
          </Link>
          
          <Link href="/contact" className={styles.appointmentButton}>
            <FaUserMd className={styles.doctorIcon} />
            List Your Practice
          </Link>
          <div
            className={styles.dropdown}
            onMouseLeave={handleHospitalsMouseLeave}
          >
            <button
              className={styles.dropdownButton}
              aria-haspopup="true"
              aria-expanded={showHospitals}
            >
              Hospitals
            </button>
            <div className={styles.dropdownMenu}>
              {locations.map(location => (
                <div
                  key={location}
                  className={styles.dropdownItem}
                  onMouseEnter={() => handleLocationClick(location)}
                  onClick={() => handleLocationClick(location)}
                >
                  <Link href={`/hospitals/${encodeURIComponent(location)}`}>{location}</Link>
                  {selectedLocation === location && showHospitals && hospitalsByLocation[location] && (
                    <div className={styles.submenu}>
                      {hospitalsByLocation[location].map(hospital => (
                        <Link
                          key={hospital}
                          href={`/hospitals/${encodeURIComponent(location)}/${hospital.replace(/\s+/g, '-').toLowerCase()}`}
                          className={styles.submenuItem}
                        >
                          {hospital}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div
            className={styles.dropdown}
            onMouseLeave={handleSpecialitiesMouseLeave}
          >
            <button
              className={styles.dropdownButton}
              aria-haspopup="true"
              aria-expanded={showSpecialities}
            >
              Specialities
            </button>
            <div className={styles.dropdownMenu}>
              {locations.map(location => (
                <div
                  key={location}
                  className={styles.dropdownItem}
                  onMouseEnter={() => handleSpecialityLocationClick(location)}
                  onClick={() => handleSpecialityLocationClick(location)}
                >
                  <span>{location}</span>
                  {selectedSpecialityLocation === location && showSpecialities && specialitiesByLocation[location] && (
                    <div className={styles.submenu}>
                      {specialitiesByLocation[location].map(speciality => (
                        <Link
                          key={speciality}
                          href={`/specialists/${encodeURIComponent(location)}/${speciality.replace(/\s+/g, '-').toLowerCase()}`}
                          className={styles.submenuItem}
                        >
                          {speciality}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
