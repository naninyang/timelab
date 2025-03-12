import { useEffect, useState } from 'react';
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

export default function Kalender() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadedMonths, setLoadedMonths] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents(dayjs().subtract(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month'));
  }, []);

  const fetchEvents = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
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
  };

  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case '기념':
        return '#007000';
      case '기타':
        return '#787878';
      case '법정공휴일':
        return '#B3261E';
      default:
        return 'gray';
    }
  };

  return (
    <section className={`${styles.section} ${styles['section-calendar']}`}>
      <div className={styles.module}>
        <h2>대한민국 디지털 달력</h2>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locales={[koLocale]}
          locale="ko"
          events={events.map((event) => ({
            id: event.id,
            title: event.name,
            start: event.dateStart,

            // fullcalendar에 존재하는 버그로 임시 +1일 처리함
            end: event.dateEnd ? dayjs(event.dateEnd).add(1, 'day').format('YYYY-MM-DD') : event.dateStart,

            backgroundColor: getEventColor(event.event),
            borderColor: getEventColor(event.event),
          }))}
          datesSet={(info) => {
            const start = dayjs(info.start);
            const end = dayjs(info.end);
            fetchEvents(start, end);
          }}
        />
      </div>
    </section>
  );
}
