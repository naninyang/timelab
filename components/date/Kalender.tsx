import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import isBetween from 'dayjs/plugin/isBetween';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko';
import { Checked, Unchecked } from '../Svgs';
import styles from '@/styles/Home.module.sass';

dayjs.locale('ko');
dayjs.extend(isBetween);

interface Event {
  id: string;
  name: string;
  dateStart: string;
  dateEnd?: string | null;
  event: string;
}

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({
    query: `(max-width: ${991 / 16}rem)`,
  });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}

export default function Kalender() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadedMonths, setLoadedMonths] = useState<string[]>([]);
  const [layout, setLayout] = useState<'calendar' | 'timeline'>('timeline');
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const isMobile = useMobile();

  const fetchEvents = useCallback(
    (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      const correctedStart = start.startOf('month').format('YYYY-MM-DD');
      const correctedEnd = end.endOf('month').format('YYYY-MM-DD');
      const startMonth = start.format('YYYY-MM');
      if (loadedMonths.includes(startMonth)) return;

      fetch(`/api/calendar?start=${correctedStart}&end=${correctedEnd}`)
        .then((response) => response.json())
        .then((data) => {
          setEvents((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const newEvents = data.events.filter((e: Event) => !existingIds.has(e.id));
            return [...prev, ...newEvents];
          });
          setLoadedMonths((prev) => [...prev, startMonth]);
        })
        .catch((error) => console.error('Error fetching calendar events:', error));
    },
    [loadedMonths],
  );

  useEffect(() => {
    fetchEvents(dayjs().subtract(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month'));
  }, [fetchEvents]);

  useEffect(() => {
    const start = currentMonth.subtract(1, 'month');
    const end = currentMonth.add(1, 'month');
    fetchEvents(start, end);
  }, [fetchEvents, currentMonth]);

  const getEventClass = (eventType: string): string => {
    switch (eventType) {
      case '기념':
        return 'fc-event-memorial';
      case '기타':
        return 'fc-event-default';
      case '법정공휴일':
        return 'fc-event-holiday';
      default:
        return 'fc-event-default';
    }
  };

  function Timeline() {
    const monthStart = currentMonth.startOf('month');
    const monthEnd = currentMonth.endOf('month');
    const eventsInMonth = events.filter((event) => dayjs(event.dateStart).isBetween(monthStart, monthEnd, 'day', '[]'));
    const sorted = eventsInMonth.sort((a, b) => dayjs(a.dateStart).diff(dayjs(b.dateStart)));

    const grouped = sorted.reduce<Record<string, Event[]>>((acc, event) => {
      const dateKey = dayjs(event.dateStart).format('D일 (dd)');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});

    return (
      <div className={`${styles['timeline-container']} _latte`}>
        <div className={`${styles.timeline} fc`}>
          <div className={styles.headline}>
            <h3>{currentMonth.format('YYYY년 M월')}</h3>
            <div className={styles.controls}>
              <button
                type="button"
                aria-label={`이번달 (${dayjs().format('M월')})`}
                className="fc-today-button fc-button fc-button-primary"
                onClick={() => setCurrentMonth(dayjs())}
                disabled={currentMonth.isSame(dayjs(), 'month')}
              >
                이번달
              </button>
              <div className={styles['button-group']}>
                <button
                  type="button"
                  aria-label={`이전달 (${currentMonth.subtract(1, 'month').format('M월')})`}
                  className="fc-prev-button fc-button fc-button-primary"
                  onClick={() => setCurrentMonth((prev) => prev.subtract(1, 'month'))}
                >
                  <span className="fc-icon fc-icon-chevron-left" />
                </button>
                <button
                  type="button"
                  aria-label={`다음달 (${currentMonth.add(1, 'month').format('M월')})`}
                  className="fc-next-button fc-button fc-button-primary"
                  onClick={() => setCurrentMonth((prev) => prev.add(1, 'month'))}
                >
                  <span className="fc-icon fc-icon-chevron-right" />
                </button>
              </div>
            </div>
          </div>
          <ul className={styles.list}>
            {Object.entries(grouped).map(([dateKey, events]) => (
              <li key={dateKey}>
                <strong>{dateKey}</strong>
                <ul>
                  {events.map((event) => (
                    <li key={event.id}>
                      <div className={`fc-event ${getEventClass(event.event)}`}>
                        {event.dateEnd && event.dateEnd !== event.dateStart && (
                          <em>({dayjs(event.dateEnd).format('YYYY년 M월 D일')}까지)</em>
                        )}
                        <span>{event.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {Object.keys(grouped).length === 0 && <li>이달의 이벤트가 없습니다.</li>}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <section className={`${styles.section} ${styles['section-calendar']}`}>
      <div className={styles.module}>
        <div className={styles.headline}>
          <h2>대한민국 디지털 달력</h2>
          <div className={styles.checkboxes}>
            <div className={styles.checkbox}>
              <input
                type="radio"
                value="calendar"
                id="calendar"
                name="layout"
                checked={layout === 'calendar'}
                onChange={() => setLayout('calendar')}
              />
              {layout === 'calendar' ? (
                <div className={styles.checked}>
                  <Checked />
                </div>
              ) : (
                <div className={styles.unchecked}>
                  <Unchecked />
                </div>
              )}
              <label htmlFor="calendar">달력 레이아웃</label>
            </div>
            <div className={styles.checkbox}>
              <input
                type="radio"
                id="timeline"
                value="timeline"
                name="layout"
                checked={layout === 'timeline'}
                onChange={() => setLayout('timeline')}
              />
              {layout === 'timeline' ? (
                <div className={styles.checked}>
                  <Checked />
                </div>
              ) : (
                <div className={styles.unchecked}>
                  <Unchecked />
                </div>
              )}
              <label htmlFor="timeline">타임라인 레이아웃</label>
            </div>
          </div>
        </div>
        <p>달력 레이아웃이 불편하신 분들은 타임라인 레이아웃을 선택하세요</p>
        {layout === 'calendar' ? (
          <div className={isMobile ? '_coffee' : '_latte'}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locales={[koLocale]}
              locale="ko"
              height="auto"
              events={events.map((event) => ({
                id: event.id,
                title: event.name,
                start: event.dateStart,
                classNames: getEventClass(event.event),

                // fullcalendar에 존재하는 버그로 임시 +1일 처리함
                end: event.dateEnd ? dayjs(event.dateEnd).add(1, 'day').format('YYYY-MM-DD') : event.dateStart,
              }))}
              datesSet={(info) => {
                const start = dayjs(info.start);
                const end = dayjs(info.end);
                fetchEvents(start, end);
              }}
              dayCellClassNames={(arg) => {
                const hasHoliday = events.some(
                  (event) =>
                    (dayjs(event.dateStart).isSame(arg.date, 'day') ||
                      (event.dateEnd && dayjs(event.dateEnd).isSame(arg.date, 'day'))) &&
                    event.event === '법정공휴일',
                );
                return hasHoliday ? 'fc-event-holiday' : '';
              }}
            />
          </div>
        ) : (
          <Timeline />
        )}
        <div className={styles.notice}>
          <p>대한민국 디지털 달력은 대한민국의 역사적, 사회적, 문화적 사건을 기록하고 제공하는 목적으로 운영됩니다.</p>
          <p>포함된 일정은 공식적으로 보도되거나 사회적으로 주목받은 사건들을 기반으로 합니다.</p>
          <p>특정 정치적 입장을 지지하거나 반대하는 것이 아니며, 단순히 정보 제공의 목적으로 등록됩니다.</p>
        </div>
      </div>
    </section>
  );
}
