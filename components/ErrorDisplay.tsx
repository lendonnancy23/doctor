import React from 'react';
import Link from 'next/link';
import styles from './ErrorDisplay.module.css';

interface Props {
  error: Error | null;
  errorInfo?: string;
  resetError: () => void;
}

export default function ErrorDisplay({ error, errorInfo, resetError }: Props) {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>
          {isProduction ? 'Something went wrong' : error?.message || 'Error'}
        </h1>
        
        <p className={styles.errorMessage}>
          {isProduction ? (
            'We apologize for the inconvenience. Our team has been notified and is working to fix this issue.'
          ) : (
            error?.message
          )}
        </p>

        {errorInfo && !isProduction && (
          <pre className={styles.errorStack}>
            <code>{errorInfo}</code>
          </pre>
        )}

        <div className={styles.actionButtons}>
          <button
            onClick={resetError}
            className={styles.retryButton}
          >
            Try Again
          </button>

          <Link href="/" className={styles.homeButton}>
            Return to Homepage
          </Link>
        </div>

        <div className={styles.supportInfo}>
          <p>Need help? Contact our support team:</p>
          <a 
            href="mailto:support@topdoctorlist.com"
            className={styles.supportLink}
          >
            support@topdoctorlist.com
          </a>
        </div>
      </div>
    </div>
  );
}