import Seo from '@/components/Seo';
import Dday from '@/components/date/Dday';
import Diff from '@/components/date/Diff';
import EventAnniversary from '@/components/date/EventAnniversary';
import EventPercentage from '@/components/date/EventPercentage';
import Father from '@/components/date/Father';
import Supported from '@/components/date/Supported';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  const timestamp = Date.now();
  return (
    <main className={styles.main}>
      <Seo pageImg={`https://timelab.dev1stud.io/og.webp?ts=${timestamp}`} />
      <div className={`container ${styles.container}`}>
        <Father />
        <Diff />
        <Dday />
        <EventPercentage />
        <EventAnniversary />
        <Supported />
      </div>
    </main>
  );
}
