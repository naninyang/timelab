import Image from 'next/image';
import { useTheme } from '@/components/context/ThemeContext';
import styles from '@/styles/Usage.module.sass';
import { UsageLogoDark, UsageLogoLight } from '@/components/Svgs';

export default function Usage() {
  const { isDarkMode } = useTheme();
  return (
    <main className={styles.usage}>
      <div className={styles.bg}>
        {isDarkMode ? (
          <Image src="/bg-dark.webp" alt="" width="1920" height="1080" />
        ) : (
          <Image src="/bg-light.webp" alt="" width="1920" height="1080" />
        )}
      </div>
      <div className={`container ${styles.container}`}>
        <div className={styles.svg}>{isDarkMode ? <UsageLogoDark /> : <UsageLogoLight />}</div>
        <div className={styles.notice}>
          <p>본 웹서비스는 쿠키를 수집하지 않습니다.</p>
          <p>비즈니스 이메일: 1157iamari@gmail.com</p>
        </div>
        <div className={styles.staff}>
          <dl>
            <div>
              <dt>Hosting</dt>
              <dd>VERCEL (버셀)</dd>
            </div>
            <div>
              <dt>UX/UI</dt>
              <dd>Chloe Ariko (고아리)</dd>
            </div>
            <div>
              <dt>Development</dt>
              <dd>Chloe Ariko (고아리)</dd>
            </div>
            <div>
              <dt>Test (ty!)</dt>
              <dd>언럭키즈, rorapa</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
