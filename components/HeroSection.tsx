'use client';

import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import SearchBar, { SearchFilters } from './SearchBar';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void;
  specialties: string[];
  locations: string[];
  hospitals: string[];
  loading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, specialties, locations, hospitals, loading }) => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.leftContent}>
          <div className={styles.crossIcon}>+</div>
          <h1 className={styles.heroTitle}>
            Digital Healthcare<br />
            Services and Information<br />
            Solution-Doctor Info
          </h1>
          <p className={styles.heroSubtitle}>
            Find healthcare providers and medical facilities offering online doctor 
            and hospital services.
          </p>
          <div className={styles.searchContainer}>
            <SearchBar
              onSearch={onSearch}
              specialties={specialties}
              loading={loading}
            />
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <FaCheck className={styles.checkIcon} />
              <span>Verified Doctors</span>
            </div>
            <div className={styles.featureItem}>
              <FaCheck className={styles.checkIcon} />
              <span>Regular Checkup</span>
            </div>
            <div className={styles.featureItem}>
              <FaCheck className={styles.checkIcon} />
              <span>Quality Care</span>
            </div>
          </div>
        </div>
        
        <div className={styles.rightContent}>
          <div className={styles.imageWrapper}>
            <Image
              src="/hero_section_dcotor_model.png"
              alt="Healthcare Professional"
              width={450}
              height={450}
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;