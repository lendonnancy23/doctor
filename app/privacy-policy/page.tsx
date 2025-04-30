import React from 'react';
import styles from './page.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <p className={styles.lastUpdated}>Last Updated: April 28, 2025</p>

        <section className={styles.section}>
          <h2>Introduction</h2>
          <p>
            Welcome to TopDoctorList (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our website (https://topdoctorlist.com) and services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Information We Collect</h2>
          <p>When you use TopDoctorList, we may collect:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Appointment booking details</li>
            <li>Medical preferences and history</li>
            <li>Usage data and cookies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Facilitate doctor appointments</li>
            <li>Improve our services</li>
            <li>Send relevant notifications</li>
            <li>Ensure platform security</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:privacy@topdoctorlist.com">privacy@topdoctorlist.com</a>
            <br />
            TopDoctorList<br />
            House 123, Road 12<br />
            Banani, Dhaka 1213<br />
            Bangladesh
          </p>
        </section>
      </div>
    </div>
  );
}