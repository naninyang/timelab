import Seo from '@/components/Seo';
import Diff from '@/components/date/Diff';
import Father from '@/components/date/Father';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  const timestamp = Date.now();
  return (
    <main className={styles.main}>
      <Seo pageImg={`https://timelab.dev1stud.io/og.webp?ts=${timestamp}`} />
      <div className={`container ${styles.container}`}>
        <Father />
        <Diff />
      </div>
    </main>
  );
}
