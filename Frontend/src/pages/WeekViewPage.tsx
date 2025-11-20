import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfDay,
  addMinutes,
} from "date-fns";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/eventsApi";
import { CalendarEvent } from "../types/Event";
import CalendarHeader from "../components/calendar/CalendarHeader";
import WeekGrid from "../components/calendar/WeekGrid";
import EventModal from "../components/calendar/EventModal";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const WeekViewPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [slotCreateInfo, setSlotCreateInfo] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }), // Monday
    [currentDate]
  );
  const weekEnd = useMemo(
    () => endOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  useEffect(() => {
    const load = async () => {
      const data = await fetchEvents(weekStart.toISOString(), weekEnd.toISOString());
      setEvents(data);
    };
    load();
  }, [weekStart, weekEnd]);

  const handlePrevWeek = () => {
    setCurrentDate((d) => addDays(d, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate((d) => addDays(d, 7));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleSlotClick = (day: Date, hour: number) => {
    const start = addMinutes(startOfDay(day), hour * 60);
    const end = addMinutes(start, 60);
    setSlotCreateInfo({ start, end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSlotCreateInfo(null);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: {
    title: string;
    description?: string;
    start: string;
    end: string;
    color?: string;
    _id?: string;
  }) => {
    if (payload._id) {
      const updated = await updateEvent(payload._id, payload);
      setEvents((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );
    } else {
      const created = await createEvent(payload);
      setEvents((prev) => [...prev, created]);
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSlotCreateInfo(null);
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e._id !== id));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />
      <WeekGrid
        days={days}
        hours={HOURS}
        events={events}
        onSlotClick={handleSlotClick}
        onEventClick={handleEventClick}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSlotCreateInfo(null);
        }}
        initialEvent={selectedEvent}
        slotInfo={slotCreateInfo}
        onSave={handleSave}
        onDelete={
          selectedEvent && selectedEvent._id
            ? () => handleDelete(selectedEvent._id!)
            : undefined
        }
      />
    </div>
  );
};

export default WeekViewPage;
