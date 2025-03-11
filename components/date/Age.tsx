import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.sass';

const getZodiac = (year: number, month: number, day: number) => {
  const zodiac = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  const zodiacYear = month < 2 || (month === 2 && day < 4) ? year - 1 : year;
  return zodiac[(zodiacYear - 4) % 12];
};

export default function Age() {
  const today = new Date();
  const maxYear = today.getFullYear() + 50;
  const minYear = 1950;

  const [birthYear, setBirthYear] = useState(1980);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [refYear, setRefYear] = useState(today.getFullYear());
  const [refMonth, setRefMonth] = useState(today.getMonth() + 1);
  const [refDay, setRefDay] = useState(today.getDate());
  const [result, setResult] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    if (birthDay > getDaysInMonth(birthYear, birthMonth)) {
      setBirthDay(getDaysInMonth(birthYear, birthMonth));
    }
  }, [birthYear, birthMonth, birthDay]);

  const calculateAge = () => {
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const refDate = new Date(refYear, refMonth - 1, refDay);

    if (birthDate > refDate) {
      setResult('출생일은 기준일보다 미래일 수 없습니다');
      return;
    }

    if (birthDate.getTime() === refDate.getTime()) {
      setResult('오늘 출생했습니다.');
      return;
    }

    let age = refYear - birthYear;
    if (refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)) {
      age--;
    }

    const zodiac = getZodiac(birthYear, birthMonth, birthDay);
    const koreanAge = refYear - birthYear + 1;

    setResult(
      `<p><span>만 <strong>${age}세 (${zodiac}띠)</strong>,</span> <span>연나이 <strong>${koreanAge - 1}세</strong>입니다.</span></p>`,
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>나이 계산</h2>
        <div className={styles.form}>
          <div className={styles.fieldset}>
            <div className={styles['event-container']}>
              <div className={`${styles.ymd} ${styles.lymd}`}>
                <div className={styles.group}>
                  <label htmlFor="">출생일</label>
                  <select value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value))}>
                    {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">년</label>
                </div>
                <div className={styles.group}>
                  <select value={birthMonth} onChange={(e) => setBirthMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">월</label>
                </div>
                <div className={styles.group}>
                  <select value={birthDay} onChange={(e) => setBirthDay(Number(e.target.value))}>
                    {Array.from({ length: getDaysInMonth(birthYear, birthMonth) }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">일</label>
                </div>
              </div>
              <div className={`${styles.ymd} ${styles.lymd}`}>
                <div className={styles.group}>
                  <label>기준일</label>
                  <select value={refYear} onChange={(e) => setRefYear(Number(e.target.value))}>
                    {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">년</label>
                </div>
                <div className={styles.group}>
                  <select value={refMonth} onChange={(e) => setRefMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">월</label>
                </div>
                <div className={styles.group}>
                  <select value={refDay} onChange={(e) => setRefDay(Number(e.target.value))}>
                    {Array.from({ length: getDaysInMonth(refYear, refMonth) }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <div className={styles.group}></div>
                  <label htmlFor="">일</label>
                </div>
              </div>
            </div>
            <div className={styles.submit}>
              <button type="button" onClick={calculateAge}>
                <span>계산</span>
              </button>
            </div>
            <div className={styles.notice}>
              <p>* 띠는 입춘 기준으로 달라집니다.</p>
            </div>
          </div>
        </div>
        <div
          className={`${styles.result} ${styles['result-age']}`}
          dangerouslySetInnerHTML={{ __html: result || '' }}
        />
      </div>
    </section>
  );
}
