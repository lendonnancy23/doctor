'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Doctor page error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <h1>Something went wrong</h1>
      <p>We apologize for the inconvenience. Please try again or return to the home page.</p>
      <div className={styles.actionButtons}>
        <button onClick={reset} className={styles.retryButton}>
          Try again
        </button>
        <Link href="/" className={styles.homeButton}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}