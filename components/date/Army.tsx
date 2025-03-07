import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from '@/styles/Home.module.sass';

const SERVICE_PERIODS: Record<string, number> = {
  육군: 547,
  공군: 639,
  해군: 609,
  해병대: 547,
  해양의무경찰: 609,
  의무경찰: 547,
  의무소방관: 609,
  사회복무요원: 639,
};

const today = dayjs();
const minYear = today.year() - 3;
const maxYear = today.year() + 3;

export default function Army() {
  const [year, setYear] = useState(today.year());
  const [month, setMonth] = useState(today.month() + 1);
  const [day, setDay] = useState(today.date());
  const [serviceType, setServiceType] = useState('육군');
  const [calculatedData, setCalculatedData] = useState<{
    dischargeDate: dayjs.Dayjs;
    todayDiff: number;
    progress: number;
  } | null>(null);

  const handleCalculate = () => {
    const enlistDate = dayjs(`${year}-${month}-${day}`);
    const dischargeDate = enlistDate.add(SERVICE_PERIODS[serviceType], 'day');
    const todayDiff = today.diff(enlistDate, 'day');
    const totalServiceDays = SERVICE_PERIODS[serviceType];
    const progress = Math.max(0, Math.min(100, Math.round((todayDiff / totalServiceDays) * 100)));
    setCalculatedData({ dischargeDate, todayDiff, progress });
  };

  return (
    <section className={`${styles.section} ${styles['section-army']}`}>
      <h2>전역일 계산</h2>
      <div className={styles.form}>
        <div className={styles.fieldset}>
          <div className={styles.army}>
            <div className={styles.ymd}>
              <div className={styles.group}>
                <label htmlFor="army-start-year">입대일</label>
                <select id="army-start-year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <label htmlFor="army-start-year">년</label>
              </div>
              <div className={styles.group}>
                <select id="army-start-month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <label htmlFor="army-start-month">월</label>
              </div>
              <div className={styles.group}>
                <select id="army-start-day" value={day} onChange={(e) => setDay(Number(e.target.value))}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <label htmlFor="army-start-day">일</label>
              </div>
            </div>
            <div className={styles.select}>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                {Object.keys(SERVICE_PERIODS).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" onClick={handleCalculate}>
            <span>계산</span>
          </button>
        </div>
      </div>
      {calculatedData && (
        <div className={styles['result-container']}>
          {today.isAfter(calculatedData.dischargeDate) ? (
            <p>이미 전역/해제소집 되었습니다.</p>
          ) : (
            <>
              <ul>
                <li>
                  {calculatedData.dischargeDate.format('YYYY년 M월 D일')} 전역. (D-
                  {calculatedData.dischargeDate.diff(today, 'day')})
                </li>
                <li>
                  총 복무일 {SERVICE_PERIODS[serviceType]}일
                  {calculatedData.todayDiff >= 0 && ` (${calculatedData.todayDiff}일 복무 중)`}
                </li>
              </ul>
              <div className={styles.progress}>
                <div
                  className={styles['progress-bar']}
                  role="progressbar"
                  aria-label="이벤트 도달 상태"
                  aria-valuenow={calculatedData.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className={styles.progressing} style={{ width: `${calculatedData.progress}%` }}></div>
                </div>
                <p>{calculatedData.progress}%</p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
