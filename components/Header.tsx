import { useEffect, useState } from 'react';
import Anchor from './Anchor';
import { LogoDark, LogoLight, ModeDark, ModeLight } from './Svgs';
import styles from '@/styles/Header.module.sass';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('t');
    if (t) {
      document.body.setAttribute('data-theme', t);
      setIsDarkMode(t === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const toggleTheme = isDarkMode ? 'light' : 'dark';
    document.body.setAttribute('data-theme', toggleTheme);
    localStorage.setItem('t', toggleTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Anchor href="/">
          {isDarkMode ? <LogoLight /> : <LogoDark />}
          <span>타임랩</span>
        </Anchor>
        <button type="button" onClick={toggleTheme}>
          {isDarkMode ? <ModeLight /> : <ModeDark />}
          <span>{isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}</span>
        </button>
      </div>
    </header>
  );
}
