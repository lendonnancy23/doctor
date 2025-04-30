'use client';

import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.pageTitle}>About Doctor Finder</h1>
      
      <div className={styles.content}>
        <p className={styles.paragraph}>
          Welcome to <span className={styles.highlight}>Doctor Finder</span>, your trusted platform for finding the best doctors and healthcare professionals in Bangladesh. Our mission is to make healthcare accessible and convenient for everyone by connecting patients with top-rated specialists across all medical fields.
        </p>
        
        <p className={styles.paragraph}>
          At Doctor Finder, we believe in empowering individuals with the information they need to make informed decisions about their health. Our platform provides comprehensive profiles of medical professionals, including their qualifications, specializations, and practice locations, ensuring you can make the best choice for your healthcare needs.
        </p>
        
        <p className={styles.paragraph}>
          We carefully verify and maintain up-to-date information about our listed doctors, making it easier for you to find specialists across various fields - from General Medicine to specialized Surgery. Our user-friendly interface allows you to search by specialty, location, or specific medical conditions, helping you find the right healthcare professional quickly and efficiently.
        </p>
        
        <p className={styles.paragraph}>
          Whether you're looking for a General Physician, Specialist, or Surgeon, Doctor Finder is here to help you make informed healthcare decisions. We're committed to improving healthcare accessibility in Bangladesh by bridging the gap between patients and qualified medical professionals.
        </p>

        <p className={styles.paragraph}>
          <span className={styles.highlight}>Thank you for choosing Doctor Finder</span>. Your health is our priority, and we're here to ensure you receive the best possible care from the most qualified healthcare professionals in Bangladesh.
        </p>
      </div>
    </div>
  );
}