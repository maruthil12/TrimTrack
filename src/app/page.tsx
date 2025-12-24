import Link from "next/link";
import styles from "./page.module.css";
import { User, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>TrimTrack</h1>
          <p className={styles.subtitle}>
            The professional way to manage daily employee earnings and profit sharing.
            Secure, simple, and automated.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Employee Section */}
          <div className={styles.roleCard}>
            <div className={styles.roleIcon}>
              <User size={32} />
            </div>
            <h2 className={styles.roleTitle}>Employee</h2>
            <p className={styles.roleDesc}>
              Log in to track your daily earnings and view your share.
            </p>
            <Link href="/login" className={styles.googleBtn}>
              <User size={20} />
              Employee Login
            </Link>
          </div>

          {/* Owner Section */}
          <div className={styles.roleCard}>
            <div className={styles.roleIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h2 className={styles.roleTitle}>Owner</h2>
            <p className={styles.roleDesc}>
              Access the admin dashboard to manage employees and profits.
            </p>
            <Link href="/login" className={styles.ownerBtn}>
              Owner Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
