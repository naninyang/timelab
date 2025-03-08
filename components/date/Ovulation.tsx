import { useState } from 'react';
import { Checked, Unchecked } from '../Svgs';
import styles from '@/styles/Home.module.sass';

const getDateOptions = (minOffset: number, maxOffset: number) => {
  const today = new Date();
  return Array.from({ length: maxOffset - minOffset + 1 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + minOffset + i);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  });
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

const Ovulation = () => {
  const minLastPeriod = -40;
  const maxLastPeriod = 40;
  const minPrevPeriod = -80;
  const maxPrevPeriod = -40;

  const lastPeriodOptions = getDateOptions(minLastPeriod, maxLastPeriod);
  const prevPeriodOptions = getDateOptions(minPrevPeriod, maxPrevPeriod);

  const getYearRange = (options: { year: number }[]) => {
    return [...new Set(options.map((date) => date.year))];
  };

  const lastPeriodYears = getYearRange(lastPeriodOptions);
  const prevPeriodYears = getYearRange(prevPeriodOptions);

  const [selectedLastPeriod, setSelectedLastPeriod] = useState(lastPeriodOptions[40]);
  const [selectedPrevPeriod, setSelectedPrevPeriod] = useState(prevPeriodOptions[40]);
  const [cycleLength, setCycleLength] = useState(28);
  const [unknownCycle, setUnknownCycle] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUnknownCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnknownCycle(e.target.checked);
    if (e.target.checked) {
      setSelectedPrevPeriod(prevPeriodOptions[40]);
    }
  };

  const handleCalculate = () => {
    if (
      unknownCycle &&
      new Date(selectedPrevPeriod.year, selectedPrevPeriod.month - 1, selectedPrevPeriod.day) >=
        new Date(selectedLastPeriod.year, selectedLastPeriod.month - 1, selectedLastPeriod.day)
    ) {
      setResult('<p>그전 생리일은 최근 생리일과 같거나 미래일 수 없습니다.</p>');
      return;
    }

    const baseDate = unknownCycle
      ? new Date(selectedPrevPeriod.year, selectedPrevPeriod.month - 1, selectedPrevPeriod.day)
      : new Date(selectedLastPeriod.year, selectedLastPeriod.month - 1, selectedLastPeriod.day);
    const cycleDays = unknownCycle
      ? Math.round(
          (new Date(selectedLastPeriod.year, selectedLastPeriod.month - 1, selectedLastPeriod.day).getTime() -
            baseDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : cycleLength;

    const ovulationDate = new Date(baseDate);
    ovulationDate.setDate(baseDate.getDate() + cycleDays - 14);

    const nextPeriodDate = new Date(baseDate);
    nextPeriodDate.setDate(baseDate.getDate() + cycleDays);

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const ovulationDayName = weekDays[ovulationDate.getDay()];
    const nextPeriodDayName = weekDays[nextPeriodDate.getDay()];

    setResult(
      `<p><span>배란예정일은 <strong>${ovulationDate.getMonth() + 1}월 ${ovulationDate.getDate()}일 (${ovulationDayName}요일, D-${
        cycleDays - 14
      }일)이며</strong></span>
     다음 예상 생리일은 <strong>${nextPeriodDate.getMonth() + 1}월 ${nextPeriodDate.getDate()}일 (${nextPeriodDayName}요일, ${cycleDays}일 주기)</strong>입니다.</p>`,
    );
  };

  return (
    <section
      className={`${styles.section} ${styles['section-ovulation']} ${styles['section-half']} ${styles['section-anthor']} ${styles['section-female']}`}
    >
      <h2>배란일 계산</h2>
      <div className={styles.form}>
        <div className={styles.fieldset}>
          <label htmlFor="ovu-after-year" className={styles.anthor}>
            최근 생리 시작일을 입력해 주세요
          </label>
          <div className={styles.diff}>
            <div className={styles.group}>
              <select
                id="ovu-after-year"
                value={selectedLastPeriod.year}
                onChange={(e) => setSelectedLastPeriod({ ...selectedLastPeriod, year: Number(e.target.value) })}
              >
                {lastPeriodYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label htmlFor="ovu-after-year">년</label>
            </div>
            <div className={styles.group}>
              <select
                id="ovu-after-month"
                value={selectedLastPeriod.month}
                onChange={(e) => setSelectedLastPeriod({ ...selectedLastPeriod, month: Number(e.target.value) })}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <label htmlFor="ovu-after-month">월</label>
            </div>
            <div className={styles.group}>
              <select
                id="ovu-after-day"
                value={selectedLastPeriod.day}
                onChange={(e) => setSelectedLastPeriod({ ...selectedLastPeriod, day: Number(e.target.value) })}
              >
                {Array.from(
                  { length: getDaysInMonth(selectedLastPeriod.year, selectedLastPeriod.month) },
                  (_, i) => i + 1,
                ).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <label htmlFor="ovu-after-day">일</label>
            </div>
          </div>
          <div className={styles.diff}>
            <div className={styles.checkbox}>
              <input id="cycle" type="checkbox" checked={unknownCycle} onChange={handleUnknownCycleChange} />
              {unknownCycle ? (
                <div className={styles.checked}>
                  <Checked />
                </div>
              ) : (
                <div className={styles.unchecked}>
                  <Unchecked />
                </div>
              )}
              <label htmlFor="cycle">주기 모름</label>
            </div>
            {unknownCycle ? (
              <div className={styles.diff}>
                <label className={styles.anthor}>그전 생리 시작일을 입력해 주세요.</label>
                <div className={styles.group}>
                  <select
                    id="ovu-before-year"
                    value={selectedPrevPeriod.year}
                    onChange={(e) => setSelectedPrevPeriod({ ...selectedPrevPeriod, year: Number(e.target.value) })}
                  >
                    {prevPeriodYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="ovu-before-year">년</label>
                </div>
                <div className={styles.group}>
                  <select
                    id="ovu-before-month"
                    value={selectedPrevPeriod.month}
                    onChange={(e) => setSelectedPrevPeriod({ ...selectedPrevPeriod, month: Number(e.target.value) })}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="ovu-before-month">월</label>
                </div>
                <div className={styles.group}>
                  <select
                    id="ovu-before-day"
                    value={selectedPrevPeriod.day}
                    onChange={(e) => setSelectedPrevPeriod({ ...selectedPrevPeriod, day: Number(e.target.value) })}
                  >
                    {Array.from(
                      { length: getDaysInMonth(selectedPrevPeriod.year, selectedPrevPeriod.month) },
                      (_, i) => i + 1,
                    ).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="ovu-before-day">일</label>
                </div>
              </div>
            ) : (
              <div className={styles.diff}>
                <label htmlFor="ovu-term" className={styles.anthor}>
                  월경 주기
                </label>
                <div className={styles.group}>
                  <select id="ovu-term" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))}>
                    {Array.from({ length: 21 }, (_, i) => i + 20).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="ovu-term">일</label>
                </div>
              </div>
            )}
          </div>
          <div className={styles.submit}>
            <button type="button" onClick={handleCalculate}>
              <span>계산</span>
            </button>
          </div>
        </div>
      </div>
      {result && <div className={styles.result} dangerouslySetInnerHTML={{ __html: result }} />}
    </section>
  );
};

export default Ovulation;
