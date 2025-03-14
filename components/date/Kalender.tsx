import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import dayjs from 'dayjs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko';
import styles from '@/styles/Home.module.sass';

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
          setEvents((prev) => [...prev, ...data.events]);
          setLoadedMonths((prev) => [...prev, startMonth]);
        })
        .catch((error) => console.error('Error fetching calendar events:', error));
    },
    [loadedMonths],
  );

  useEffect(() => {
    fetchEvents(dayjs().subtract(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month'));
  }, [fetchEvents]);

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

  return (
    <section className={`${styles.section} ${styles['section-calendar']} ${isMobile ? '_coffee' : '_latte'}`}>
      <div className={styles.module}>
        <h2>대한민국 디지털 달력</h2>
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

            // fullcalendar에 존재하는 버그로 임시 +1일 처리함
            end: event.dateEnd ? dayjs(event.dateEnd).add(1, 'day').format('YYYY-MM-DD') : event.dateStart,

            classNames: getEventClass(event.event),
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
        <div className={styles.notice}>
          <p>대한민국 디지털 달력은 대한민국의 역사적, 사회적, 문화적 사건을 기록하고 제공하는 목적으로 운영됩니다.</p>
          <p>포함된 일정은 공식적으로 보도되거나 사회적으로 주목받은 사건들을 기반으로 합니다.</p>
          <p>특정 정치적 입장을 지지하거나 반대하는 것이 아니며, 단순히 정보 제공의 목적으로 등록됩니다.</p>
        </div>
      </div>
    </section>
  );
}
