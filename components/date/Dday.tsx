import { useEffect, useState } from 'react';
import { format, differenceInDays, isToday } from 'date-fns';
import { Switch } from '../Svgs';
import styles from '@/styles/Home.module.sass';

interface DateState {
  year: number;
  month: number;
  day: number;
}

const getCurrentDate = (): DateState => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
};

const generateOptions = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export default function Dday() {
  const [today] = useState(getCurrentDate());

  const [baseDate, setBaseDate] = useState<DateState>(today);
  const [dDay, setDDay] = useState<DateState>(today);
  const [isTodaySelected, setIsTodaySelected] = useState(true);
  const [result, setResult] = useState('');
  const [dayOfWeekResult, setDayOfWeekResult] = useState('');

  useEffect(() => {
    if (isTodaySelected) {
      setDDay(today);
    }
  }, [isTodaySelected, today]);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<DateState>>,
    field: keyof DateState,
    value: number,
  ) => {
    setter((prev) => {
      const newDate = { ...prev, [field]: value };
      if (field === 'year' || field === 'month') {
        const maxDay = getDaysInMonth(newDate.year, newDate.month);
        if (newDate.day > maxDay) {
          newDate.day = maxDay;
        }
      }
      return newDate;
    });
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

    const daysOfWeek = {
      Sunday: '일요일',
      Monday: '월요일',
      Tuesday: '화요일',
      Wednesday: '수요일',
      Thursday: '목요일',
      Friday: '금요일',
      Saturday: '토요일',
    };

    const baseDayOfWeek = daysOfWeek[format(base, 'EEEE') as keyof typeof daysOfWeek];
    const targetDayOfWeek = daysOfWeek[format(target, 'EEEE') as keyof typeof daysOfWeek];

    setResult(
      `<strong>${format(target, 'yyyy년 M월 d일')}</strong>은 <strong>D${diff === 0 ? '-day' : diff > 0 ? '+' + diff : diff}</strong>`,
    );
    setDayOfWeekResult(
      `디데이 <strong>${format(target, 'yyyy년 M월 d일')}</strong>은 <strong>${targetDayOfWeek}</strong>이며,
     <span>기준일 <strong>${format(base, 'yyyy년 M월 d일')}</strong>은 <strong>${baseDayOfWeek}</strong>입니다.</span>`,
    );
  };

  return (
    <section className={`${styles.section} ${styles['section-dday']}`}>
      <div className={styles.module}>
        <h2>디데이 계산</h2>
        <div className={styles.form}>
          <div className={styles.fieldset}>
            <div className={styles.wrapper}>
              <div className={`${styles.ymd} ${styles.lymd}`}>
                <div className={styles.group}>
                  <label htmlFor="dd-start-year">디데이</label>
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
                    {generateOptions(1, getDaysInMonth(baseDate.year, baseDate.month)).map((day) => (
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
              <div className={`${styles.ymd} ${styles.lymd}`}>
                <div className={styles.dday}>
                  <div className={styles.group}>
                    <label htmlFor="dd-end">기준일</label>
                    <select
                      id="dd-end"
                      value={isTodaySelected ? 'today' : 'custom'}
                      onChange={(e) => setIsTodaySelected(e.target.value === 'today')}
                    >
                      <option value="today">오늘</option>
                      <option value="custom">지정날짜</option>
                    </select>
                  </div>
                </div>
                {!isTodaySelected && (
                  <div className={styles.ymd}>
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
                        {generateOptions(1, getDaysInMonth(dDay.year, dDay.month)).map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="dd-end-day">일</label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.submit}>
              <button type="button" onClick={handleCalculate}>
                <span>계산</span>
              </button>
            </div>
            <div className={styles.notice}>
              <p>* 디데이는 당일이므로 0일(D-day)로 처리됩니다.</p>
              <p>* 디데이 이전은 ‘-’, 다음은 ‘+’ 처리됩니다.</p>
            </div>
          </div>
        </div>

        {result && dayOfWeekResult && (
          <div className={`${styles.result} ${styles['dd-result']}`}>
            <p dangerouslySetInnerHTML={{ __html: result }} />
            <p dangerouslySetInnerHTML={{ __html: dayOfWeekResult }} />
          </div>
        )}
      </div>
    </section>
  );
}
