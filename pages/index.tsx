import Seo from '@/components/Seo';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  const timestamp = Date.now();
  return (
    <main className={styles.main}>
      <Seo pageImg={`https://timelab.dev1stud.io/og.webp?ts=${timestamp}`} />
    </main>
  );
}
