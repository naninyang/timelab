import { useState, useEffect } from 'react';
import { isHoliday, getLunar, getSolar } from 'holiday-kr';
import RippleButton from '../RippleButton';
import styles from '@/styles/Home.module.sass';

const TENKAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const getGanji = (year: number) => {
  const tenkan = TENKAN[(year - 4) % 10];
  const jiji = JIJI[(year - 4) % 12];
  return `${tenkan}${jiji}년`;
};

export default function SolarLunar() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  const minYear = 1950;
  const maxYear = currentYear + 50;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [day, setDay] = useState<number>(currentDate);
  const [daysInMonth, setDaysInMonth] = useState<number>(31);
  const [conversionType, setConversionType] = useState<'solarToLunar' | 'lunarToSolar'>('solarToLunar');
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const lastDay = new Date(year, month, 0).getDate();
    setDaysInMonth(lastDay);
    if (day > lastDay) {
      setDay(lastDay);
    }
  }, [year, month, day]);

  const handleCcalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(year, month - 1, day);
    const isHolidayToday = isHoliday(dateObj);

    if (conversionType === 'solarToLunar') {
      const lunar = getLunar(year, month, day);
      const lunarGanji = getGanji(lunar.year);
      setResult(
        `<li>양력 ${year}년 ${month}월 ${day}일 (${lunar.dayOfWeek}${isHolidayToday ? ', 공휴일' : ''})</li>` +
          `<li>음력 ${lunar.year}년 (${lunarGanji}) ${lunar.month}월 ${lunar.day}일 ${lunar.leapMonth ? '윤달' : '평달'}</li>`,
      );
    } else {
      const solar = getSolar(year, month, day);
      const lunarGanji = getGanji(year);
      setResult(
        `<li>음력 ${year}년 (${lunarGanji}) ${month}월 ${day}일</li>` +
          `<li>양력 ${solar.year}년 ${solar.month}월 ${solar.day}일 (${solar.dayOfWeek}${isHolidayToday ? ', 공휴일' : ''})</li>`,
      );
    }
  };

  return (
    <section className={`${styles.section} ${styles['section-solu']}`}>
      <div className={styles.module}>
        <h2>양력/음력 변환</h2>
        <form onSubmit={handleCcalculate}>
          <fieldset>
            <legend>양력/음력 변환폼</legend>
            <div className={styles.solu}>
              <div className={styles.ymd}>
                <div className={styles.group}>
                  <select id="solu-year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="solu-year">년</label>
                </div>
                <div className={styles.group}>
                  <select id="solu-month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="solu-month">월</label>
                </div>
                <div className={styles.group}>
                  <select id="solu-day" value={day} onChange={(e) => setDay(Number(e.target.value))}>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="solu-day">일</label>
                </div>
              </div>
              <div className={styles.select}>
                <select
                  value={conversionType}
                  onChange={(e) => setConversionType(e.target.value as 'solarToLunar' | 'lunarToSolar')}
                >
                  <option value="solarToLunar">양력→음력</option>
                  <option value="lunarToSolar">음력→양력</option>
                </select>
              </div>
            </div>
            <div className={styles.submit}>
              <RippleButton type="submit">변환</RippleButton>
            </div>
            <div className={styles.notice}>
              <p>음력→양력 변환시 윤달과 평달 중 평달만 표시됩니다.</p>
            </div>
          </fieldset>
        </form>
        <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
          <ul dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      </div>
    </section>
  );
}
