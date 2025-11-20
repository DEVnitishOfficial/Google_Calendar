import axios from "axios";
import { CalendarEvent } from "../types/Event";

const api = axios.create({
  baseURL: "http://localhost:3003/api/v1",
});

export const fetchEvents = async (start: string, end: string) => {
  const res = await api.get<CalendarEvent[]>("/event", {
    params: { start, end },
  });
  return res.data;
};

export const createEvent = async (event: Omit<CalendarEvent, "_id">) => {
  const res = await api.post<CalendarEvent>("/event", event);
  return res.data;
};

export const updateEvent = async (
  id: string,
  updates: Partial<CalendarEvent>
) => {
  const res = await api.put<CalendarEvent>(`/event/${id}`, updates);
  return res.data;
};

export const deleteEvent = async (id: string) => {
  await api.delete(`/event/${id}`);
};
