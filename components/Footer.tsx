'use client';

import styles from './Footer.module.css';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>TopDoctorList</h3>
          <p className={styles.footerDescription}>
            Find and book appointments with the best doctors in Bangladesh.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com/topdoctorlist" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/topdoctorlist" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/topdoctorlist" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/topdoctorlist" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Contact Us</h4>
          <ul className={styles.contactInfo}>
            <li>Email: <a href="mailto:contact@topdoctorlist.com">contact@topdoctorlist.com</a></li>
            <li>Phone: <a href="tel:+8801234567890">+880 12345-67890</a></li>
            <li>Address: House 123, Road 12<br />Banani, Dhaka 1213<br />Bangladesh</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Newsletter</h4>
          <p className={styles.newsletterText}>
            Subscribe to get updates about new doctors and health tips.
          </p>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className={styles.newsletterInput}
              aria-label="Email for newsletter"
            />
            <button type="submit" className={styles.newsletterButton}>Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {currentYear} TopDoctorList. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
