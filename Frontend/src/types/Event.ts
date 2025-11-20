export interface CalendarEvent {
  _id?: string;
  title: string;
  description?: string;
  start: string; // ISO
  end: string;   // ISO
  color?: string;
}
