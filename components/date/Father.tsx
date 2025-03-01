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
  const [daysToAdd, setDaysToAdd] = useState(0);
  const [direction, setDirection] = useState('after');
  const [calculatedDate, setCalculatedDate] = useState('');

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getMaxDays = (year: number, month: number) => new Date(year, month, 0).getDate();
  const maxDays = getMaxDays(year, month);
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const calculateDate = () => {
    const baseDate = new Date(year, month - 1, day);
    const updatedDate =
      direction === 'after'
        ? new Date(baseDate.setDate(baseDate.getDate() + Number(daysToAdd)))
        : new Date(baseDate.setDate(baseDate.getDate() - Number(daysToAdd)));

    setCalculatedDate(`${updatedDate.getFullYear()}년 ${updatedDate.getMonth() + 1}월 ${updatedDate.getDate()}일`);
  };

  useEffect(() => {
    if (day > maxDays) setDay(maxDays);
  }, [month, year]);

  return (
    <section className={styles.section}>
      <h2>이전/이후 계산</h2>
      <form>
        <fieldset>
          <legend>이후 날짜 혹은 이전 날짜 세팅 폼</legend>
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
          <div className={styles.calc}>
            <div className={styles.group}>
              <input type="number" value={daysToAdd} onChange={(e) => setDaysToAdd(Number(e.target.value))} />
              <label htmlFor="">일</label>
            </div>
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="after">이후</option>
              <option value="before">이전</option>
            </select>
          </div>
          <button type="button" onClick={calculateDate}>
            <span>계산</span>
          </button>
        </fieldset>
      </form>

      {calculatedDate && (
        <p>
          <strong>{calculatedDate}</strong> 입니다.
        </p>
      )}
    </section>
  );
}
