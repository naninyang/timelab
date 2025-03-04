import { useState } from 'react';
import styles from '@/styles/Home.module.sass';

export default function EventPercentage() {
  const [eventName, setEventName] = useState('');
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [startDay, setStartDay] = useState(new Date().getDate());
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);
  const [endDay, setEndDay] = useState(new Date().getDate());
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState<number | null>(null);

  function calculateEventProgress() {
    if (!eventName.trim()) {
      setResult('<p><strong>이벤트 이름을 입력해주세요.</strong></p>');
      setProgress(null);
      return;
    }

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate > endDate) {
      setResult('<p><strong>이벤트 종료 날짜가 시작 날짜보다 빠를 수 없습니다.</strong></p>');
      setProgress(null);
      return;
    }

    const eventWithPostfix = getPostfix(eventName);

    if (today < startDate) {
      const daysLeft = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setResult(
        `<p>${eventName} <strong>시작 전</strong>입니다.</p><p>${eventName} 시작까지 <strong>${formatDuration(daysLeft)}</strong> 남았습니다.</p>`,
      );
      setProgress(null);
      return;
    }

    if (today > endDate) {
      const daysAfter = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      setResult(`<p>${eventWithPostfix} <strong>${formatDuration(daysAfter)}</strong> 전에 종료되었습니다.</p>`);
      setProgress(null);
      return;
    }

    if (startDate.getTime() === endDate.getTime() && startDate.getTime() === today.getTime()) {
      setResult('<p>시작일과 종료일이 같습니다.</p>');
      setProgress(null);
      return;
    }

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = totalDays - elapsedDays;

    const progressPercent = ((elapsedDays / totalDays) * 100).toFixed(2);
    const remainingPercent = ((remainingDays / totalDays) * 100).toFixed(2);

    setResult(
      `<p>${eventWithPostfix} <strong>${progressPercent}% 진행중</strong>. <em>(${formatDuration(elapsedDays)}째)</em></p>` +
        `<p>종료까지 <strong>${remainingPercent}% 남음</strong>. <em>(${formatDuration(remainingDays)} 남음)</em></p>`,
    );
    setProgress(Number(progressPercent));
  }

  function formatDuration(days: number): string {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = (days % 365) % 30;

    return [years ? `${years}년` : '', months ? `${months}개월` : '', remainingDays ? `${remainingDays}일` : '']
      .filter(Boolean)
      .join(' ');
  }

  function getPostfix(word: string): string {
    const lastChar = word.charCodeAt(word.length - 1);
    const hasFinalConsonant = (lastChar - 44032) % 28 !== 0;
    return hasFinalConsonant ? `${word}은` : `${word}는`;
  }

  return (
    <section className={`${styles.section} ${styles['section-event-percentage']}`}>
      <h2>이벤트 퍼센트 계산</h2>
      <div className={styles.form}>
        <div className={styles.fieldset}>
          <div className={`${styles.group} ${styles['event-name']}`}>
            <label htmlFor="event-name">이벤트</label>
            <div className={styles.eventName}>
              <input
                id="event-name"
                type="text"
                placeholder="이벤트 이름 입력"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles['event-container']}>
            <div className={styles.diff}>
              <div className={styles.group}>
                <label htmlFor="event-start-year">시작일</label>
                <select id="event-start-year" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <label htmlFor="event-start-year">년</label>
              </div>
              <div className={styles.group}>
                <select
                  id="event-start-month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <label htmlFor="event-start-month">월</label>
              </div>
              <div className={styles.group}>
                <select id="event-start-day" value={startDay} onChange={(e) => setStartDay(Number(e.target.value))}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <label htmlFor="event-start-day">일</label>
              </div>
            </div>
            <div className={styles.diff}>
              <div className={styles.group}>
                <label htmlFor="event-end-year">종료일</label>
                <select id="event-end-year" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <label htmlFor="event-end-year">년</label>
              </div>
              <div className={styles.group}>
                <select id="event-end-month" value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <label htmlFor="event-end-month">월</label>
              </div>
              <div className={styles.group}>
                <select id="event-end-day" value={endDay} onChange={(e) => setEndDay(Number(e.target.value))}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <label htmlFor="event-end-day">일</label>
              </div>
            </div>
          </div>
          <button type="button" onClick={calculateEventProgress}>
            <span>계산</span>
          </button>
        </div>
      </div>
      <div className={styles['result-container']}>
        {result && (
          <div
            className={`${styles.result} ${styles['event-percentage-result']}`}
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
        {progress !== null && (
          <div className={styles.progress}>
            <div
              className={styles['progress-bar']}
              role="progressbar"
              aria-label="이벤트 도달 상태"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={styles.progressing} style={{ width: `${progress}%` }} />
            </div>
            <p>{progress}% 진행</p>
          </div>
        )}
      </div>
    </section>
  );
}
