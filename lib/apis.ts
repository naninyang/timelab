import { Client as NotionClient } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionProperty } from '@/types';

const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });
const notionDatabaseID = process.env.NOTION_DATABASE_ID || '';

export async function getCalendarEvents(startDate: string, endDate: string) {
  try {
    let hasMore = true;
    let startCursor: string | undefined = undefined;
    let allResults: QueryDatabaseResponse['results'] = [];

    while (hasMore) {
      const response: QueryDatabaseResponse = await notion.databases.query({
        database_id: notionDatabaseID,
        filter: {
          and: [
            {
              property: 'Date',
              date: {
                on_or_after: startDate,
              },
            },
            {
              property: 'Date',
              date: {
                on_or_before: endDate,
              },
            },
          ],
        },
        sorts: [
          {
            property: 'Date',
            direction: 'ascending',
          },
        ],
        start_cursor: startCursor,
        page_size: 100,
      });

      allResults = [...allResults, ...response.results];

      hasMore = response.has_more;
      startCursor = response.next_cursor || undefined;
    }

    return allResults
      .filter((page) => 'properties' in page)
      .map((page) => {
        const properties = page.properties as Record<string, NotionProperty>;
        return {
          id: page.id,
          name: properties.Name?.title?.[0]?.text?.content || '',
          dateStart: properties.Date?.date?.start || null,
          dateEnd: properties.Date?.date?.end || null,
          event: properties.Event?.select?.name || '',
        };
      });
  } catch (error) {
    console.error('Error fetching Notion calendar data:', error);
    return [];
  }
}
