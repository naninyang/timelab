export interface NotionProperty {
  id: string;
  type: 'number' | 'title' | 'rich_text' | 'created_time' | 'date' | 'select';
  number?: number | null;
  title?: { text: { content: string } }[];
  rich_text?: { plain_text: string }[];
  created_time?: string;
  date?: {
    start: string;
    end: string | null;
    time_zone: string | null;
  };
  select?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface NotionPage {
  object: 'page';
  id: string;
  archived: boolean;
  in_trash: boolean;
  properties: Record<string, NotionProperty>;
  request_id: string;
}
