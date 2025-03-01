import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.sass';

export default function Diff() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const minYear = 1950;
  const maxYear = currentYear + 50; // 올해 + 50년

  // 시작 날짜 (오늘 날짜 기본값)
  const [startYear, setStartYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(today.getMonth() + 1);
  const [startDay, setStartDay] = useState(today.getDate());

  // 종료 날짜 (기본값: 오늘과 동일)
  const [endYear, setEndYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(today.getMonth() + 1);
  const [endDay, setEndDay] = useState(today.getDate());

  const [differenceText, setDifferenceText] = useState('');

  // 연도 범위 설정
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 월별 최대 일수 계산
  const getMaxDays = (year: number, month: number) => new Date(year, month, 0).getDate();
  const maxStartDays = getMaxDays(startYear, startMonth);
  const startDays = Array.from({ length: maxStartDays }, (_, i) => i + 1);

  const maxEndDays = getMaxDays(endYear, endMonth);
  const endDays = Array.from({ length: maxEndDays }, (_, i) => i + 1);

  // 날짜 차이 계산
  const calculateDifference = () => {
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 일수 차이

    let resultText = `<p><strong>${dayDiff}일</strong> 차이입니다.</p>`;

    if (dayDiff >= 365) {
      const years = Math.floor(dayDiff / 365);
      const remainingDays = dayDiff % 365;
      const months = Math.floor(remainingDays / 30);
      const days = remainingDays % 30;
      resultText += `<p><strong>${years}년 ${months}개월 ${days}일</strong> 입니다.</p>`;
    } else if (dayDiff >= 30) {
      const months = Math.floor(dayDiff / 30);
      const days = dayDiff % 30;
      resultText += `<p><strong>${months}개월 ${days}일</strong> 입니다.</p>`;
    }

    setDifferenceText(resultText);
  };

  useEffect(() => {
    if (startDay > maxStartDays) setStartDay(maxStartDays);
  }, [startMonth, startYear]);

  useEffect(() => {
    if (endDay > maxEndDays) setEndDay(maxEndDays);
  }, [endMonth, endYear]);

  return (
    <section className={styles.section}>
      <h2>날짜 차이 계산</h2>
      <form>
        <fieldset>
          <legend>날짜 차이 세팅 폼</legend>
          <div className={styles.diff}>
            <div className={styles.group}>
              <label htmlFor="diff-start-year">시작일</label>
              <select id="diff-start-year" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <label htmlFor="diff-start-year">년</label>
            </div>
            <div className={styles.group}>
              <select id="diff-start-month" value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <label htmlFor="diff-start-month">월</label>
            </div>
            <div className={styles.group}>
              <select id="diff-start-day" value={startDay} onChange={(e) => setStartDay(Number(e.target.value))}>
                {startDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <label htmlFor="diff-start-month">일</label>
            </div>
          </div>
          <div className={styles.diff}>
            <div className={styles.group}>
              <label htmlFor="diff-end-year">종료일</label>
              <select id="diff-end-year" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <label htmlFor="diff-end-year">년</label>
            </div>
            <div className={styles.group}>
              <select id="diff-end-month" value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))}>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <label htmlFor="diff-end-month">월</label>
            </div>
            <div className={styles.group}>
              <select id="diff-end-day" value={endDay} onChange={(e) => setEndDay(Number(e.target.value))}>
                {endDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <label htmlFor="diff-end-day">일</label>
            </div>
          </div>
          <button type="button" onClick={calculateDifference} className="bg-blue-500 text-white px-3 py-1 rounded">
            계산
          </button>
        </fieldset>
      </form>

      <div className="mt-4 text-lg font-bold" dangerouslySetInnerHTML={{ __html: differenceText }} />
    </section>
  );
}
