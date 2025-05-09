import { useState } from 'react';
import RippleButton from '../RippleButton';
import styles from '@/styles/Home.module.sass';

interface DateInfo {
  year: number;
  month: number;
  day: number;
}

interface PregnancyResult {
  weeks: number;
  days: number;
  dueYear: number;
  dueMonth: number;
  dueDay: number;
  dueWeekDay: string;
  remainingDays: number;
  progressPercent: string;
}

const getToday = (): DateInfo => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
};

const getMinDate = (): DateInfo => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 280);
  return {
    year: minDate.getFullYear(),
    month: minDate.getMonth() + 1,
    day: minDate.getDate(),
  };
};

const calculatePregnancy = (year: number, month: number, day: number): PregnancyResult => {
  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = today.getTime() - selectedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  const dueDate = new Date(selectedDate);
  dueDate.setDate(dueDate.getDate() + 280);
  const weekDay = ['일', '월', '화', '수', '목', '금', '토'][dueDate.getDay()];

  const remainingDays = Math.max(280 - diffDays, 0);
  const progressPercent = ((diffDays / 280) * 100).toFixed(2);

  return {
    weeks,
    days,
    dueYear: dueDate.getFullYear(),
    dueMonth: dueDate.getMonth() + 1,
    dueDay: dueDate.getDate(),
    dueWeekDay: weekDay,
    remainingDays,
    progressPercent,
  };
};

export default function Pregnancy() {
  const today = getToday();
  const minDate = getMinDate();
  const [year, setYear] = useState<number>(today.year);
  const [month, setMonth] = useState<number>(today.month);
  const [day, setDay] = useState<number>(today.day);
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const handleCcalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculatePregnancy(year, month, day);
    setResult(res);
  };

  return (
    <section className={`${styles.section} ${styles['section-half']} ${styles['section-female']}`}>
      <div className={styles.module}>
        <h2>출산예정일 계산</h2>
        <form onSubmit={handleCcalculate}>
          <fieldset>
            <legend>출산예정일 계산폼</legend>
            <label htmlFor="pre-year" className={styles.anthor}>
              마지막 월경 시작일을 입력해 주세요
            </label>
            <div className={styles.ymd}>
              <div className={styles.group}>
                <select id="pre-year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {Array.from({ length: today.year - minDate.year + 1 }, (_, i) => minDate.year + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <label htmlFor="pre-year">년</label>
              </div>
              <div className={styles.group}>
                <select id="pre-month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <label htmlFor="pre-month">월</label>
              </div>
              <div className={styles.group}>
                <select id="pre-day" value={day} onChange={(e) => setDay(Number(e.target.value))}>
                  {Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <label htmlFor="pre-day">일</label>
              </div>
            </div>
            <div className={styles.submit}>
              <RippleButton type="submit">계산</RippleButton>
            </div>
            <div className={styles.notice}>
              <p>계산결과는 Naegele’s rule에 근거하여 계산된 결과입니다.</p>
              <p>임부의 컨디션과 건강 상태, 환경 차이로 출산일이 달라질 수 있습니다.</p>
            </div>
          </fieldset>
        </form>
        {result && (
          <div className={styles['result-container']} role="status" aria-live="polite" aria-atomic="true">
            <dl>
              <div>
                <dt>임신주수</dt>
                <dd>
                  {result.weeks}주 {result.days}일째
                </dd>
              </div>
              <div>
                <dt>출산예정</dt>
                <dd>
                  {result.dueYear}년 {result.dueMonth}월 {result.dueDay}일 ({result.dueWeekDay})
                </dd>
              </div>
            </dl>
            <div className={styles.progress}>
              <div
                className={styles['progress-bar']}
                role="progressbar"
                aria-label="이벤트 도달 상태"
                aria-valuenow={Number(result.progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={styles.progressing} style={{ width: `${result.progressPercent}%` }} />
              </div>
              <p>
                D-{result.remainingDays} ({result.progressPercent}% 진행)
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
