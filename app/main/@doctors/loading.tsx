import styles from '../../HomePage.module.css';

export default function DoctorsLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.doctorsGrid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.doctorSkeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonName} />
              <div className={styles.skeletonSpecialty} />
              <div className={styles.skeletonLocation} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}