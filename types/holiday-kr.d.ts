declare module "holiday-kr" {
  export function isHoliday(date: string | Date): boolean;

  export function getHolidays(year: number): { name: string; date: string }[];

  export function getLunar(
    year: number,
    month: number,
    day: number
  ): { year: number; month: number; day: number; leapMonth: boolean; dayOfWeek: string };

  export function getSolar(
    year: number,
    month: number,
    day: number,
    isLeapMonth?: boolean
  ): { year: number; month: number; day: number; leapMonth: boolean; dayOfWeek: string };
}
