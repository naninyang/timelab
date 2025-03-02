import { useEffect, useState } from 'react';
import { format, differenceInDays, isToday } from 'date-fns';
import { Switch } from '../Svgs';
import styles from '@/styles/Home.module.sass';

const getCurrentDate = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
};

const generateOptions = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export default function Dday() {
  const today = getCurrentDate();

  const [baseDate, setBaseDate] = useState(today);
  const [dDay, setDDay] = useState(today);
  const [isTodaySelected, setIsTodaySelected] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (isTodaySelected) {
      setDDay(today);
    }
  }, [isTodaySelected]);

  const handleChange = (setter: (value: any) => void, field: 'year' | 'month' | 'day', value: number) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const toggleDates = () => {
    setBaseDate(dDay);
    setDDay(baseDate);

    const newTargetDate = new Date(baseDate.year, baseDate.month - 1, baseDate.day);
    const isBaseToday = isToday(newTargetDate);
    setIsTodaySelected(isBaseToday);
    if (isBaseToday) {
      setDDay(today);
    }
  };

  const handleCalculate = () => {
    if (isTodaySelected) {
      setDDay(today);
    }
    const base = new Date(baseDate.year, baseDate.month - 1, baseDate.day);
    const target = new Date(dDay.year, dDay.month - 1, dDay.day);
    const diff = differenceInDays(target, base);

    setResult(
      `<strong>${format(target, 'yyyy년 M월 d일')}</strong>은 <strong>D${diff === 0 ? '-day' : diff > 0 ? '+' + diff : diff}</strong>`,
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.headline}>
        <h2>디데이 계산</h2>
      </div>
      <form>
        <fieldset>
          <legend>디데이 세팅 폼</legend>
          <div className={styles.diff}>
            <div className={styles.group}>
              <label htmlFor="dd-start-year">기준일</label>
              <select
                id="dd-start-year"
                value={baseDate.year}
                onChange={(e) => handleChange(setBaseDate, 'year', Number(e.target.value))}
              >
                {generateOptions(2000, 2100).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label htmlFor="dd-start-year">년</label>
            </div>
            <div className={styles.group}>
              <select
                id="dd-start-month"
                value={baseDate.month}
                onChange={(e) => handleChange(setBaseDate, 'month', Number(e.target.value))}
              >
                {generateOptions(1, 12).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <label htmlFor="dd-start-month">월</label>
            </div>
            <div className={styles.group}>
              <select
                id="dd-start-day"
                value={baseDate.day}
                onChange={(e) => handleChange(setBaseDate, 'day', Number(e.target.value))}
              >
                {generateOptions(1, 31).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <label htmlFor="dd-start-day">일</label>
            </div>
          </div>
          <div className={styles.switch}>
            <button type="button" onClick={toggleDates} className={styles.switcher}>
              <Switch />
              <span>날짜 교체</span>
            </button>
          </div>
          <div className={styles.dday}>
            <div className={styles.group}>
              <label htmlFor="dd-end">디데이</label>
              <select
                id="dd-end"
                value={isTodaySelected ? 'today' : 'custom'}
                onChange={(e) => setIsTodaySelected(e.target.value === 'today')}
              >
                <option value="today">오늘</option>
                <option value="custom">날짜 지정</option>
              </select>
            </div>
          </div>
          {!isTodaySelected && (
            <div className={styles.diff}>
              <div className={styles.group}>
                <select
                  id="dd-end-year"
                  value={dDay.year}
                  onChange={(e) => handleChange(setDDay, 'year', Number(e.target.value))}
                >
                  {generateOptions(2000, 2100).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <label htmlFor="dd-end-year">년</label>
              </div>
              <div className={styles.group}>
                <select
                  id="dd-end-month"
                  value={dDay.month}
                  onChange={(e) => handleChange(setDDay, 'month', Number(e.target.value))}
                >
                  {generateOptions(1, 12).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <label htmlFor="dd-end-month">월</label>
              </div>
              <div className={styles.group}>
                <select
                  id="dd-end-day"
                  value={dDay.day}
                  onChange={(e) => handleChange(setDDay, 'day', Number(e.target.value))}
                >
                  {generateOptions(1, 31).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <label htmlFor="dd-end-day">일</label>
              </div>
            </div>
          )}
          <button type="button" onClick={handleCalculate}>
            <span>계산</span>
          </button>
        </fieldset>
      </form>

      {result && (
        <div className={`${styles.result} ${styles['dd-result']}`}>
          <p dangerouslySetInnerHTML={{ __html: result }}></p>
        </div>
      )}
    </section>
  );
}
