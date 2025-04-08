import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.sass';

export default function Father() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const minYear = 1950;
  const maxYear = currentYear + 50;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState('days');
  const [direction, setDirection] = useState('after');
  const [calculatedDate, setCalculatedDate] = useState('');

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getMaxDays = (year: number, month: number) => new Date(year, month, 0).getDate();
  const maxDays = getMaxDays(year, month);
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const handleCcalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const baseDate = new Date(year, month - 1, day);
    setCalculatedDate(() => {
      const newDate = new Date(baseDate);
      const value = Number(amount);

      if (unit === 'days') {
        newDate.setDate(baseDate.getDate() + (direction === 'after' ? value : -value));
      } else if (unit === 'weeks') {
        newDate.setDate(baseDate.getDate() + (direction === 'after' ? value * 7 : -value * 7));
      } else if (unit === 'months') {
        newDate.setMonth(baseDate.getMonth() + (direction === 'after' ? value : -value));
      } else if (unit === 'years') {
        newDate.setFullYear(baseDate.getFullYear() + (direction === 'after' ? value : -value));
      }

      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = daysOfWeek[newDate.getDay()];

      return `${newDate.getFullYear()}년 ${newDate.getMonth() + 1}월 ${newDate.getDate()}일 (${dayOfWeek})`;
    });
  };

  useEffect(() => {
    if (day > maxDays) setDay(maxDays);
  }, [month, year, day, maxDays]);

  return (
    <section className={`${styles.section} ${styles['section-half']}`}>
      <div className={styles.module}>
        <h2>이전/이후 계산</h2>
        <form onSubmit={handleCcalculate}>
          <fieldset>
            <legend>이전/이후 계산폼</legend>
            <div className={styles.ymd}>
              <div className={styles.group}>
                <select
                  id="father-year"
                  className={styles.year}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <label htmlFor="father-year">년</label>
              </div>
              <div className={styles.group}>
                <select id="father-month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <label htmlFor="father-month">월</label>
              </div>
              <div className={styles.group}>
                <select id="father-day" value={day} onChange={(e) => setDay(Number(e.target.value))}>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <label htmlFor="father-day">일</label>
              </div>
              <span>기준</span>
            </div>
            <div className={styles.ymd}>
              <div className={`${styles.group} ${styles['group-mix']}`}>
                <div className={styles.text}>
                  <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="days">일</option>
                  <option value="weeks">주</option>
                  <option value="months">개월</option>
                  <option value="years">년</option>
                </select>
              </div>
              <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                <option value="after">이후</option>
                <option value="before">이전</option>
              </select>
            </div>
            <div className={styles.submit}>
              <button type="submit">
                <span>계산</span>
              </button>
            </div>
            <div className={styles.notice}>
              <p>1개월은 30일로 계산됩니다.</p>
            </div>
          </fieldset>
        </form>

        {calculatedDate && (
          <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
            <p>
              <strong>{calculatedDate}</strong> 입니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
