import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.sass';

export default function EventAnniversary() {
  const [eventName, setEventName] = useState('');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [result, setResult] = useState('');
  const [daysInMonth, setDaysInMonth] = useState(31);

  const currentYear = new Date().getFullYear();
  const minYear = 1950;
  const maxYear = currentYear + 50;

  useEffect(() => {
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    setDaysInMonth(lastDay);

    if (Number(day) > lastDay) {
      setDay(String(lastDay));
    }
  }, [year, month, day]);

  const calculateDate = () => {
    const today = new Date();
    const eventDate = new Date(Number(year), Number(month) - 1, Number(day));
    const diffTime = today.getTime() - eventDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const resultText = (() => {
      if (diffDays === 0) {
        return `<strong>오늘은 ${eventName} 기념일 입니다.</strong>`;
      } else if (diffDays > 0) {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const weeks = Math.floor(((diffDays % 365) % 30) / 7);
        const days = ((diffDays % 365) % 30) % 7;

        if (years > 0) {
          let text = `${eventName} ${years}주년`;
          if (months > 0 || weeks > 0 || days > 0) {
            text += `<em>(${years}년`;
            if (months > 0) text += ` ${months}개월`;
            if (weeks > 0) text += ` ${weeks}주`;
            if (days > 0) text += ` ${days}일`;
            text += '째)</em>';
          }
          return text;
        } else if (months > 0) {
          let text = `${eventName} ${months}개월 차`;
          if (weeks > 0 || days > 0) {
            text += `<em>(${months}개월`;
            if (weeks > 0) text += ` ${weeks}주`;
            if (days > 0) text += ` ${days}일`;
            text += '째)</em>';
          }
          return text;
        } else if (weeks > 0) {
          return `${eventName} ${weeks}주 차${days > 0 ? `<em>(${weeks}주 ${days}일째)</em>` : ''}`;
        } else {
          return `${eventName} ${diffDays}일 차`;
        }
      } else {
        const absDays = Math.abs(diffDays);
        const years = Math.floor(absDays / 365);
        const months = Math.floor((absDays % 365) / 30);
        const weeks = Math.floor(((absDays % 365) % 30) / 7);

        if (years > 0) {
          return `${eventName} ${years}년 전`;
        } else if (months > 0) {
          return `${eventName} ${months}달 전`;
        } else if (weeks > 0) {
          return `${eventName} ${weeks}주 전`;
        } else {
          return `${eventName} ${absDays}일 전`;
        }
      }
    })();

    setResult(resultText);
  };

  return (
    <section className={`${styles.section} ${styles['section-event-anniversary']} ${styles['section-half']}`}>
      <h2>기념일 계산</h2>
      <div className={styles.form}>
        <div className={styles.fieldset}>
          <div className={`${styles.group} ${styles['event-name']}`}>
            <label htmlFor="anniversary-name">이벤트</label>
            <div className={styles.eventName}>
              <input
                id="anniversary-name"
                type="text"
                placeholder="기념일 이름 입력"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.diff}>
            <div className={styles.group}>
              <label htmlFor="anniversary-year">기념일</label>
              <select id="anniversary-year" value={year} onChange={(e) => setYear(e.target.value)}>
                {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <label htmlFor="anniversary-year">년</label>
            </div>
            <div className={styles.group}>
              <select id="anniversary-month" value={month} onChange={(e) => setMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <label htmlFor="anniversary-month">월</label>
            </div>
            <div className={styles.group}>
              <select id="anniversary-day" value={day} onChange={(e) => setDay(e.target.value)}>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <label htmlFor="anniversary-day">일</label>
            </div>
          </div>
          <div className={styles.submit}>
            <button type="button" onClick={calculateDate}>
              <span>계산</span>
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className={styles.result}>
          <p dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      )}
    </section>
  );
}
