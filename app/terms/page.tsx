import React from 'react';
import styles from './page.module.css';

export default function Terms() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.content}>
        <p className={styles.lastUpdated}>Last Updated: April 28, 2025</p>

        <section className={styles.section}>
          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using TopDoctorList (https://topdoctorlist.com), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>User Responsibilities</h2>
          <ul>
            <li>Provide accurate and complete information when using our services</li>
            <li>Maintain the security of your account credentials</li>
            <li>Not misuse or abuse the platform or its services</li>
            <li>Respect the privacy and rights of other users</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Doctor Listings</h2>
          <p>
            TopDoctorList provides information about healthcare professionals for convenience. While we strive to maintain accurate and up-to-date information, we recommend verifying details directly with the healthcare providers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Appointment Booking</h2>
          <p>
            Our platform facilitates appointment booking between patients and healthcare providers. We are not responsible for the medical services provided or any disputes that may arise between patients and healthcare providers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Intellectual Property</h2>
          <p>
            The content, features, and functionality of TopDoctorList are owned by us and protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:legal@topdoctorlist.com">legal@topdoctorlist.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}