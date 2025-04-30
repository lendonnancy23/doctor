'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { FaEnvelope, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Add form submission logic here
    // For now, just simulate success
    setTimeout(() => {
      setFormStatus('success');
    }, 1000);
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.pageTitle}>Contact Us</h1>
      
      <div className={styles.contactGrid}>
        <div className={styles.contactInfo}>
          <h2 className={styles.contactTitle}>Get in Touch</h2>
          <p className={styles.contactDescription}>
            Have questions about finding a doctor or using our service? We're here to help!
          </p>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <FaEnvelope className={styles.infoIcon} />
              <div className={styles.infoText}>
                <strong>Email</strong>
                <a href="mailto:contact@topdoctorlist.com">contact@topdoctorlist.com</a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaPhone className={styles.infoIcon} />
              <div className={styles.infoText}>
                <strong>Phone</strong>
                <a href="tel:+8801234567890">+880 12345-67890</a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaClock className={styles.infoIcon} />
              <div className={styles.infoText}>
                <strong>Support Hours</strong>
                <p>Sunday - Thursday<br />9:00 AM - 6:00 PM (BST)</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <div className={styles.infoText}>
                <strong>Office Address</strong>
                <p>
                  House 123, Road 12<br />
                  Banani, Dhaka 1213<br />
                  Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Send Us a Message</h2>
          
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {formStatus === 'success' && (
              <div className={styles.successMessage}>
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {formStatus === 'error' && (
              <div className={styles.errorMessage}>
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
