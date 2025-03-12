import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { getCalendarEvents } from '@/lib/apis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { start, end } = req.query;

    const today = dayjs();
    const startDate = (start as string) || today.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
    const endDate = (end as string) || today.add(1, 'month').endOf('month').format('YYYY-MM-DD');

    const events = await getCalendarEvents(startDate, endDate);
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}
